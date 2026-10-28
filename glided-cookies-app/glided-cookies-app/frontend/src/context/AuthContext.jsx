import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, initStorage } from '../services/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStorage();                     // seed products + admin on first visit
    const session = auth.getSession(); // restore session
    if (session) setUser(session);
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const u = auth.login(email, password); // throws on failure
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const u = auth.register(name, email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading,
      isLoggedIn: !!user,
      isAdmin:    user?.role === 'admin',
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
