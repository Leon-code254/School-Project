import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth token on mount
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const user = await authService.getCurrentUser();
          setUser(user);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login({ email, password });
      authService.setAuthData(response);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('authToken');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}