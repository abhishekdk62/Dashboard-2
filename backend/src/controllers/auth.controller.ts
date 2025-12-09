import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { createClient } from "redis";
import { User } from "../models";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.connect();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

// ✅ FIXED: Redis v4 + OTP Verification
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ REDIS v4: set with EX (expire seconds)
    await redisClient.set(`otp:${email.toLowerCase()}`, otp, { EX: 600 });

    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: email,
      subject: "Dashboard Signup OTP",
      text: `Dashboard signup OTP is: ${otp}`,
    });

    console.log(`OTP ${otp} sent to ${email}`);
    res.json({ message: "OTP sent" });
  } catch (error: any) {
    console.error("OTP error:", error.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// ✅ FIXED: Redis v4 + Set verification flag
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    // ✅ REDIS v4: get
    const storedOtp = await redisClient.get(`otp:${email.toLowerCase()}`);

    if (!storedOtp) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // ✅ Delete OTP + Set verification flag (10min)
    await redisClient.del(`otp:${email.toLowerCase()}`);
    await redisClient.set(`verified:${email.toLowerCase()}`, "true", {
      EX: 600,
    });

    console.log(`OTP verified for ${email}`);
    res.json({ message: "OTP verified" });
  } catch (error: any) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

// ✅ FIXED: MANDATORY OTP check before registration
export const completeRegistration = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Name, email, and password (6+ chars) required" });
    }

    // ✅ CRITICAL: Check OTP verification FIRST
    const isVerified = await redisClient.get(`verified:${email.toLowerCase()}`);
    if (!isVerified) {
      return res.status(400).json({ error: "Please verify OTP first" });
    }

    // ✅ Cleanup verification flag
    await redisClient.del(`verified:${email.toLowerCase()}`);

    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = user.dataValues;
    console.log(`User registered: ${user.email}`);
    res.json({ message: "Registration successful", user: userData });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const register = async (req: Request, res: Response) => {
  return res.status(400).json({ error: "Use OTP registration flow instead" });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid =  await bcrypt.compare(password, user.dataValues.password);

    if ( !isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });

    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = user.dataValues;
    res.json({
      message: "Login successful",
      user: userData,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const authReq = req as Request & { user?: { id: number } };

    const user = await User.findByPk(authReq.user!.id, {
      attributes: ["id", "name", "email", "role"],
    });
    res.json(user);
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(400).json({ error: "User not found" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
