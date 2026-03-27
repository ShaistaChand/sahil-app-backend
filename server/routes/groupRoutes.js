import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkGroupLimit, checkMemberLimit } from '../middleware/subscriptionLimits.js';
import { createGroup, getGroups, getGroup, updateGroup, deleteGroup } from '../controllers/groupController.js';

const router = express.Router();

router.post('/', protect, checkGroupLimit, createGroup);
router.get('/', protect, getGroups);
router.get('/:id', protect, getGroup);
router.put('/:id', protect, updateGroup);
router.delete('/:id', protect, deleteGroup);

export default router;