// client/src/stores/groupStore.js
import { create } from 'zustand';
import groupService from '../services/groupService';
import { useAuthStore } from './authStore';
import { sendEmailNotification } from '../utils/emailService';

export const useGroupStore = create((set, get) => ({
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,

  createGroup: async (groupData) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      const currentGroups = get().groups || [];

      if (user?.subscription?.plan === 'basic' && currentGroups.length >= 3) {
        throw new Error('Basic plan limited to 3 groups. Upgrade to create more groups.');
      }

      const res = await groupService.createGroup(groupData);
      const created = res.data?.data?.group || res.data?.group || res.data;

      set((state) => ({ groups: [...(state.groups || []), created], isLoading: false }));
      // optionally update user's local count
      useAuthStore.getState().updateUserGroupCount((currentGroups.length || 0) + 1);

      return { success: true, group: created };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create group';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  addMember: async (groupId, payload) => {
    set({ isLoading: true, error: null });
    try {
      // payload could be { email, name } depending on backend
      const res = await groupService.addMember(groupId, payload);
      const updatedGroup = res.data?.data?.group || res.data?.group || res.data;

      // send email using utils (trial mode)
      try {
        await sendEmailNotification(payload.email, `You've been added to ${updatedGroup.name}`, `${payload.name || 'A member'} added you to ${updatedGroup.name}`, 'member_added');
      } catch (e) { /* ignore email failure */ }

      set((state) => ({
        groups: state.groups.map((g) => (g._id === groupId ? updatedGroup : g)),
        currentGroup: state.currentGroup?._id === groupId ? updatedGroup : state.currentGroup,
        isLoading: false
      }));

      return { success: true, group: updatedGroup };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to add member';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  notifyExpenseAdded: async (groupId, expenseData) => {
    try {
      const group = get().currentGroup || (get().groups || []).find(g => g._id === groupId);
      if (!group) return { success: false };

      const promises = (group.members || [])
        .filter(m => m.user?._id !== expenseData.paidBy)
        .map(m => sendEmailNotification(m.user.email, `New expense in ${group.name}`, `${expenseData.paidByName} added: ${expenseData.description} - ${expenseData.amount}`, 'expense_added', m.user?.country || 'UAE'));

      await Promise.allSettled(promises);

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  getGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await groupService.getGroups();
      const list = res.data?.data?.groups || res.data?.groups || res.data || [];
      set({ groups: list, isLoading: false });
      return { success: true, groups: list };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch groups';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // used by components calling getGroup(id)
  getGroup: async (groupId) => {
    if (!groupId) {
      set({ error: 'Invalid group id' });
      return { success: false, error: 'Invalid group id' };
    }
    set({ isLoading: true, error: null });
    try {
      const res = await groupService.getGroupById(groupId);
      const group = res.data?.data?.group || res.data?.group || res.data;
      set({ currentGroup: group, isLoading: false });
      return { success: true, group };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch group';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateGroup: async (groupId, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await groupService.updateGroup(groupId, data);
      const updated = res.data?.data?.group || res.data?.group || res.data;
      set((state) => ({
        groups: state.groups.map(g => g._id === groupId ? updated : g),
        currentGroup: state.currentGroup?._id === groupId ? updated : state.currentGroup,
        isLoading: false
      }));
      return { success: true, group: updated };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update group';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteGroup: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      await groupService.deleteGroup(groupId);
      set((state) => ({
        groups: state.groups.filter(g => g._id !== groupId),
        currentGroup: state.currentGroup?._id === groupId ? null : state.currentGroup,
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete group';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  removeMember: async (groupId, memberId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await groupService.removeMember(groupId, memberId);
      const updated = res.data?.data?.group || res.data?.group || res.data;
      set((state) => ({
        groups: state.groups.map(g => g._id === groupId ? updated : g),
        currentGroup: state.currentGroup?._id === groupId ? updated : state.currentGroup,
        isLoading: false
      }));
      return { success: true, group: updated };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to remove member';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  clearCurrentGroup: () => set({ currentGroup: null }),
  clearError: () => set({ error: null })
}));
