import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await authAPI.me();
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.getItem('access_token') ? fetchMe() : setLoading(false);
  }, [fetchMe]);

  const login = async (creds) => {
    const { data } = await authAPI.login(creds);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    await fetchMe();
  };

  // role = 'patient' | 'doctor_pending' | 'center_pending'
  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    await fetchMe();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  // Role helpers
  const isAdmin          = user?.role === 'admin';
  const isDoctor         = user?.role === 'doctor';
  const isCenterManager  = user?.role === 'center_manager';
  const isProvider       = isDoctor || isCenterManager;
  const isDoctorPending  = user?.role === 'doctor_pending';
  const isCenterPending  = user?.role === 'center_pending';
  const isPending        = isDoctorPending || isCenterPending;

  return (
    <Ctx.Provider value={{
      user, loading, login, register, logout, fetchMe,
      isAdmin, isDoctor, isCenterManager, isProvider, isPending,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
