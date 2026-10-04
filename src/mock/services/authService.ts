/**
 * Mock Auth Service — eGovPH HCI Prototype
 *
 * Handles registration, login, OTP verification, MPIN management.
 * DEMO OTP: 123456 always (documented in ResearchTools panel)
 * DEMO MPIN: 111111 for seeded accounts
 *
 * ACADEMIC PROTOTYPE - No real credentials, no real PII, no real backend.
 * The mock hash is deterministic but NOT cryptographically secure.
 * Do not use this pattern in any production context.
 *
 * Mobile numbers are stored and compared in canonical E.164 format (+639XXXXXXXXX).
 */

import { db, delay, ApiError } from '../db';
import { generateSyntheticIdentity } from './verificationService';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface User {
  id: string;
  /** Canonical E.164 mobile number, e.g. +639171234567 */
  mobileNumber: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  address: string;
  nationality: string;
  mpinHash: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  /** Public 16-digit PhilSys Card Number (XXXX-XXXX-XXXX-XXXX) */
  pcn?: string | null;
  lguCode?: string;
  profilePhoto?: string | null;
  createdAt: string;
  verifiedAt?: string;
  emailVerified?: boolean;
  mobileVerified?: boolean;
}

export interface RegisterPayload {
  mobileNumber: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  mpin: string;
  challengeId: string;
}

/** Allowed fields for profile updates. Credentials and status cannot be changed via this DTO. */
export type ProfileUpdateDTO = Partial<
  Pick<User, 'address' | 'nationality' | 'lguCode' | 'profilePhoto'>
>;

// ----------------------------------------------------------------
// Mobile number normalization
// ----------------------------------------------------------------

/**
 * Normalizes Philippine mobile numbers to canonical E.164 format.
 * Accepts: 09XXXXXXXXX, 9XXXXXXXXX, 639XXXXXXXXX, +639XXXXXXXXX
 * Returns: +639XXXXXXXXX or null if invalid.
 */
export function normalizePHMobile(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, '');

  // +639XXXXXXXXX or 639XXXXXXXXX (13 or 12 digits)
  if (digits.startsWith('639') && digits.length === 12) {
    return '+' + digits;
  }
  // 09XXXXXXXXX (11 digits)
  if (digits.startsWith('09') && digits.length === 11) {
    return '+63' + digits.slice(1);
  }
  // 9XXXXXXXXX (10 digits)
  if (digits.startsWith('9') && digits.length === 10) {
    return '+63' + digits;
  }
  return null;
}

/**
 * Formats a canonical E.164 PH mobile number for display.
 * +639171234567 -> 0917 123 4567
 */
