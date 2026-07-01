import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkGroupLimit, checkMemberLimit } from '../middleware/subscriptionLimits.js';
import { createGroup, getGroups, getGroup, updateGroup, deleteGroup, getGroupMembers, addGroupMember } from '../controllers/groupController.js';

const router = express.Router();

router.post('/', protect, checkGroupLimit, createGroup);
// Add this line right under your other group routes:
router.post('/:id/members', protect, addGroupMember);
// Add this line right below your other members line:
router.get('/:id/members', protect, getGroupMembers);
router.get('/', protect, getGroups);
router.get('/:id', protect, getGroup);
router.put('/:id', protect, updateGroup);
router.delete('/:id', protect, deleteGroup);


export default router;