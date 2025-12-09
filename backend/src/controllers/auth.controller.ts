import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { createClient } from "redis";
import { User } from "../models";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
console.log('redis',process.env.REDIS_URL);


redisClient.connect();


export const completeRegistration = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Name, email, and password (6+ chars) required" });
    }



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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
