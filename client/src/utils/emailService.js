export const sendEmailNotification = async (toEmail, subject, message, type, userCountry = 'UAE') => {
  try {
    const timestamp = new Date().toISOString();

    const emailData = {
      to: toEmail,
      subject,
      message,
      type,
      country: userCountry,
      timestamp,
    };

    // Trial-mode: log the structured email
    console.log('📧 Email Notification (Trial Mode):', emailData);

    // Return success in trial mode
    return { success: true, message: 'Notification queued (Trial Mode)', data: emailData };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
};

export const notificationTemplates = {
  memberAdded: (groupName, inviterName, country = 'UAE') => ({ subject: `You've been added to ${groupName}`, message: `Hi! ${inviterName} added you to the group "${groupName}".` }),
  expenseAdded: (groupName, userName, amount, description, country = 'UAE') => ({ subject: `New expense in ${groupName}`, message: `${userName} added: ${description} - ${country === 'India' ? `₹${amount}` : `AED ${amount}`}` }),
  settlementRequest: (fromUserName, amount, country = 'UAE') => ({ subject: `Settlement Request - ${country === 'India' ? `₹${amount}` : `AED ${amount}`}`, message: `${fromUserName} is requesting ${country === 'India' ? `₹${amount}` : `AED ${amount}`} settlement.` }),
  paymentReceived: (fromUserName, amount, country = 'UAE') => ({ subject: `Payment Received - ${country === 'India' ? `₹${amount}` : `AED ${amount}`}`, message: `${fromUserName} has paid you ${country === 'India' ? `₹${amount}` : `AED ${amount}`}`} ),
  trialEnding: (daysRemaining, country = 'UAE') => ({ subject: `Trial Ending in ${daysRemaining} days`, message: `Your ${14}-day free trial ends in ${daysRemaining} days. Subscribe now.` }),
};
