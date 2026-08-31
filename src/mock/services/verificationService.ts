/**
 * Mock Verification Service — eGovPH HCI Prototype
 * 
 * Handles Flow A: Account Verification (Part 2 of registration).
 * Validates personal info against the "PhilSys record" fixture,
 * processes the PCN, and manages verification status transitions.
 */

import { db, delay, ApiError } from '../db';
import type { User } from './authService';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface VerificationPayload {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  address: string;
  nationality: string;
  philSysNumber: string;
}

// ----------------------------------------------------------------
// Mock PhilSys record to validate against (fixture)
// This simulates the PSA/PhilSys database check.
// In a real implementation, this would be an encrypted API call.
// ----------------------------------------------------------------

const MOCK_PHILSYS_RECORDS: Record<string, { fullName: string; dateOfBirth: string; sex: 'M' | 'F'; nationality: string }> = {
  '1234-5678-9012': {
    fullName: 'Maria Lourdes Reyes Santos',
    dateOfBirth: '1990-07-22',
    sex: 'F',
    nationality: 'Filipino',
  },
  // Demo PCN always used by the "Scan ID" mock button
  '0000-0000-0001': {
    fullName: 'Juan Santos dela Cruz',
    dateOfBirth: '1995-03-15',
    sex: 'M',
    nationality: 'Filipino',
  },
};

// ----------------------------------------------------------------
// Service functions
// ----------------------------------------------------------------

/**
 * Validate personal info against the mock PhilSys record.
 * Returns the matched record or throws if no match.
 */
export async function validatePersonalInfo(
  philSysNumber: string,
  payload: { fullName: string; dateOfBirth: string; sex: 'M' | 'F'; nationality: string }
): Promise<{ valid: boolean }> {
  await delay(1200 + Math.random() * 600);

  const record = MOCK_PHILSYS_RECORDS[philSysNumber];
  if (!record) {
    throw new ApiError(
      'PCN_NOT_FOUND',
      "This PhilSys Card Number was not found in our records. Please check the number and try again."
    );
  }

  // Lenient name match (case-insensitive, ignore extra spaces)
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const nameMatch = normalize(record.fullName).includes(normalize(payload.fullName)) ||
    normalize(payload.fullName).includes(normalize(record.fullName));

  if (!nameMatch || record.dateOfBirth !== payload.dateOfBirth || record.sex !== payload.sex) {
    throw new ApiError(
      'RECORD_MISMATCH',
      "This doesn't match our records. Check your spelling and try again. Make sure your details exactly match your National ID."
    );
  }

  return { valid: true };
}

/**
 * Submit a verification request. Transitions the user to "pending" status.
 * The actual approval is simulated via a timer (Section 7.1 spec).
 */
export async function submitVerification(payload: VerificationPayload): Promise<void> {
  await delay(1500 + Math.random() * 500);

  const users = db.get<User[]>('users') ?? [];
  const idx = users.findIndex(u => u.id === payload.userId);
  if (idx === -1) throw new ApiError('USER_NOT_FOUND');

  users[idx] = {
    ...users[idx],
    verificationStatus: 'pending',
    philSysNumber: payload.philSysNumber,
    address: payload.address,
    nationality: payload.nationality,
  };
  db.set('users', users);
}

/**
 * Poll verification status. Called periodically from VerifyPendingScreen.
 * Returns the current status. If instant-verify is ON, resolves immediately.
 */
export async function getVerificationStatus(userId: string): Promise<'unverified' | 'pending' | 'verified'> {
  await delay(400 + Math.random() * 200);

  const users = db.get<User[]>('users') ?? [];
  const user = users.find(u => u.id === userId);
  return user?.verificationStatus ?? 'unverified';
}

/**
 * Instant verification (Research Tools toggle).
 * Immediately transitions user to verified status.
 */
export async function instantVerify(userId: string): Promise<void> {
  await delay(300);

  const users = db.get<User[]>('users') ?? [];
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new ApiError('USER_NOT_FOUND');

  users[idx] = {
    ...users[idx],
    verificationStatus: 'verified',
    verifiedAt: new Date().toISOString(),
  };
  db.set('users', users);
}

/**
 * Natural verification approval (called after the pending timer expires).
 */
export async function approveVerification(userId: string): Promise<void> {
  await delay(200);

  const users = db.get<User[]>('users') ?? [];
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return;

  users[idx] = {
    ...users[idx],
    verificationStatus: 'verified',
    verifiedAt: new Date().toISOString(),
  };
  db.set('users', users);
}

/** Get the demo PCN used by the "Scan ID" mock button. */
export function getDemoPCN(userId: string): string {
  const users = db.get<User[]>('users') ?? [];
  const user = users.find(u => u.id === userId);
  // Return a user-specific demo PCN or the generic one
  if (user?.mobileNumber === '09189876543') return '1234-5678-9012';
  return '0000-0000-0001';
}