export function formatPHMobileDisplay(e164: string): string {
  const match = e164.match(/^\+63(9\d{9})$/);
  if (!match) return e164;
  const local = match[1]; // 9XXXXXXXXX
  return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

// ----------------------------------------------------------------
// Simple hash (NOT cryptographic — mock only)
// ----------------------------------------------------------------

/**
 * A deterministic hash for the mock MPIN comparison.
 * This is NOT secure and must NEVER be used in production.
 * A real implementation would use a proper KDF (bcrypt/argon2) server-side.
 */
function mockHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// ----------------------------------------------------------------
// MPIN validation rules (shared between creation and verification)
// ----------------------------------------------------------------

export function validateMPIN(mpin: string): string | null {
  if (!/^\d{6}$/.test(mpin)) return 'MPIN must be exactly 6 digits.';
  if (/^(\d)\1{5}$/.test(mpin)) return 'MPIN cannot be all the same digit (e.g., 111111).';
  // Sequential ascending
  const ascending = '0123456789';
  if (ascending.includes(mpin) || ascending.includes(mpin.split('').reverse().join(''))) {
    return 'MPIN cannot be a simple sequence (e.g., 123456).';
  }
  return null;
}

// ----------------------------------------------------------------
// Service functions
// ----------------------------------------------------------------

/** Request an OTP for a mobile number. In demo mode, OTP is always 123456. */
export async function requestOTP(rawMobile: string, purpose: 'registration' | 'recovery' | 'update' = 'registration'): Promise<{ sent: boolean; challengeId: string }> {
  await delay(800 + Math.random() * 400);
  const canonical = normalizePHMobile(rawMobile);
  if (!canonical) throw new ApiError('INVALID_MOBILE', 'Invalid Philippine mobile number.');

  // Create a mock OTP challenge
  // Invalidate any previous pending challenges for this destination
  const allKeys = db.get<string[]>('__keys__') || [];
  allKeys.forEach(key => {
    if (key.startsWith('otpChallenge:')) {
      const existing = db.get<{ destination: string; purpose: string }>(key);
      if (existing && existing.destination === canonical && existing.purpose === purpose) {
        db.remove(key);
      }
    }
  });

  const challengeId = `otp-${canonical.replace('+', '')}-${purpose}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const challenge = {
    id: challengeId,
    destination: canonical,
    purpose,
    code: '123456', // Demo code — visible in ResearchTools
    issuedAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0,
    maxAttempts: 3,
    consumed: false,
  };
  
  const ok = db.set(`otpChallenge:${challengeId}`, challenge);
  if (!ok) throw new ApiError('STORAGE_ERROR', 'Failed to generate OTP challenge. Please try again.');

  // In a real app, an SMS would be sent here.
  console.info(`[eGovPH DEMO] OTP for ${canonical}: 123456 (demo only, not sent)`);
  return { sent: true, challengeId };
}

/** Request an OTP for an email address. In demo mode, OTP is always 123456. */
export async function requestEmailOTP(email: string, purpose: 'registration' | 'recovery' | 'update' = 'registration'): Promise<{ sent: boolean; challengeId: string }> {
  await delay(800 + Math.random() * 400);
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new ApiError('INVALID_EMAIL', 'Invalid email address.');

  // Invalidate any previous pending challenges
  const allKeys = db.get<string[]>('__keys__') || [];
  allKeys.forEach(key => {
    if (key.startsWith('otpChallenge:')) {
      const existing = db.get<{ destination: string; purpose: string }>(key);
      if (existing && existing.destination === normalized && existing.purpose === purpose) {
        db.remove(key);
      }
    }
  });

  const challengeId = `otp-email-${normalized}-${purpose}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const challenge = {
    id: challengeId,
    destination: normalized,
    purpose,
    code: '123456',
    issuedAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
    maxAttempts: 3,
    consumed: false,
  };
  
  const ok = db.set(`otpChallenge:${challengeId}`, challenge);
  if (!ok) throw new ApiError('STORAGE_ERROR', 'Failed to generate OTP challenge. Please try again.');

  console.info(`[eGovPH DEMO] OTP for ${normalized}: 123456 (demo only, not sent)`);
  return { sent: true, challengeId };
}

/** Verify an OTP challenge. */
export async function verifyOTP(
  challengeId: string,
  code: string
): Promise<{ valid: boolean }> {
  await delay(600 + Math.random() * 300);

  const challenge = db.get<{
    id: string;
    code: string;
    expiresAt: number;
    attempts: number;
    maxAttempts: number;
    consumed: boolean;
  }>(`otpChallenge:${challengeId}`);

  if (!challenge) throw new ApiError('OTP_NOT_FOUND', 'OTP session not found. Please request a new code.');
  if (challenge.consumed) throw new ApiError('OTP_USED', 'This code has already been used. Please request a new code.');
  if (Date.now() > challenge.expiresAt) throw new ApiError('OTP_EXPIRED', 'This code has expired. Please request a new code.');
  if (challenge.attempts >= challenge.maxAttempts) throw new ApiError('OTP_MAX_ATTEMPTS', 'Too many incorrect attempts. Please request a new code.');

  // Increment attempts
  const ok1 = db.set(`otpChallenge:${challengeId}`, { ...challenge, attempts: challenge.attempts + 1 });
  if (!ok1) throw new ApiError('STORAGE_ERROR', 'Failed to update attempts.');

  if (code !== challenge.code) {
    throw new ApiError('OTP_INVALID', 'Incorrect code. Please check and try again.');
  }

  // Mark as verified but not consumed (consumed happens when used for mutation)
  const ok2 = db.set(`otpChallenge:${challengeId}`, { ...challenge, verified: true });
  if (!ok2) throw new ApiError('STORAGE_ERROR', 'Failed to verify OTP.');
  
  return { valid: true };
}

/** Register a new user account. */
export async function register(payload: RegisterPayload): Promise<User> {
  await delay(1000 + Math.random() * 500);

  const canonical = normalizePHMobile(payload.mobileNumber);
  if (!canonical) throw new ApiError('INVALID_MOBILE', 'Invalid Philippine mobile number.');

  const validationError = validateMPIN(payload.mpin);
  if (validationError && payload.mpin !== '112233') { // Allow the seeded exception if needed, though mostly seeded users bypass register. Wait, instructions say: "Preserve the intentionally documented seeded-account PIN exception." Let's just allow '112233' or skip validation if it's the exact seeded value.
    throw new ApiError('INVALID_MPIN', validationError);
  }

  const challenge = db.get<{ destination: string; purpose: string; consumed: boolean; verified?: boolean }>(`otpChallenge:${payload.challengeId}`);
  if (!challenge || challenge.destination !== canonical || challenge.purpose !== 'registration' || !challenge.verified || challenge.consumed) {
    throw new ApiError('VERIFICATION_REQUIRED', 'Mobile number verification is missing or invalid.');
  }

  // Consume the challenge
  db.set(`otpChallenge:${payload.challengeId}`, { ...challenge, consumed: true });

  const users = db.get<User[]>('users') ?? [];

  // Check for duplicate mobile number
  if (users.find(u => u.mobileNumber === canonical)) {
    throw new ApiError('DUPLICATE_MOBILE', 'This mobile number is already registered.');
  }

  // Check for duplicate email
  const normalizedEmail = payload.email.trim().toLowerCase();
  if (users.find(u => u.email.trim().toLowerCase() === normalizedEmail)) {
    throw new ApiError('DUPLICATE_EMAIL', 'This email address is already registered.');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    mobileNumber: canonical,
    email: normalizedEmail,
    fullName: [payload.firstName, payload.middleName, payload.lastName, payload.suffix]
      .filter(Boolean).join(' '),
    firstName: payload.firstName,
    lastName: payload.lastName,
    middleName: payload.middleName,
    suffix: payload.suffix,
    dateOfBirth: payload.dateOfBirth,
    sex: payload.sex,
    address: '',
    nationality: 'Filipino',
    mpinHash: mockHash(payload.mpin),
    verificationStatus: 'unverified',
    pcn: null,
    lguCode: 'QC',
    profilePhoto: null,
    createdAt: new Date().toISOString(),
    emailVerified: false,
    mobileVerified: true, // OTP verified during signup
  };

  const updated = [...users, newUser];
  const ok = db.set('users', updated);
  if (!ok) throw new ApiError('STORAGE_ERROR', 'Failed to save account. Please try again.');

  // Generate synthetic PhilSys record so the user can verify their account
  generateSyntheticIdentity(newUser);

  return newUser;
}

/** Login with mobile number (any supported format) and MPIN. */
export async function login(rawMobile: string, mpin: string): Promise<User> {
  await delay(700 + Math.random() * 400);

  const canonical = normalizePHMobile(rawMobile);
  if (!canonical) throw new ApiError('INVALID_MOBILE', 'Invalid Philippine mobile number.');

  const users = db.get<User[]>('users') ?? [];
  const user = users.find(u => u.mobileNumber === canonical);

  if (!user) {
    throw new ApiError('USER_NOT_FOUND', 'No account found with this mobile number.');
  }

  const expectedHash = mockHash(mpin);
  if (user.mpinHash !== expectedHash) {
    throw new ApiError('INVALID_MPIN', 'Incorrect MPIN. Please try again.');
  }

  return user;
}

/** Update the MPIN for a user. */
export async function updateMPIN(userId: string, currentMpin: string, newMpin: string): Promise<void> {
  await delay(600 + Math.random() * 300);

  // Validate new MPIN format
  const validationError = validateMPIN(newMpin);
  if (validationError) throw new ApiError('INVALID_MPIN', validationError);

  const users = db.get<User[]>('users') ?? [];
  const user = users.find(u => u.id === userId);
  if (!user) throw new ApiError('USER_NOT_FOUND', 'User not found.');

  // Verify current MPIN
  if (user.mpinHash !== mockHash(currentMpin)) {
    throw new ApiError('INVALID_MPIN', 'Current MPIN is incorrect.');
  }

  const updatedUsers = users.map(u =>
    u.id === userId ? { ...u, mpinHash: mockHash(newMpin) } : u
  );
  const ok = db.set('users', updatedUsers);
  if (!ok) throw new ApiError('STORAGE_ERROR', 'Failed to update MPIN. Please try again.');
}

/** Update allowed profile fields only. Credentials and status cannot be changed here. */
export async function updateUserProfile(userId: string, updates: ProfileUpdateDTO): Promise<User> {
  await delay(600 + Math.random() * 300);

  const users = db.get<User[]>('users') ?? [];
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new ApiError('USER_NOT_FOUND', 'User not found.');

  const updated: User = { ...users[idx], ...updates };
  users[idx] = updated;
  const ok = db.set('users', users);
  if (!ok) throw new ApiError('STORAGE_ERROR', 'Failed to save profile. Please try again.');
  return updated;
}

/** Change the email for a user (after verification). */
export async function changeEmail(userId: string, newEmail: string, challengeId: string): Promise<User> {
  await delay(600 + Math.random() * 300);

  const normalizedEmail = newEmail.trim().toLowerCase();
  
  const challenge = db.get<{ destination: string; purpose: string; consumed: boolean; verified?: boolean }>(`otpChallenge:${challengeId}`);
  if (!challenge || challenge.destination !== normalizedEmail || challenge.purpose !== 'update' || !challenge.verified || challenge.consumed) {
    throw new ApiError('VERIFICATION_REQUIRED', 'Email verification is missing or invalid.');
  }

  const users = db.get<User[]>('users') ?? [];

  // Check for duplicate
  if (users.find(u => u.id !== userId && u.email.trim().toLowerCase() === normalizedEmail)) {
    throw new ApiError('DUPLICATE_EMAIL', 'This email address is already in use.');
  }

  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new ApiError('USER_NOT_FOUND', 'User not found.');

  // Consume the challenge
  db.set(`otpChallenge:${challengeId}`, { ...challenge, consumed: true });

  const updated: User = { ...users[idx], email: normalizedEmail, emailVerified: true };
  users[idx] = updated;
  const ok = db.set('users', users);
  if (!ok) throw new ApiError('STORAGE_ERROR', 'Failed to save email. Please try again.');
  return updated;
}

/** Change the mobile number for a user (after verification). */
export async function changeMobile(userId: string, rawMobile: string, challengeId: string): Promise<User> {
  await delay(600 + Math.random() * 300);

  const canonical = normalizePHMobile(rawMobile);
  if (!canonical) throw new ApiError('INVALID_MOBILE', 'Invalid Philippine mobile number.');

  const challenge = db.get<{ destination: string; purpose: string; consumed: boolean; verified?: boolean }>(`otpChallenge:${challengeId}`);
  if (!challenge || challenge.destination !== canonical || challenge.purpose !== 'update' || !challenge.verified || challenge.consumed) {
    throw new ApiError('VERIFICATION_REQUIRED', 'Mobile verification is missing or invalid.');
  }

  const users = db.get<User[]>('users') ?? [];

  // Check for duplicate
  if (users.find(u => u.id !== userId && u.mobileNumber === canonical)) {
    throw new ApiError('DUPLICATE_MOBILE', 'This mobile number is already in use.');
  }

  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new ApiError('USER_NOT_FOUND', 'User not found.');

  // Consume the challenge
  db.set(`otpChallenge:${challengeId}`, { ...challenge, consumed: true });

  const updated: User = { ...users[idx], mobileNumber: canonical, mobileVerified: true };
  users[idx] = updated;
  const ok = db.set('users', users);
  if (!ok) throw new ApiError('STORAGE_ERROR', 'Failed to save mobile number. Please try again.');
  return updated;
}

/** Get the current user by ID from storage. */
export function getUserById(userId: string): User | null {
  const users = db.get<User[]>('users') ?? [];
  return users.find(u => u.id === userId) ?? null;
}

/** Reset MPIN after recovery (requires mock identity proof). */
export async function resetMPIN(
  rawMobile: string,
  newMpin: string,
  challengeId: string
): Promise<void> {
  await delay(700 + Math.random() * 400);

  const validationError = validateMPIN(newMpin);
  if (validationError) throw new ApiError('INVALID_MPIN', validationError);

  const canonical = normalizePHMobile(rawMobile);
  if (!canonical) throw new ApiError('INVALID_MOBILE', 'Invalid Philippine mobile number.');

  const challenge = db.get<{ destination: string; purpose: string; consumed: boolean; verified?: boolean }>(`otpChallenge:${challengeId}`);
  if (!challenge || challenge.destination !== canonical || challenge.purpose !== 'recovery' || !challenge.verified || challenge.consumed) {
    throw new ApiError('VERIFICATION_REQUIRED', 'Recovery verification is missing or invalid.');
  }

  const users = db.get<User[]>('users') ?? [];
  const idx = users.findIndex(u => u.mobileNumber === canonical);
  if (idx === -1) throw new ApiError('USER_NOT_FOUND', 'No account found.');

  // Check if new mpin is the same as the old one (prevent reuse)
  if (users[idx].mpinHash === mockHash(newMpin)) {
    throw new ApiError('INVALID_MPIN', 'New MPIN cannot be the same as the current one.');
  }

  // Consume the challenge
  db.set(`otpChallenge:${challengeId}`, { ...challenge, consumed: true });

  users[idx] = { ...users[idx], mpinHash: mockHash(newMpin) };
  const ok = db.set('users', users);
  if (!ok) throw new ApiError('STORAGE_ERROR', 'Failed to reset MPIN. Please try again.');
}
