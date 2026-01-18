import Group from '../models/Group.js';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email'
    });
  }
};

export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } else if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    } else {
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      user.verificationCode = verificationCode;
      await user.save();

      await sendVerificationEmail(email, verificationCode);

      res.json({
        success: true,
        message: 'Verification code sent successfully'
      });
    }
  } catch (error) {
    console.error('Resend verification code error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending verification code'
    });   
  }
};   

export const createGroup = async (req, res) => {
  try {
    const { name, description, currency } = req.body;

    // Create group with creator as first member
    const group = await Group.create({
      name,
      description,
      currency: currency || (req.user.country === 'India' ? 'INR' : 'AED'),
      createdBy: req.user._id,
      members: [{
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        joinedAt: new Date()
      }]
    });

    // Update user's group count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'usage.groupsCreated': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: { group }
    });

  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating group'
    });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ createdBy: req.user._id })
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { groups }
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching groups'
    });
  }
};

// ✅ ADD MISSING FUNCTIONS
export const getGroup = async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
      'members.user': req.user._id
    })
    .populate('createdBy', 'name email')
    .populate('members.user', 'name email');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    res.json({
      success: true,
      data: { group }
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching group'
    });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = await Group.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id
      },
      { name, description },
      { new: true, runValidators: true }
    ).populate('members.user', 'name email');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    res.json({
      success: true,
      message: 'Group updated successfully',
      data: { group }
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating group'
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Update user's group count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'usage.groupsCreated': -1 }
    });

    res.json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting group'
    });
  }
};