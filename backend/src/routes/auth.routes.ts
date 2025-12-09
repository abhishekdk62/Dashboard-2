import { Router } from 'express';
import {
  completeRegistration,
  login,
  register,
  getMe,
  logout,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { User } from '../models';

const router = Router();





router.post('/complete-registration', completeRegistration);
router.post('/login', login);
router.get('/me',authenticateToken, getMe);
router.post('/logout', logout);

export default router;
