import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { AuthContextType, User, AuthResponse, DemoUser } from '@/types';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock credentials
  const mockUsers: DemoUser[] = [
    { id: 1, username: 'demo@bank.com', password: 'demo123', name: 'John Doe' },
    { id: 2, username: 'test@bank.com', password: 'test123', name: 'Jane Smith' }
  ];

  const clearError = (): void => setError(null);

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    if (!username || !password) {
      const error = 'Username and password are required';
      setError(error);
      return { success: false, error };
    }

    if (!username.includes('@')) {
      const error = 'Please enter a valid email address';
      setError(error);
      return { success: false, error };
    }

    if (password.length < 6) {
      const error = 'Password must be at least 6 characters long';
      setError(error);
      return { success: false, error };
    }

    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = mockUsers.find(
        u => u.username === username && u.password === password
      );
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          username: foundUser.username,
          name: foundUser.name
        };
        setUser(userData);
        
        try {
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (storageError) {
          console.warn('Failed to save user to localStorage:', storageError);
          // Continue with login even if localStorage fails
        }
        
        return { success: true };
      } else {
        const error = 'Invalid email or password. Please check your credentials and try again.';
        setError(error);
        return { success: false, error };
      }
    } catch (err) {
      console.error('Login error:', err);
      const error = 'Unable to sign in at this time. Please try again later.';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setUser(null);
      setError(null);
      
      try {
        localStorage.removeItem('user');
      } catch (storageError) {
        console.warn('Failed to clear user from localStorage:', storageError);
      }
      
      // Simulate API call for logout
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to sign out properly');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData: User = JSON.parse(storedUser);
        // In a real app, you would validate the token here
        setUser(userData);
      }
    } catch (err) {
      console.error('Failed to refresh user session:', err);
      localStorage.removeItem('user');
      setError('Session expired. Please sign in again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    error,
    clearError,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};