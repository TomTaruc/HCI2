/**
 * Mock Verification Service — eGovPH HCI Prototype
 *
 * Handles Flow A: Account Verification (Part 2 of registration).
 * Validates personal info against the "PhilSys record" fixture,
 * processes the 16-digit PCN, and manages verification status transitions.
 *
 * ACADEMIC PROTOTYPE — No real PhilSys API is called.
 * A browser match against local fixtures does NOT authenticate a real National ID.
 * This service demonstrates the verification flow only.
 *
 * Public PCN format: XXXX-XXXX-XXXX-XXXX (16 digits, 4 groups of 4)
 * Private PSN (12 digits) is NEVER requested or stored by this prototype.
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
  /** 16-digit PCN, formatted as XXXX-XXXX-XXXX-XXXX */
  pcn: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_correction';
  payload: VerificationPayload;
  submittedAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

// ----------------------------------------------------------------
// Format/validate PCN
// ----------------------------------------------------------------

/**
 * Normalizes a PCN input to XXXX-XXXX-XXXX-XXXX format.
 * Strips non-digits and formats in groups of 4 separated by dashes.
 * Returns null if the result is not exactly 16 digits.
 */
export function normalizePCN(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 16) return null;
  return [
    digits.slice(0, 4),
    digits.slice(4, 8),
    digits.slice(8, 12),
    digits.slice(12, 16),
  ].join('-');
}

/**
 * Formats a PCN input for display as the user types.
 * Auto-inserts dashes at positions 4, 8, 12.
 */
export function formatPCNInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  const parts = [
    digits.slice(0, 4),
    digits.slice(4, 8),
    digits.slice(8, 12),
    digits.slice(12, 16),
  ].filter(Boolean);
  return parts.join('-');
}

// ----------------------------------------------------------------
// Mock PhilSys records — keyed by normalized 16-digit PCN
// Each record matches a seeded user account.
// ----------------------------------------------------------------

const MOCK_PHILSYS_RECORDS: Record<string, {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  nationality: string;
}> = {
  // Verified user account (user-verified-01): Maria Lourdes Reyes Santos
  '1234-5678-9012-3456': {
    userId: 'user-verified-01',
    fullName: 'Maria Lourdes Reyes Santos',
    dateOfBirth: '1990-07-22',
    sex: 'F',
    nationality: 'Filipino',
  },
  // Unverified user account (user-unverified-01): Juan Santos dela Cruz
  '0000-0000-0000-0001': {
    userId: 'user-unverified-01',
    fullName: 'Juan Santos dela Cruz',
    dateOfBirth: '1995-03-15',
    sex: 'M',
    nationality: 'Filipino',
  },
};

export function getPhilSysRecords() {
  const stored = db.get<Record<string, any>>('philSysRecords');
  if (stored) return stored;
  
  // Seed if missing
  db.set('philSysRecords', MOCK_PHILSYS_RECORDS);
  return JSON.parse(JSON.stringify(MOCK_PHILSYS_RECORDS));
}

// ----------------------------------------------------------------
// Service functions
// ----------------------------------------------------------------

/**
 * Generate a synthetic identity for a new account.
 * This ensures new accounts have a valid PhilSys fixture to verify against.
 */
export function generateSyntheticIdentity(user: Pick<User, 'id' | 'fullName' | 'dateOfBirth' | 'sex' | 'nationality'>) {
  const records = getPhilSysRecords();
  
  // Generate 16-digit PCN starting with 9999
  const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
  const pcnStr = `9999${randomDigits}`;
  const pcn = normalizePCN(pcnStr)!;

  records[pcn] = {
    userId: user.id,
    fullName: user.fullName,
    dateOfBirth: user.dateOfBirth,
    sex: user.sex,
    nationality: user.nationality || 'Filipino',
  };

  db.set('philSysRecords', records);
  return pcn;
}

/**
 * Validate personal info against the mock PhilSys record.
 * The PCN must be 16 digits, exist in our records, belong to the
 * requesting user's account, and the name/DOB/sex must match exactly.
 */
