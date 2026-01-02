
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration for inactivity timeout (5 minutes in milliseconds)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cars_user_session');
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('cars_user_session', JSON.stringify(userData));
  };

  useEffect(() => {
    // Check local storage for persistent session
    const savedUser = localStorage.getItem('cars_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Inactivity Logic
  useEffect(() => {
    if (!user) return;

    let timeoutId: number;

    const resetTimer = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        console.warn("User session expired due to inactivity.");
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    // Track common user interactions
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer on mount if authenticated
    resetTimer();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout]);

  if (isLoading) {
      return (
          <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
