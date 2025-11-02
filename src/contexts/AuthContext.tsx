import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../lib/types';
import { authApi } from '../lib/mockApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('wattwise_token');
        if (savedToken) {
          setToken(savedToken);
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('wattwise_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await authApi.login(email, password);
      setUser(user);
      setToken(token);
      localStorage.setItem('wattwise_token', token);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { user, token } = await authApi.register(email, password, name);
      setUser(user);
      setToken(token);
      localStorage.setItem('wattwise_token', token);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setToken(null);
      localStorage.removeItem('wattwise_token');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
