import { createContext, useContext, useState, useMemo } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('funkytz_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const value = useMemo(() => {
    const login = async (username, password) => {
      const res = await client.post('/auth/login', { username, password });
      localStorage.setItem('funkytz_admin_token', res.data.token);
      localStorage.setItem('funkytz_admin_user', JSON.stringify(res.data.admin));
      setAdmin(res.data.admin);
      return res.data.admin;
    };

    const logout = () => {
      localStorage.removeItem('funkytz_admin_token');
      localStorage.removeItem('funkytz_admin_user');
      setAdmin(null);
    };

    return { admin, isAuthenticated: !!admin, login, logout };
  }, [admin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
