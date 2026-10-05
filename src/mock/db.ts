/**
 * eGovPH HCI Prototype — Mock Database (localStorage wrapper)
 *
 * All data is stored locally. No real government data, no PII, no real APIs.
 * This module handles seeding initial fixture data and providing typed
 * get/set/remove operations so services feel like a real async API.
 *
 * ACADEMIC PROTOTYPE — Demo information entered by participants is stored
 * locally in this browser's localStorage under the "egov_" namespace.
 * Data persists until the user resets the app or clears browser storage.
 *
 * Schema version: 2
 */

import usersData from './data/users.json';
import agenciesData from './data/agencies.json';
import contributionsData from './data/contributions.json';
import digitalIdsData from './data/digitalIds.json';
import notificationsData from './data/notifications.json';
import tourismData from './data/tourism.json';
import jobsData from './data/jobs.json';
import faqsData from './data/faqs.json';
import weatherData from './data/weather.json';
import lgusData from './data/lgus.json';

const PREFIX = 'egov_';
const SCHEMA_VERSION = 2;

// ----------------------------------------------------------------
// Core localStorage helpers
// ----------------------------------------------------------------

export const db = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      // Corrupted data — return null and log
      console.warn('[eGovPH db] Corrupted data for key:', key);
      return null;
    }
  },

  /**
   * Persist a value. Returns true on success, false on failure.
   * Callers should handle false returns rather than assuming success.
   */
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      if (e instanceof DOMException && (
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      )) {
        console.error('[eGovPH db] Storage quota exceeded for key:', key);
      } else {
        console.error('[eGovPH db] Failed to write to localStorage:', e);
      }
      return false;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      // ignore
    }
  },

  clear(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
      keys.forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  },
};

// ----------------------------------------------------------------
// Schema migration
// ----------------------------------------------------------------

function migrateIfNeeded(): void {
  const storedVersion = db.get<number>('schemaVersion');
  if (storedVersion === SCHEMA_VERSION) return;

  if (!storedVersion || storedVersion < 2) {
    // v1 -> v2: normalize mobile numbers, rename philSysNumber -> pcn
    try {
      const users = db.get<Record<string, unknown>[]>('users') ?? [];
      const migrated = users.map(u => {
        let mobile = u.mobileNumber as string;
        if (mobile && !mobile.startsWith('+')) {
          const digits = mobile.replace(/\D/g, '');
          if (digits.startsWith('09') && digits.length === 11) {
            mobile = '+63' + digits.slice(1);
          } else if (digits.startsWith('9') && digits.length === 10) {
            mobile = '+63' + digits;
          } else if (digits.startsWith('639') && digits.length === 12) {
            mobile = '+' + digits;
          }
        }
        const { philSysNumber, ...rest } = u as Record<string, unknown>;
        const pcn = philSysNumber || u.pcn || null;
        return { ...rest, mobileNumber: mobile, pcn };
      });
      db.set('users', migrated);
    } catch (e) {
      console.warn('[eGovPH db] Migration v1->v2 failed:', e);
    }
  }

  // Structural fix: arrays to keyed objects (runs regardless of schemaVersion if needed)
  try {
    const rawIds = localStorage.getItem(PREFIX + 'digitalIds');
    if (rawIds && rawIds.startsWith('[')) {
      const arr = JSON.parse(rawIds);
      db.set('digitalIds', { 'user-verified-01': arr });
    }
  } catch (e) {
    console.warn('[eGovPH db] Migration for digitalIds failed:', e);
  }

  try {
    const rawNotifs = localStorage.getItem(PREFIX + 'notifications');
    if (rawNotifs && rawNotifs.startsWith('[')) {
      const arr = JSON.parse(rawNotifs);
      db.set('notifications', { 'user-verified-01': arr });
    }
  } catch (e) {
    console.warn('[eGovPH db] Migration for notifications failed:', e);
  }

  const ok = db.set('schemaVersion', SCHEMA_VERSION);
  if (!ok) {
    console.warn('[eGovPH db] Failed to save schema version during migration.');
  }
}

// ----------------------------------------------------------------
// Seed initial data (called on first load and on reset)
// ----------------------------------------------------------------