export async function validatePersonalInfo(
  userId: string,
  pcnInput: string,
  payload: { fullName: string; dateOfBirth: string; sex: 'M' | 'F'; nationality: string }
): Promise<{ valid: boolean }> {
  await delay(1200 + Math.random() * 600);

  const pcn = normalizePCN(pcnInput);
  if (!pcn) {
    throw new ApiError(
      'PCN_INVALID_FORMAT',
      'The PCN must be exactly 16 digits in XXXX-XXXX-XXXX-XXXX format.'
    );
  }

  const records = getPhilSysRecords();
  const record = records[pcn];
  if (!record) {
    throw new ApiError(
      'PCN_NOT_FOUND',
      'This PhilSys Card Number was not found in our records. Please check the number and try again.'
    );
  }

  // Ownership check: the PCN must belong to the current user's synthetic account
  if (record.userId !== userId) {
    throw new ApiError(
      'PCN_OWNERSHIP',
      'This PhilSys Card Number does not match your account. Please use the PCN assigned to your demo account.'
    );
  }

  // Exact normalized name match (case-insensitive, normalize whitespace)
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const nameMatch = normalize(record.fullName) === normalize(payload.fullName);

  if (!nameMatch) {
    throw new ApiError(
      'RECORD_MISMATCH',
      'The name you entered does not match the PhilSys record. Check your spelling and try again. Your name must exactly match your National ID.'
    );
  }

  if (record.dateOfBirth !== payload.dateOfBirth) {
    throw new ApiError(
      'RECORD_MISMATCH',
      'The date of birth you entered does not match the PhilSys record.'
    );
  }

  if (record.sex !== payload.sex) {
    throw new ApiError(
      'RECORD_MISMATCH',
      'The sex you selected does not match the PhilSys record.'
    );
  }

  return { valid: true };
}

/**
 * Submit a verification request. Transitions the user to "pending" status.
 * Requires that the user does not already have an active request.
 */
