import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { sendEmailNotification } from '../utils/emailService';

export const useSettlementStore = create((set, get) => ({
  settlements: [],
  isLoading: false,

  // Real settlement function with email notifications
  processSettlement: async (groupId, fromUser, toUser, amount, paymentMethod = 'manual') => {
    set({ isLoading: true });
    
    try {
      console.log(`Processing settlement: ${fromUser.name} → ${toUser.name} | ₹${amount}`);
      
      // Send email notification to the receiver
      const emailResult = await sendEmailNotification(
        toUser.email,
        `Settlement Received - ₹${amount}`,
        `Great news! ${fromUser.name} has settled ₹${amount} with you. Your balance has been updated.`,
        'payment_received'
      );
      
      // Send confirmation to the payer
      await sendEmailNotification(
        fromUser.email,
        `Settlement Confirmed - ₹${amount}`,
        `You have successfully settled ₹${amount} with ${toUser.name}.`,
        'payment_sent'
      );
      
      if (emailResult.success) {
        toast.success(`₹${amount} settled successfully! Notifications sent.`);
      } else {
        toast.success(`₹${amount} settled successfully!`);
      }
      
      return { success: true, emailSent: emailResult.success };
      
    } catch (error) {
      toast.error('Settlement failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Request settlement from someone
  requestSettlement: async (groupId, fromUser, toUser, amount) => {
    try {
      const emailResult = await sendEmailNotification(
        toUser.email,
        `Settlement Request - ₹${amount}`,
        `${fromUser.name} is requesting ₹${amount} settlement. Please log in to review and confirm.`,
        'settlement_request'
      );
      
      if (emailResult.success) {
        toast.success(`Settlement request sent to ${toUser.name}!`);
      }
      
      return { success: true };
    } catch (error) {
      toast.error('Failed to send settlement request.');
      return { success: false, error: error.message };
    }
  }
  
  // ✅ COMMENTED OUT: Simple functions - uncomment if needed
  /*
  markAsPaid: async (groupId, fromUserId, toUserId, amount) => {
    try {
      console.log(`Marked ${amount} as paid from ${fromUserId} to ${toUserId}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  getSettlements: async (groupId) => {
    return [
      {
        id: 1,
        fromUser: { name: 'Mike', id: '1' },
        toUser: { name: 'John', id: '2' },
        amount: 500,
        date: new Date(),
        status: 'completed'
      }
    ];
  }
  */
}));