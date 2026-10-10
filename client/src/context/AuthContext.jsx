import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext({
  admin: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  updateAdminState: () => {}
});

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('shriji_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('shriji_admin_token');
      if (!token) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data && res.data.admin) {
          setAdmin(res.data.admin);
          localStorage.setItem('shriji_admin_user', JSON.stringify(res.data.admin));
        }
      } catch (err) {
        setAdmin(null);
        localStorage.removeItem('shriji_admin_token');
        localStorage.removeItem('shriji_admin_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.success) {
      setAdmin(res.data.admin);
      if (res.data.token) {
        localStorage.setItem('shriji_admin_token', res.data.token);
      }
      localStorage.setItem('shriji_admin_user', JSON.stringify(res.data.admin));
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API failed, continuing client logout.', err.message);
    } finally {
      setAdmin(null);
      localStorage.removeItem('shriji_admin_token');
      localStorage.removeItem('shriji_admin_user');
    }
  };

  const updateAdminState = (updated) => {
    setAdmin(updated);
    localStorage.setItem('shriji_admin_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        updateAdminState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
