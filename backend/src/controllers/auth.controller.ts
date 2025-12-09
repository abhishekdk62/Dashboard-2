import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models';

interface AuthRequest extends Request {
  user?: { id: number; email: string; role: 'user' | 'admin' };
}

export const sendOtp = async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  // TODO: Implement actual OTP logic with Redis/Nodemailer
  res.json({ message: 'OTP sent', otp: '123456' }); // Demo OTP
};

export const verifyOtp = async (req: AuthRequest, res: Response) => {
  const { email, otp } = req.body;
  // TODO: Verify OTP from Redis/cache
  if (otp === '123456') {
    res.json({ message: 'OTP verified' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
};

export const completeRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const register = async (req: AuthRequest, res: Response) => {
  // Same as completeRegistration for backward compatibility
  await completeRegistration(req as any, res);
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.user!.id, {
    attributes: ['id', 'name', 'email', 'role'],
  });
  res.json(user);
};

export const logout = (req: AuthRequest, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};
