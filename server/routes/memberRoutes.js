import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addMember, removeMember } from '../controllers/memberController.js';

const router = express.Router();

router.post('/groups/:groupId/members', protect, addMember);
router.delete('/groups/:groupId/members/:memberId', protect, removeMember);

export default router;