import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    default: 'USD'
  },

  // ADD THESE NEW FIELDS:
  country: {
    type: String,
    enum: ['UAE', 'India'],
    required: true,
    default: 'UAE'
  },

  // ADD THIS CORRECTED SUBSCRIPTION SCHEMA:
  subscription: {
    plan: {
      type: String,
      // enum: ['individual', 'freelancer', 'business'],
      enum: ['basic', 'premium', 'business'],
      default: 'basic'
    },

    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'incomplete'],
      default: 'active'
    },
    currentPeriodEnd: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    razorpayCustomerId: String,
    currentPeriodEnd: Date
  },

  limits: {
    maxGroups: { type: Number, default: 3 },
    maxMembersPerGroup: { type: Number, default: 5 },
    groupsCreated: { type: Number, default: 0 }
  },

  usage: {
    groupsCreated: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);