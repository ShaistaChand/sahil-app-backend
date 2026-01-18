import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['individual', 'freelancer', 'business'],
    default: 'individual'
  },
  price: {
    monthly: { type: Number, required: true },
    yearly: { type: Number, required: true }
  },
  limits: {
    maxGroups: { type: Number, required: true },
    maxMembersPerGroup: { type: Number, required: true },
    canUploadReceipts: { type: Boolean, default: false },
    canUseCategories: { type: Boolean, default: false },
    canCreateBusinessGroups: { type: Boolean, default: false },
    canUseMultiCurrency: { type: Boolean, default: false },
    canExportData: { type: Boolean, default: false },
    canUseAPI: { type: Boolean, default: false }
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Plan', planSchema);