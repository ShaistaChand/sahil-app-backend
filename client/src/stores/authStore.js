// client/src/stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isRehydrated: false,

      // safe updaters
      updateUser: (payload) => set((state) => ({ user: { ...state.user, ...payload } })),
      updateUserGroupCount: (count) => set((state) => ({
        user: { ...get().user, limits: { ...(get().user?.limits || {}), groupsCreated: count } }
      })),
      updateUserCountry: async (country) => {
        // optional: call backend to update country; here we just update local state
        set((state) => ({ user: { ...state.user, country } }));
        return { success: true };
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          // backend should return { data: { user, token } } or similar; safe-access:
          const data = response.data?.data || response.data || {};
          const user = data.user || data;
          const token = data.token || response.data?.token || null;

          set({ user, token, isLoading: false });
          return { success: true, user, token };
        } catch (err) {
          const message = err.response?.data?.message || err.message || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      register: async (name, email, password, country) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', { name, email, password, country });
          const data = response.data?.data || response.data || {};
          const user = data.user || data;
          const token = data.token || response.data?.token || null;

          set({ user, token, isLoading: false });
          return { success: true, user, token };
        } catch (err) {
          const message = err.response?.data?.message || err.message || 'Registration failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
      skipHydration: false,
      // safe onRehydrateStorage implementation
      onRehydrateStorage: () => (state, error) => {
        try {
          // schedule microtask to avoid mutating store during hydration read
          Promise.resolve().then(() => {
            useAuthStore.setState({ isRehydrated: true });
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('onRehydrateStorage error', e);
        }
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Auth rehydrate error', error);
        }
      },
    }
  )
);

export default useAuthStore;
