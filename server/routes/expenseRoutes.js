import express from 'express';
import Expense from '../models/Expense.js';
import { protect } from '../middleware/authMiddleware.js';
import Joi from 'joi';
import Group from '../models/Group.js';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const router = express.Router();

// ADD this route for expense settlements:
router.post('/:id/settle', protect, async (req, res) => {
  try {
    const { participantId, amount } = req.body;
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    // Apply transaction fee
    const feeResponse = await fetch(`http://localhost:5000/api/transactions/apply-fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization
      },
      body: JSON.stringify({
        expenseId: expense._id,
        settlementAmount: amount,
        payerId: req.user._id,
        payeeId: expense.paidBy
      })
    });
    
    const feeData = await feeResponse.json();
    
    if (!feeData.success) {
      throw new Error('Failed to process transaction fee');
    }
    
    // Mark participant as paid
    const participant = expense.participants.id(participantId);
    if (participant) {
      participant.paid = true;
      participant.settledAt = new Date();
      await expense.save();
    }
    
    res.json({
      success: true,
      message: 'Payment settled successfully',
      data: {
        expense,
        feeBreakdown: feeData.data.breakdown
      }
    });
  } catch (error) {
    console.error('Settlement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process settlement'
    });
  }
});


// @desc    Create new expense (individual or group)
// @route   POST /api/expenses
// @access  Private


router.post('/', protect, async (req, res) => {
  try {

    // 🌟 ADD THIS SPECIFIC LIVE PRINT LINE HERE:
    console.log('🚨 ABSOLUTE RAW REQ.BODY IS:', JSON.stringify(req.body, null, 2));

    console.log('📦 Creating expense with incoming data payload:', req.body);

    // Simple validation
    const { description, amount, category, group, groupId: incomingGroupId, date } = req.body;
    
    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    // Handle group ID - convert empty/undefined to null
    let groupId = null;

    // THE UNIFIER: Merge both variable targets together safely
    const targetGroup = group || incomingGroupId;

    if (targetGroup  && targetGroup.trim() !== '' && targetGroup !== 'undefined' && targetGroup !== 'null') {
      // Validate if it's a proper MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(targetGroup)) {
        groupId = targetGroup;
        
        // Verify user is member of this group
        const groupDoc = await Group.findOne({
          _id: groupId,
          'members.user': req.user._id
        });

        if (!groupDoc) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to add expenses to this group'
          });
        }
      }
    }

    // Handle date - fix date format issues
    let expenseDate;
    if (date) {
      expenseDate = new Date(date);
      // Check if date is valid
      if (isNaN(expenseDate.getTime())) {
        expenseDate = new Date(); // Fallback to current date if invalid
      }
    } else {
      expenseDate = new Date(); // Default to current date
    }

    console.log('🔍 Processed data:', {
      description: description.trim(),
      amount: parseFloat(amount),
      category: category.trim(),
      groupId,
      date: expenseDate
    });

    // Create expense data
    const expenseData = {
      description: description.trim(),
      amount: parseFloat(amount),
      category: category.trim(),
      date: expenseDate,
      paidBy: req.user._id,

      
       // 🌟 THE UNIFIER: Explicitly tell your database model to capture the group ID
      // even if the request hits the individual /expenses endpoint path!
      group: groupId || incomingGroupId || req.body.group || req.body.groupId || null
      
    };

    // Only add group if it exists and is valid
    if (groupId) {
      expenseData.group = groupId;
      expenseData.groupId = groupId;
    }

    console.log('✅ Final expense data for creation:', expenseData);

        // 🌟 THE FINAL HANDSHAKE: Automatically build the participant split array if missing!
    if (groupId) {
      const groupDoc = await Group.findById(groupId);
      if (groupDoc && groupDoc.members && groupDoc.members.length > 0) {
        
        // Calculate the equal split amount per person
        const equalShare = parseFloat((parseFloat(amount) / groupDoc.members.length).toFixed(2));
        
        // Map every member into the participants array required by your schema
        expenseData.participants = groupDoc.members.map(member => ({
          user: member.user,
          share: equalShare,
          paid: member.user.toString() === req.user._id.toString() // Payer is marked auto-paid
        }));
        
        expenseData.splitType = 'equal';
      }
    }


    // Create the expense
    const expense = await Expense.create(expenseData);
    
    // Populate the expense data for response
    await expense.populate('paidBy', 'name email');
    if (expense.group) {
      await expense.populate('group', 'name');
    }

    console.log('🎉 Expense created successfully:', expense._id);

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense }
    });

  } catch (error) {
    console.error('❌ Create expense error:', error);
    
    // More specific error messages
    let errorMessage = 'Server error creating expense';
    if (error.name === 'ValidationError') {
      errorMessage = `Validation error: ${Object.values(error.errors).map(e => e.message).join(', ')}`;
    } else if (error.code === 11000) {
      errorMessage = 'Duplicate expense found';
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ paidBy: req.user._id })
      .populate('paidBy', 'name email')
      .populate('group', 'name')
      .sort({ date: -1, createdAt: -1 });

    // Calculate summary
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categorySummary = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        expenses,
        summary: {
          totalExpenses,
          totalCount: expenses.length,
          categorySummary
        }
      }
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching expenses'
    });
  }
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      paidBy: req.user._id
    })
    .populate('paidBy', 'name email')
    .populate('group', 'name')
    .populate('participants.user', 'name email');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: { expense }
    });

  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching expense'
    });
  }
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      paidBy: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Handle group field properly for updates
    const updateData = { ...req.body };
    if (updateData.group === '' || updateData.group === 'undefined' || updateData.group === 'null') {
      updateData.group = null;
    }

    // Ensure amount is a number
    if (updateData.amount) {
      updateData.amount = parseFloat(updateData.amount);
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('paidBy', 'name email')
    .populate('group', 'name')
    .populate('participants.user', 'name email');

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense }
    });

  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating expense'
    });
  }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      paidBy: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting expense'
    });
  }
});

export default router;