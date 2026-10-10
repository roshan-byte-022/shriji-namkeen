import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});

// Attach token from localStorage if present as fallback
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shriji_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get 401 on an admin endpoint, clean local token
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('shriji_admin_token');
        localStorage.removeItem('shriji_admin_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
