import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Transaction from '../models/Transaction.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// @desc    Apply transaction fee to settlement
// @route   POST /api/transactions/apply-fee
// @access  Private
router.post('/apply-fee', protect, async (req, res) => {
  try {
    const { expenseId, settlementAmount, payerId, payeeId } = req.body;
    
    // Calculate 1.5% founder fee
    const fee = settlementAmount * 0.015;
    const netAmount = settlementAmount - fee;
    
    // Create transaction record
    const transaction = await Transaction.create({
      type: 'settlement_fee',
      user: req.user._id,
      amount: settlementAmount,
      currency: req.user.country === 'India' ? 'INR' : 'AED',
      fee: fee,
      netAmount: netAmount,
      description: `Settlement fee for expense ${expenseId}`,
      status: 'completed',
      metadata: {
        expenseId,
        payerId,
        payeeId,
        settlementAmount,
        feePercentage: 1.5
      }
    });
    
    res.json({
      success: true,
      data: {
        transaction,
        breakdown: {
          settlementAmount,
          founderFee: fee,
          netToPayee: netAmount,
          feePercentage: '1.5%'
        }
      }
    });
  } catch (error) {
    console.error('Transaction fee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process transaction fee'
    });
  }
});

// @desc    Get founder revenue dashboard
// @route   GET /api/transactions/revenue
// @access  Private (Admin/Founder)
router.get('/revenue', protect, async (req, res) => {
  try {
    // In production, check if user is founder/admin
    const revenue = await Transaction.getFounderRevenue('month');
    
    const stats = {
      totalRevenue: revenue.reduce((sum, curr) => sum + curr.totalRevenue, 0),
      transactionCount: revenue.reduce((sum, curr) => sum + curr.transactionCount, 0),
      byCurrency: revenue
    };
    
    res.json({
      success: true,
      data: { revenue: stats }
    });
  } catch (error) {
    console.error('Revenue fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue data'
    });
  }
});

// @desc    Get user's transaction history
// @route   GET /api/transactions/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: { transactions }
    });
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history'
    });
  }
});

export default router;