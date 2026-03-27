import User from '../models/User.js';
import Group from '../models/Group.js';

// ✅ CORRECTED: Plan limits configuration based on your User model
const planLimits = {
  basic: { maxGroups: 3, maxMembersPerGroup: 5 },
  premium: { maxGroups: 15, maxMembersPerGroup: 25 },
  business: { maxGroups: 35, maxMembersPerGroup: 35 }
};

export const checkGroupLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // ✅ CORRECTED: Check trial period - using your actual User model structure
    const currentDate = new Date();
    const trialEndDate = new Date(user.subscription.currentPeriodEnd);
    
    if (currentDate > trialEndDate && user.subscription.status === 'active') {
      return res.status(403).json({
        success: false,
        message: '14-day trial period ended. Please subscribe to continue using the app.'
      });
    }

    // ✅ CORRECTED: Get user's plan limits from your model structure
    const userPlan = user.subscription.plan;
    const limits = planLimits[userPlan] || planLimits.basic;

    // ✅ CORRECTED: Check group limit against user's usage
    if (user.usage.groupsCreated >= limits.maxGroups) {
      return res.status(403).json({
        success: false,
        message: `Group limit reached (${limits.maxGroups} groups maximum). Upgrade to premium plan to create more groups.`
      });
    }

    next();
  } catch (error) {
    console.error('Subscription limit check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking subscription limits'
    });
  }
};

export const checkMemberLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // ✅ CORRECTED: Get user's plan limits
    const userPlan = user.subscription.plan;
    const maxMembers = planLimits[userPlan]?.maxMembersPerGroup || 5;

    // Pass the limit to the route handler
    req.maxMembers = maxMembers;
    next();
  } catch (error) {
    console.error('Member limit check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking member limits'
    });
  }
};