// Trial management utility
export const TRIAL_DAYS = 14;

export const getTrialStatus = () => {
  const signupDate = localStorage.getItem('app_signup_date');
  
  if (!signupDate) {
    // First time user - start trial
    localStorage.setItem('app_signup_date', new Date().toISOString());
    return { isTrial: true, daysRemaining: TRIAL_DAYS };
  }
  
  const signup = new Date(signupDate);
  const today = new Date();
  const daysUsed = Math.floor((today - signup) / (1000 * 60 * 60 * 24));
  const daysRemaining = TRIAL_DAYS - daysUsed;
  
  return {
    isTrial: daysRemaining > 0,
    daysRemaining: Math.max(0, daysRemaining),
    daysUsed
  };
};

export const shouldShowSubscriptionPrompt = () => {
  const { isTrial, daysRemaining } = getTrialStatus();
  
  // Show prompt when trial has 3 days left or has expired
  return !isTrial || daysRemaining <= 3;
};