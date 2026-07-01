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

  // Allows the database to accept data.groupId from the frontend
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: false
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
// Automatically handle participant allocations before saving to MongoDB
expenseSchema.pre('save', async function(next) {
  const Expense = this;
  
  // AUTOMATION HOOK: If it belongs to a group but frontend sent no participants list, build it!
  if ((Expense.group || Expense.groupId) && (!Expense.participants || Expense.participants.length === 0)) {
    try {
      const Group = await mongoose.model('Group').findById(Expense.group || Expense.groupId);
      if (Group && Group.members && Group.members.length > 0) {
        // Calculate equal split split value
        const equalShare = Expense.amount / Group.members.length;
        
        // Loop over group roster to create participant layouts dynamically
        Expense.participants = Group.members.map(member => ({
          user: member.user,
          share: parseFloat(equalShare.toFixed(2)),
          paid: member.user.toString() === Expense.paidBy.toString() // Payer is marked auto-paid
        }));
      }
    } catch (error) {
      return next(error);
    }
  }

  // Strictly enforce the safety totals validation block you wrote
  if (Expense.participants && Expense.participants.length > 0) {
    const totalShares = Expense.participants.reduce((sum, p) => sum + p.share, 0);
    if (Math.abs(totalShares - Expense.amount) > 0.1) { // Allowance for micro rounding decimal differences
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