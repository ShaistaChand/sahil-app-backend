import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  share: {
    type: Number,
    required: true,
    min: 0
  },
  paid: {
    type: Boolean,
    default: false
  },
  settledAt: {
    type: Date
  }
});

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    default: 'USD'
  },
  category: {
    type: String,
    enum: ['food', 'transport', 'shopping', 'entertainment', 'bills', 'healthcare', 'education', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // This should be OPTIONAL, not required for all expenses
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: false  // ← THIS SHOULD BE FALSE
  },
  splitType: {
    type: String,
    enum: ['equal', 'custom', 'percentage'],
    default: 'equal'
  },
  participants: [participantSchema],
  receipt: String,
  isSettled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate total shares to ensure they match amount
expenseSchema.pre('save', function(next) {
  if (this.participants && this.participants.length > 0) {
    const totalShares = this.participants.reduce((sum, participant) => sum + participant.share, 0);
    if (Math.abs(totalShares - this.amount) > 0.01) {
      return next(new Error('Total participant shares must equal expense amount'));
    }
  }
  next();
});

// Method to mark participant as paid
expenseSchema.methods.markAsPaid = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.paid = true;
    participant.settledAt = new Date();
    
    // Check if all participants have paid
    this.isSettled = this.participants.every(p => p.paid);
  }
  return this.save();
};

export default mongoose.model('Expense', expenseSchema);