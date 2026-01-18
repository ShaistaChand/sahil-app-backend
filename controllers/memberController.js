import Group from '../models/Group.js';
import User from '../models/User.js';

export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, email } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is group admin
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only group admin can add members' });
    }

    // Check member limit
    if (group.members.length >= 5) { // Basic plan limit
      return res.status(403).json({ success: false, message: 'Member limit reached (5 members max)' });
    }

    // Check if member already exists
    const existingMember = group.members.find(member => member.email === email);
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'Member already exists in group' });
    }

    // Add member
    group.members.push({
      name,
      email,
      user: null, // Will be populated if user registers
      joinedAt: new Date()
    });

    await group.save();
    
    // Update user's groupsCreated count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'usage.groupsCreated': 1 }
    });

    res.json({ 
      success: true, 
      message: 'Member added successfully',
      group 
    });

  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is group admin
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only group admin can remove members' });
    }

    // Remove member
    group.members = group.members.filter(member => 
      member._id.toString() !== memberId && member.user?.toString() !== memberId
    );

    await group.save();
    res.json({ success: true, message: 'Member removed successfully', group });

  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};