export async function submitVerification(payload: VerificationPayload): Promise<{ requestId: string }> {
  await delay(1500 + Math.random() * 500);

  const users = db.get<User[]>('users') ?? [];
  const userIdx = users.findIndex(u => u.id === payload.userId);
  if (userIdx === -1) throw new ApiError('USER_NOT_FOUND', 'User not found.');

  const user = users[userIdx];
  if (user.verificationStatus === 'verified') {
    throw new ApiError('ALREADY_VERIFIED', 'Your account is already verified.');
  }

  // Validate PCN format
  const normalizedPCN = normalizePCN(payload.pcn);
  if (!normalizedPCN) throw new ApiError('PCN_INVALID_FORMAT', 'Invalid PCN format.');

  // Revalidate identity and PCN ownership
  await validatePersonalInfo(payload.userId, normalizedPCN, {
    fullName: payload.fullName,
    dateOfBirth: payload.dateOfBirth,
    sex: payload.sex,
    nationality: payload.nationality,
  });

  const existingRequests = db.get<VerificationRequest[]>('verificationRequests') ?? [];
  const existingPending = existingRequests.find(r => r.userId === payload.userId && r.status === 'pending');
  if (existingPending) {
    return { requestId: existingPending.id };
  }

  // Create a verification request record
  const requestId = `vreq-${payload.userId}-${Date.now()}`;
  const request: VerificationRequest = {
    id: requestId,
    userId: payload.userId,
    status: 'pending',
    payload: { ...payload, pcn: normalizedPCN },
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.set('verificationRequests', [...existingRequests, request]);

  // Update user status to pending
  users[userIdx] = {
    ...users[userIdx],
    verificationStatus: 'pending',
    pcn: normalizedPCN,
    address: payload.address,
    nationality: payload.nationality,
  };
  const ok = db.set('users', users);
  if (!ok) throw new ApiError('STORAGE_ERROR', 'Failed to submit verification. Please try again.');

  return { requestId };
}

/**
 * Poll verification status. Called periodically from VerifyPendingScreen.
 * Only returns meaningful status for the request's owner.
 */
export async function getVerificationStatus(
  userId: string
): Promise<'unverified' | 'pending' | 'verified'> {
  await delay(400 + Math.random() * 200);

  const users = db.get<User[]>('users') ?? [];
  const user = users.find(u => u.id === userId);
  return user?.verificationStatus ?? 'unverified';
}

/**
 * Approve verification — only transitions if the user has an owned pending request.
 * Requires a pending verificationRequest owned by this userId.
 */
export async function approveVerification(userId: string): Promise<void> {
  await delay(200);

  // Check that an owned pending request exists
  const requests = db.get<VerificationRequest[]>('verificationRequests') ?? [];
  const ownedPending = requests.find(
    r => r.userId === userId && r.status === 'pending'
  );
  if (!ownedPending) {
    // Nothing to approve — do not grant verified status
    console.warn('[eGovPH] approveVerification: no owned pending request for', userId);
    return;
  }

  const users = db.get<User[]>('users') ?? [];
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return;

  // Must currently be in pending state
  if (users[idx].verificationStatus !== 'pending') return;

  users[idx] = {
    ...users[idx],
    verificationStatus: 'verified',
    verifiedAt: new Date().toISOString(),
  };
  db.set('users', users);

  // Update the request record
  const updatedRequests = requests.map(r =>
    r.id === ownedPending.id
      ? { ...r, status: 'approved' as const, updatedAt: new Date().toISOString() }
      : r
  );
  db.set('verificationRequests', updatedRequests);

  // Generate Digital ID
  const digitalIds = db.get<Record<string, any[]>>('digitalIds') ?? {};
  if (Array.isArray(digitalIds)) return; // Should be object by now
  const userIds = digitalIds[userId] || [];
  
  if (!userIds.find(d => d.type === 'ePhilID')) {
    const newId = {
      type: 'ePhilID',
      label: 'Digital National ID',
      agency: 'Philippine Statistics Authority',
      available: true,
      idNumber: `SAMPLE-${users[idx].pcn}`,
      pcn: users[idx].pcn,
      issuedDate: new Date().toISOString(),
      expiresDate: null,
      holderName: users[idx].fullName,
      qrPayload: JSON.stringify({ v: "1", type: "ePhilID", pcn: users[idx].pcn }),
      description: 'Issued under the Philippine Identification System (PhilSys). SAMPLE ONLY - NOT VALID FOR OFFICIAL USE.',
      color: '#0038A8'
    };
    digitalIds[userId] = [...userIds, newId];
    db.set('digitalIds', digitalIds);
  }
}

/**
 * Instant verification (Research Tools toggle).
 * Immediately transitions user to verified status.
 * Requires an owned pending request (same policy as natural approval).
 */
export async function instantVerify(userId: string): Promise<void> {
  await delay(300);
  // Creates a synthetic pending request if one doesn't exist (for research convenience)
  const requests = db.get<VerificationRequest[]>('verificationRequests') ?? [];
  const existing = requests.find(r => r.userId === userId && r.status === 'pending');
  if (!existing) {
    // For research tools: synthesize a pending request so policy passes
    const syntheticRequest: VerificationRequest = {
      id: `vreq-research-${userId}-${Date.now()}`,
      userId,
      status: 'pending',
      payload: {
        userId,
        fullName: 'Research Tool Override',
        dateOfBirth: '1990-01-01',
        sex: 'M',
        address: 'Research Tools',
        nationality: 'Filipino',
        pcn: '0000-0000-0000-0000',
      },
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.set('verificationRequests', [...requests, syntheticRequest]);

    // Also update user to pending first
    const users = db.get<User[]>('users') ?? [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1 && users[idx].verificationStatus === 'unverified') {
      users[idx] = { ...users[idx], verificationStatus: 'pending' };
      db.set('users', users);
    }
  }
  await approveVerification(userId);
}

/**
 * Get the demo PCN for the current user's account.
 * Used by the "Load sample details" button to show the correct PCN hint.
 */
export function getDemoPCN(userId: string): string {
  // Each user has their own demo PCN that matches their PhilSys record
  const records = getPhilSysRecords();
  for (const [pcn, record] of Object.entries(records)) {
    if ((record as any).userId === userId) return pcn;
  }
  return '';
}
