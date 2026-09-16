/**
 * eGovPH HCI Prototype — Mock Database (localStorage wrapper)
 * 
 * All data is stored locally. No real government data, no PII, no real APIs.
 * This module handles seeding initial fixture data and providing typed
 * get/set/remove operations so services feel like a real async API.
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
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('[eGovPH db] Failed to write to localStorage:', e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    // Only clear keys prefixed with our namespace
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  },
};

// ----------------------------------------------------------------
// Seed initial data (called on first load and on reset)
// ----------------------------------------------------------------

export function seedDatabase(): void {
  db.set('users', usersData);
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
  db.set('seeded', true);
  
  // Only seed disclaimer to false if it doesn't exist
  if (db.get('disclaimerShown') === null) {
    db.set('disclaimerShown', false);
  }
}

// ----------------------------------------------------------------
// Reset all data (Research Tools: Reset Demo Data)
// ----------------------------------------------------------------

export function resetDatabase(): void {
  db.clear();
  seedDatabase();
}

// ----------------------------------------------------------------
// Initialise on import — only seeds if never seeded before
// ----------------------------------------------------------------

if (!db.get('seeded')) {
  seedDatabase();
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
  constructor(
    code: string,
    message?: string
  ) {
    super(message ?? code);
    this.code = code;
    this.name = 'ApiError';
  }
}

// ----------------------------------------------------------------
// Helper: occasional simulated failure (5% chance by default)
// ----------------------------------------------------------------

export function maybeThrow(chance = 0.05): void {
  if (Math.random() < chance) {
    throw new ApiError('NETWORK_ERROR', 'A network error occurred. Please try again.');
  }
}
