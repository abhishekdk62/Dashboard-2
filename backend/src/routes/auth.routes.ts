import { Router } from 'express';
import {
  sendOtp,
  verifyOtp,
  completeRegistration,
  login,
  register,
  getMe,
  logout,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { User } from '../models';

const router = Router();

router.post('/send-otp', sendOtp);




router.post('/verify-otp', verifyOtp);
router.post('/complete-registration', completeRegistration);
router.post('/login', login);
router.get('/me',authenticateToken, getMe);
router.post('/logout', logout);

export default router;
