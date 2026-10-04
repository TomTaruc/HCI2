/**
 * AuthContext — eGovPH HCI Prototype
 *
 * Session state machine:
 *   idle -> unlocked (login/signup)
 *   unlocked -> locked (5 min inactivity or background resume after elapsed time)
 *   locked -> unlocked (MPIN re-entry)
 *   unlocked -> idle (logout)
 *
 * Session is persisted to localStorage. On restore, elapsed time since
 * last active timestamp is checked. If more than the absolute timeout
 * has elapsed, the session is cleared. If more than the idle timeout
 * has elapsed, the session is set to locked.
 *
 * ACADEMIC PROTOTYPE — localStorage session is not real authentication.
 * A real production session would use server-issued tokens with
 * HttpOnly cookies, CSRF protection, rate limiting, and server-side expiry.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { db } from '../mock/db';
import { login as loginService, getUserById } from '../mock/services/authService';
import type { User } from '../mock/services/authService';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;     // 5 minutes inactivity -> lock
const ABSOLUTE_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours absolute -> clear session

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type SessionStatus = 'idle' | 'locked' | 'unlocked';

interface AuthContextValue {
  user: User | null;
  sessionStatus: SessionStatus;
  isLoading: boolean;
  login: (mobileNumber: string, mpin: string) => Promise<void>;
  logout: () => void;
  /** Set user after signup — also establishes unlocked session state */
  setUserAfterSignup: (user: User) => void;
  /** Refresh user data from storage (call after external updates) */
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // ----------------------------------------------------------------
  // Idle timer management
  // ----------------------------------------------------------------
  const sessionGenRef = useRef<number>(0);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  function _clearSession() {
    sessionGenRef.current += 1;
    db.remove('currentUserId');
    db.remove('sessionStatus');
    db.remove('sessionLoginAt');
    db.remove('sessionLastActive');
  }

  const resetIdleTimer = useCallback(() => {
    // Prevent stale operations: do not reset timer if already logged out
    const currentUserId = db.get<string>('currentUserId');
    if (!currentUserId) {
      clearIdleTimer();
      return;
    }

    const now = Date.now();
    const loginAt = db.get<number>('sessionLoginAt');
    
    // Enforce absolute expiry throughout activity
    if (loginAt && (now - loginAt > ABSOLUTE_TIMEOUT_MS)) {
      clearIdleTimer();
      setUserState(null);
      setSessionStatus('idle');
      _clearSession();
      try {
        sessionStorage.removeItem('verify_personal');
        sessionStorage.removeItem('verify_pcn');
      } catch {
        // ignore
      }
      return;
    }

    clearIdleTimer();
    lastActivityRef.current = now;
    db.set('sessionLastActive', lastActivityRef.current);

    idleTimerRef.current = setTimeout(() => {
      setSessionStatus('locked');
      db.set('sessionStatus', 'locked');
    }, IDLE_TIMEOUT_MS);
  }, [clearIdleTimer]);

  // ----------------------------------------------------------------
  // Session restoration
  // ----------------------------------------------------------------

  useEffect(() => {
    const savedUserId = db.get<string>('currentUserId');
    const savedStatus = db.get<string>('sessionStatus');
    const savedLoginAt = db.get<number>('sessionLoginAt');
    const savedLastActive = db.get<number>('sessionLastActive');

    if (savedUserId) {
      const now = Date.now();
      const loginAt = savedLoginAt ?? now;
      const lastActive = savedLastActive ?? now;

      // Absolute timeout: clear session entirely
      if (now - loginAt > ABSOLUTE_TIMEOUT_MS) {
        _clearSession();
        setIsLoading(false);
        return;
      }

      // Idle timeout: session should be locked
      const effectiveStatus = (now - lastActive > IDLE_TIMEOUT_MS)
        ? 'locked'
        : (savedStatus as SessionStatus ?? 'locked');

      const restoredUser = getUserById(savedUserId);
      if (restoredUser) {
        setUserState(restoredUser);
        setSessionStatus(effectiveStatus);
        if (effectiveStatus === 'unlocked') {
          resetIdleTimer();
        } else {
          // Update stored status to match computed value
          db.set('sessionStatus', effectiveStatus);
        }
      } else {
        _clearSession();
      }
    }
    setIsLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----------------------------------------------------------------
  // Activity listeners (only when unlocked)
  // ----------------------------------------------------------------

  useEffect(() => {
    if (sessionStatus !== 'unlocked') return;

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const;
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
    };
  }, [sessionStatus, resetIdleTimer]);

  // ----------------------------------------------------------------
  // Page visibility: re-check idle when returning to tab
  // ----------------------------------------------------------------

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && sessionStatus === 'unlocked') {
        const now = Date.now();
        const lastActive = db.get<number>('sessionLastActive') ?? now;
        if (now - lastActive > IDLE_TIMEOUT_MS) {
          setSessionStatus('locked');
          db.set('sessionStatus', 'locked');
          clearIdleTimer();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sessionStatus, clearIdleTimer]);

  // ----------------------------------------------------------------
  // Cross-tab logout: listen for storage events
  // ----------------------------------------------------------------

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'egov_currentUserId' && e.newValue === null) {
        // Another tab logged out
        clearIdleTimer();
        setUserState(null);
        setSessionStatus('idle');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [clearIdleTimer]);

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------

  function _establishSession(loggedInUser: User) {
    const now = Date.now();
    
    // Check if persistence works
    const ok = db.set('currentUserId', loggedInUser.id);
    if (!ok) {
      console.error('[eGovPH] Session establishment failed (storage unavailable)');
      return false;
    }
    db.set('sessionStatus', 'unlocked');
    db.set('sessionLoginAt', now);
    db.set('sessionLastActive', now);

    setUserState(loggedInUser);
    setSessionStatus('unlocked');
    lastActivityRef.current = now;
    resetIdleTimer();
    return true;
  }

  // ----------------------------------------------------------------
  // Public API
  // ----------------------------------------------------------------

  const login = useCallback(async (mobileNumber: string, mpin: string) => {
    const gen = sessionGenRef.current;
    const loggedInUser = await loginService(mobileNumber, mpin);
    if (sessionGenRef.current !== gen) return; // Cancelled by logout or switch
    
    if (!_establishSession(loggedInUser)) {
      throw new Error('Failed to save session. Storage may be unavailable.');
    }
  }, [resetIdleTimer]); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = useCallback(() => {
    clearIdleTimer();
    setUserState(null);
    setSessionStatus('idle');
    _clearSession();
    // Clear any in-flight session drafts
    try {
      sessionStorage.removeItem('verify_personal');
      sessionStorage.removeItem('verify_pcn');
    } catch {
      // ignore
    }
  }, [clearIdleTimer]);

  /**
   * Call after signup to establish a session for the new user.
   * The session status is set to 'unlocked' (not 'idle') so that
   * protected routes are accessible immediately after signup.
   */
  const setUserAfterSignup = useCallback((u: User) => {
    if (!_establishSession(u)) {
      console.error('Failed to establish session after signup.');
    }
  }, [resetIdleTimer]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshUser = useCallback(() => {
    const savedUserId = db.get<string>('currentUserId');
    if (savedUserId) {
      const freshUser = getUserById(savedUserId);
      if (freshUser) setUserState(freshUser);
    }
  }, []);

  const lockSession = useCallback(() => {
    clearIdleTimer();
    setSessionStatus('locked');
    db.set('sessionStatus', 'locked');
  }, [clearIdleTimer]);

  const unlockSession = useCallback(() => {
    setSessionStatus('unlocked');
    db.set('sessionStatus', 'unlocked');
    resetIdleTimer();
  }, [resetIdleTimer]);

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionStatus,
        isLoading,
        login,
        logout,
        setUserAfterSignup,
        refreshUser,
        lockSession,
        unlockSession,
      }}
    >
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
