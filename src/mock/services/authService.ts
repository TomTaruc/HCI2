/**
 * Mock Auth Service — eGovPH HCI Prototype
 * 
 * Handles registration, login, OTP verification, MPIN management.
 * DEMO OTP: 123456 always (documented in ResearchTools panel)
 * DEMO MPIN: 111111 for seeded accounts
 * 
 * No real credentials, no real PII, no real backend.
 */

import { db, delay, ApiError, maybeThrow } from '../db';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface User {
  id: string;
  mobileNumber: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  address: string;
  nationality: string;
  mpinHash: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  philSysNumber?: string | null;
  lguCode?: string;
  profilePhoto?: string | null;
  createdAt: string;
  verifiedAt?: string;
}

export interface RegisterPayload {
  mobileNumber: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  mpin: string;
}

// ----------------------------------------------------------------
// Simple hash (not cryptographic — mock only)
// ----------------------------------------------------------------

function mockHash(value: string): string {
  // A deterministic but non-reversible transform for the mock
  // Do NOT use this in production — this is solely for the prototype
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// ----------------------------------------------------------------
// Service functions
// ----------------------------------------------------------------

/** Request an OTP for a mobile number. In demo mode, OTP is always 123456. */
export async function requestOTP(mobileNumber: string): Promise<{ sent: boolean }> {
  await delay(800 + Math.random() * 400);
  maybeThrow(0.03);
  // In the real app, this would send an SMS. Here we just acknowledge.
  console.info(`[eGovPH MOCK] OTP sent to ${mobileNumber}. Demo OTP: 123456`);
  return { sent: true };
}

/** Verify an OTP. In demo mode, OTP 123456 always succeeds. */
export async function verifyOTP(mobileNumber: string, otp: string): Promise<{ valid: boolean }> {
  await delay(600 + Math.random() * 300);
  maybeThrow(0.02);
  const isDemoOTP = otp === '123456';
  return { valid: isDemoOTP };
}

/** Register a new user account. */
export async function register(payload: RegisterPayload): Promise<User> {
  await delay(1000 + Math.random() * 500);
  maybeThrow(0.02);

  const users = db.get<User[]>('users') ?? [];

  // Check for duplicate mobile number
  if (users.find(u => u.mobileNumber === payload.mobileNumber)) {
    throw new ApiError('DUPLICATE_MOBILE', 'This mobile number is already registered.');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    mobileNumber: payload.mobileNumber,
    email: payload.email,
    fullName: `${payload.firstName} ${payload.middleName ? payload.middleName + ' ' : ''}${payload.lastName}`,
    firstName: payload.firstName,
    lastName: payload.lastName,
    middleName: payload.middleName,
    dateOfBirth: payload.dateOfBirth,
    sex: payload.sex,
    address: '',
    nationality: 'Filipino',
    mpinHash: mockHash(payload.mpin),
    verificationStatus: 'unverified',
    philSysNumber: null,
    lguCode: 'QC',
    profilePhoto: null,
    createdAt: new Date().toISOString(),
  };

  db.set('users', [...users, newUser]);
  return newUser;
}

/** Login with mobile number and MPIN. */
export async function login(mobileNumber: string, mpin: string): Promise<User> {
  await delay(700 + Math.random() * 400);
  maybeThrow(0.02);

  const users = db.get<User[]>('users') ?? [];
  const user = users.find(u => u.mobileNumber === mobileNumber);

  if (!user) {
    throw new ApiError('USER_NOT_FOUND', 'No account found with this mobile number.');
  }

  // Compare MPIN — demo: 111111 always works for seeded accounts
  const expectedHash = mockHash(mpin);
  const isDemo = mpin === '111111' && (
    mobileNumber === '09171234567' || mobileNumber === '09189876543'
  );

  if (!isDemo && user.mpinHash !== expectedHash) {
    throw new ApiError('INVALID_MPIN', 'Incorrect MPIN. Please try again.');
  }

  return user;
}

/** Update the MPIN for a user. */
export async function updateMPIN(userId: string, newMpin: string): Promise<void> {
  await delay(600 + Math.random() * 300);

  const users = db.get<User[]>('users') ?? [];
  const updated = users.map(u =>
    u.id === userId ? { ...u, mpinHash: mockHash(newMpin) } : u
  );
  db.set('users', updated);
}

/** Update user profile fields. */
export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
  await delay(600 + Math.random() * 300);

  const users = db.get<User[]>('users') ?? [];
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new ApiError('USER_NOT_FOUND');

  const updated = { ...users[idx], ...updates };
  users[idx] = updated;
  db.set('users', users);
  return updated;
}

/** Get the current user by ID from storage. */
export function getUserById(userId: string): User | null {
  const users = db.get<User[]>('users') ?? [];
  return users.find(u => u.id === userId) ?? null;
}
