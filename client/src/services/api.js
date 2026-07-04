// client/src/services/api.js
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const BASE = 'https://sahil-app-backend.onrender.com/api';

const api = axios.create({
  // baseURL: `${BASE}/api`,
  baseURL: BASE,
  timeout: 15000,
  withCredentials: true, // keep if your backend uses cookies, safe to have
  headers: {
    'Content-Type': 'application/json',
  'Accept': 'application/json'}
});

// Attach token from zustand store for each request
api.interceptors.request.use((config) => {
  try {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // don't auto-clear token blindly here; let components/stores handle flow
    return Promise.reject(error);
  }
);

export default api;
