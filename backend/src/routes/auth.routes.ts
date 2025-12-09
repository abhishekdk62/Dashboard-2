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

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/complete-registration', completeRegistration);
router.post('/login', login);
router.post('/register', register);
router.get('/me', getMe);
router.post('/logout', logout);

export default router;
