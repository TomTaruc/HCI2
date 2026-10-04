/**
 * ThemeContext — eGovPH HCI Prototype
 *
 * Provides Light, Dark, and System appearance modes.
 * System mode follows the device media preference and
 * reacts when that preference changes at runtime.
 *
 * The resolved theme ('light' | 'dark') is written to
 * data-theme on <html> and stored in localStorage so the
 * correct theme is applied before React mounts, preventing
 * a flash of the wrong theme.
 *
 * DEMO ONLY — academic prototype, not production auth.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

// ----------------------------------------------------------------
// Storage
// ----------------------------------------------------------------

const STORAGE_KEY = 'egov_themeMode';

function readStoredMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    // storage unavailable
  }
  return 'system';
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'light') return 'light';
  if (mode === 'dark') return 'dark';
  return systemPrefersDark() ? 'dark' : 'light';
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute('data-theme', resolved);
}

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveTheme(readStoredMode())
  );

  // Apply on resolved change
  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  // React to mode changes
  useEffect(() => {
    const r = resolveTheme(mode);
    setResolved(r);
  }, [mode]);

  // React to system preference changes when in system mode
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setResolved(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
