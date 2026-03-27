import { create } from 'zustand';
import api from '../services/api';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  isLoading: false,
  error: null,
  editingExpense: null,

  fetchExpenses: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      const path = groupId ? `/expenses?group=${groupId}` : '/expenses';
      const response = await api.get(path);
      const data = response.data?.data;
      set({ expenses: data?.expenses || [], isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch expenses', isLoading: false });
    }
  },

  createExpense: async (expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/expenses', expenseData);
      const newExpense = response.data?.data?.expense;
      if (newExpense) set((state) => ({ expenses: [newExpense, ...state.expenses], isLoading: false }));
      else set({ isLoading: false });
      return { success: true, expense: newExpense };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add expense';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  addExpense: async (expenseData) => {
    // backward-compatible alias
    return get().createExpense(expenseData);
  },

  updateExpense: async (expenseId, expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/expenses/${expenseId}`, expenseData);
      const updatedExpense = response.data?.data?.expense;
      set((state) => ({ expenses: state.expenses.map(e => e._id === expenseId ? updatedExpense : e), isLoading: false }));
      return { success: true, expense: updatedExpense };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update expense';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteExpense: async (expenseId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/expenses/${expenseId}`);
      set((state) => ({ expenses: state.expenses.filter(e => e._id !== expenseId), isLoading: false }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete expense';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  settleExpense: async (expenseId, participantId, amount) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/expenses/${expenseId}/settle`, { participantId, amount });
      const updatedExpense = response.data?.data?.expense;
      set((state) => ({ expenses: state.expenses.map(e => e._id === expenseId ? updatedExpense : e), isLoading: false }));
      return { success: true, expense: updatedExpense };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to settle expense';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  setEditingExpense: (expense) => set({ editingExpense: expense }),
  clearEditingExpense: () => set({ editingExpense: null }),
  clearError: () => set({ error: null }),
}));

export default useExpenseStore;
