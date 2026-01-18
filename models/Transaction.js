import mongoose from 'mongoose';


// Settlement.js or TRANSACTIONS.js both same

// Add this to your payment setup documentation:

/**
 * MVP ACCOUNT SETUP:
 * 
 * 1. Stripe (UAE): Use personal account for testing
 *    - Go to: dashboard.stripe.com/register
 *    - Use your personal email and UAE phone number
 *    - Connect your personal savings account (they accept personal accounts)
 *    - Enable test mode for development
 * 
 * 2. Razorpay (India): Use personal account
 *    - Go to: razorpay.com/signup
 *    - Select "Freelancer/Individual" as business type
 *    - Connect your personal savings account
 *    - Use PAN card for verification
 * 
 * 3. Legal Protection for MVP:
 *    - Add clear "MVP Testing" disclaimer in terms
 *    - Limit transaction amounts during testing
 *    - Maintain transparent communication with users
 *    - Keep records of all transactions
 * 
 * 4. Transition to Business Accounts:
 *    - When revenue exceeds $5,000/month, register business
 *    - UAE: Freezone company (approx. AED 15,000)
 *    - India: Private Limited (approx. ₹15,000)
 */

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['subscription', 'settlement_fee', 'payout'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['AED', 'INR', 'USD'],
    required: true
  },
  fee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  description: String,
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'manual']
  },
  gatewayTransactionId: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Calculate founder's revenue
transactionSchema.statics.getFounderRevenue = async function(period = 'month') {
  const startDate = period === 'month' 
    ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    : new Date(new Date().getFullYear(), 0, 1);
  
  const revenue = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'completed',
        $or: [
          { type: 'subscription' },
          { type: 'settlement_fee' }
        ]
      }
    },
    {
      $group: {
        _id: '$currency',
        totalRevenue: { $sum: '$fee' },
        transactionCount: { $sum: 1 }
      }
    }
  ]);
  
  return revenue;
};

export default mongoose.model('Transaction', transactionSchema);