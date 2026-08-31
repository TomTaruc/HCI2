/**
 * AuthContext — eGovPH HCI Prototype
 * 
 * Manages session state: current user, login, logout, registration,
 * and session timeout (5 minutes inactivity → re-lock).
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../mock/db';
import { login as loginService, getUserById } from '../mock/services/authService';
import type { User } from '../mock/services/authService';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type SessionStatus = 'idle' | 'locked' | 'unlocked';

interface AuthContextValue {
  user: User | null;
  sessionStatus: SessionStatus;
  isLoading: boolean;
  login: (mobileNumber: string, mpin: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  refreshUser: () => void;
  lockSession: () => void;
  unlockSession: () => void;
}

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------

const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedUserId = db.get<string>('currentUserId');
    const savedStatus = db.get<string>('sessionStatus');

    if (savedUserId && savedStatus === 'unlocked') {
      const restoredUser = getUserById(savedUserId);
      if (restoredUser) {
        setUserState(restoredUser);
        setSessionStatus('unlocked');
        resetTimeout();
      }
    }
    setIsLoading(false);
  }, []);

  // Reset inactivity timer on any user activity
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // After 5 min inactivity, lock the session (require MPIN re-entry)
      setSessionStatus('locked');
      db.set('sessionStatus', 'locked');
    }, SESSION_TIMEOUT_MS);
  }, []);

  // Track user activity
  useEffect(() => {
    if (sessionStatus !== 'unlocked') return;

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimeout, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, resetTimeout));
  }, [sessionStatus, resetTimeout]);

  const login = useCallback(async (mobileNumber: string, mpin: string) => {
    const loggedInUser = await loginService(mobileNumber, mpin);
    setUserState(loggedInUser);
    setSessionStatus('unlocked');
    db.set('currentUserId', loggedInUser.id);
    db.set('sessionStatus', 'unlocked');
    resetTimeout();
  }, [resetTimeout]);

  const logout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setUserState(null);
    setSessionStatus('idle');
    db.remove('currentUserId');
    db.remove('sessionStatus');
  }, []);

  const setUser = useCallback((u: User) => {
    setUserState(u);
    db.set('currentUserId', u.id);
  }, []);

  const refreshUser = useCallback(() => {
    const savedUserId = db.get<string>('currentUserId');
    if (savedUserId) {
      const freshUser = getUserById(savedUserId);
      if (freshUser) setUserState(freshUser);
    }
  }, []);

  const lockSession = useCallback(() => {
    setSessionStatus('locked');
    db.set('sessionStatus', 'locked');
  }, []);

  const unlockSession = useCallback(() => {
    setSessionStatus('unlocked');
    db.set('sessionStatus', 'unlocked');
    resetTimeout();
  }, [resetTimeout]);

  return (
    <AuthContext.Provider value={{
      user,
      sessionStatus,
      isLoading,
      login,
      logout,
      setUser,
      refreshUser,
      lockSession,
      unlockSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
