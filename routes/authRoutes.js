import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { register, login, getProfile, updateProfile, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', logout);

export default router;