export function seedDatabase(): void {
  const ok = db.set('users', usersData);
  if (!ok) {
    console.warn('[eGovPH db] Seeding failed due to storage limits or unavailability.');
    return;
  }
  db.set('agencies', agenciesData);
  db.set('contributions', contributionsData);
  db.set('digitalIds', digitalIdsData);
  db.set('notifications', notificationsData);
  db.set('tourism', tourismData);
  db.set('jobs', jobsData);
  db.set('faqs', faqsData);
  db.set('weather', weatherData);
  db.set('lgus', lgusData);
  db.set('appointments', []);
  db.set('psaRequests', []);
  db.set('eReports', []);
  db.set('consultations', []);
  db.set('eGovPayPayments', []);
  db.set('etravel', []);
  db.set('jobApplications', []);
  db.set('verificationRequests', []);
  
  db.set('seeded', true);
  db.set('schemaVersion', SCHEMA_VERSION);

  // Only seed disclaimer to false if it doesn't exist
  if (db.get('disclaimerShown') === null) {
    db.set('disclaimerShown', false);
  }
}

import { clearFiles } from './fileStore';

// ----------------------------------------------------------------
// Reset all data (Research Tools: Reset Demo Data)
// ----------------------------------------------------------------

export async function resetDatabase(): Promise<void> {
  db.clear();
  try {
    await clearFiles();
  } catch (err) {
    console.warn('[eGovPH db] Failed to clear file store:', err);
  }
  seedDatabase();
}

// ----------------------------------------------------------------
// Initialise on import
// ----------------------------------------------------------------

if (!db.get('seeded')) {
  seedDatabase();
} else {
  migrateIfNeeded();
}

// ----------------------------------------------------------------
// Utility: simulated network delay
// ----------------------------------------------------------------

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ----------------------------------------------------------------
// Mock ApiError class (for simulated network failures)
// ----------------------------------------------------------------

export class ApiError extends Error {
  public code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = 'ApiError';
  }
}

// ----------------------------------------------------------------
// Helper: controlled simulation failure (disabled in participant builds)
// ----------------------------------------------------------------

let _failureEnabled = false;

export function setSimulatedFailures(enabled: boolean): void {
  _failureEnabled = enabled;
}

export function maybeThrow(chance = 0.05): void {
  if (!_failureEnabled) return;
  if (Math.random() < chance) {
    throw new ApiError('NETWORK_ERROR', 'A simulated network error occurred. Please try again.');
  }
}

// ----------------------------------------------------------------
// Typed Accessors for User Data
// ----------------------------------------------------------------

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: string;
}

export interface DigitalID {
  type: string;
  label: string;
  agency: string;
  available: boolean;
  idNumber?: string | null;
  issuedDate?: string | null;
  expiresDate?: string | null;
  holderName?: string | null;
  qrPayload?: string | null;
  description: string;
  color: string;
  notice?: string | null;
}

export function getUserDigitalIds(userId: string): DigitalID[] {
  const data = db.get<Record<string, DigitalID[]> | DigitalID[]>('digitalIds') ?? {};
  if (Array.isArray(data)) return data; 
  return data[userId] || [];
}

export function getUserNotifications(userId: string): AppNotification[] {
  const data = db.get<Record<string, AppNotification[]> | AppNotification[]>('notifications') ?? {};
  if (Array.isArray(data)) return data; 
  return data[userId] || [];
}

export function updateUserNotification(userId: string, notifId: string, updates: Partial<AppNotification>): void {
  const data = db.get<Record<string, AppNotification[]>>('notifications') ?? {};
  if (Array.isArray(data)) return;
  const userNotifs = data[userId] || [];
  const next = userNotifs.map(n => n.id === notifId ? { ...n, ...updates } : n);
  data[userId] = next;
  db.set('notifications', data);
}

export function markAllUserNotificationsRead(userId: string): void {
  const data = db.get<Record<string, AppNotification[]>>('notifications') ?? {};
  if (Array.isArray(data)) return;
  const userNotifs = data[userId] || [];
  const next = userNotifs.map(n => ({ ...n, read: true }));
  data[userId] = next;
  db.set('notifications', data);
}
