import Group from '../models/Group.js';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
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

// 1. GET ALL GROUPS (Fixes the "Unknown User" bug)
// export const getGroups = async (req, res) => {
//   try {
      
//     const groups = await Group.find({ createdBy: req.user._id })
//      .populate('members.user', 'name email')
//       .sort({ createdAt: -1 });


//      res.json({
//       success: true,
//       data: { groups }
//      });
//   } catch (error) {
//     console.error('Get groups error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching groups'
//     });
//   }
// }; this code was giving unknow user creaetd group hence rewrote the below code to fix the bug

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.user._id })
      .populate('createdBy', 'name email')
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

    // 🌟 THE MISSING LINK: Fetch all expenses saved under this specific group ID!
    const expenses = await Expense.find({ group: req.params.id })
      .populate('paidBy', 'name email')
      .sort({ date: -1 });

    // 🌟 AUTOMATED BALANCES LEDGER MATHEMATICS:
    // Wipes out old stale frontend caches by calculating totals dynamically right now!
    let totalSpent = 0;
    
    // Initialize fresh empty balance sheets for your members array
    const balances = {};
    group.members.forEach(member => {
      if (member.user) {
        balances[member.user._id.toString()] = { paid: 0, owed: 0, net: 0 };
      }
    });

    // Run the mathematics loops across your saved expense documents
    expenses.forEach(exp => {
      totalSpent += exp.amount;
      const payerId = exp.paidBy?._id?.toString() || exp.paidBy?.toString();
      
      // If your pre-save automation built individual splits, add them up!
      if (exp.participants && exp.participants.length > 0) {
        exp.participants.forEach(p => {
          const participantId = p.user?.toString();
          if (balances[participantId]) {
            balances[participantId].owed += p.share;
            if (participantId === payerId) {
              balances[participantId].paid += exp.amount;
            }
          }
        });
      }
    });

    // Calculate clean net summaries for your display elements
    group.members.forEach(member => {
      if (member.user) {
        const idStr = member.user._id.toString();
        balances[idStr].net = balances[idStr].paid - balances[idStr].owed;
      }});

    res.json({
      success: true,
      data: { group, 
        expenses,
        totalSpent,
        balances
 }
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
// =========================================================================
// =========================================================================
// SECURE ENDPOINT HANDLER AT THE ABSOLUTE BOTTOM OF the FILE
// =========================================================================
export const addGroupMember = async (req, res) => {
  let { email } = req.body; // Changed from 'const' to 'let' so we can modify it if needed
  const groupId = req.params.id;

  // MAGIC FIX: If the frontend accidentally wrapped the email in an object, extract the string!
  if (email && typeof email === 'object') {
    email = email.email;
  }


  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: "Email address is required." });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    let userToAdd = await User.findOne({ email: cleanEmail });
    
    if (!userToAdd) {
      userToAdd = await User.create({
        name: cleanEmail.split('@')[0], 
        email: cleanEmail,
        password: Math.random().toString(36).slice(-8), 
        isVerified: false
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found." });
    }

    const isAlreadyMember = group.members.some(
      (m) => m.user && m.user.toString() === userToAdd._id.toString()
    );
    if (isAlreadyMember) {
      return res.status(400).json({ success: false, message: "This user is already a member of this group." });
    }

    group.members.push({
      user: userToAdd._id,
      name: userToAdd.name,
      email: userToAdd.email,
      joinedAt: new Date()
    });
    
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email');

    // 🌟 FIXED: Cleanly closed the JSON response object block
    return res.status(200).json({ success: true, data: { group: updatedGroup } });
  } catch (error) {
    console.error('❌ Error inside addGroupMember controller block:', error);
    return res.status(500).json({ success: false, message: "Internal server error adding member." });
  }
};

// =========================================================================
// 🌟 ADDED: THE MISSING FETCH ALL MEMBERS FUNCTION FOR THE GROUP GET ROUTE
// =========================================================================
export const getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
      'members.user': req.user._id 
    }).populate('members.user', 'name email');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found or you are not a member.'
      });
    }

    // Safely extract the inner populated user fields to prevent frontend mapping crashes
    const cleanMembersList = group.members
      .map(member => member.user)
      .filter(Boolean);

    return res.json({
      success: true,
      data: cleanMembersList 
    });
  } catch (error) {
    console.error('❌ Get group members error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching group members'
    });
  }
};
