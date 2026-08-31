/**
 * Mock Agency Service — eGovPH HCI Prototype
 * 
 * Handles NGAs directory, agency details, linking, and contribution records.
 * All data is local — no real API calls to SSS, GSIS, PhilHealth, or Pag-IBIG.
 */

import { db, delay, ApiError, maybeThrow } from '../db';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface Agency {
  id: string;
  name: string;
  shortName: string;
  category: string;
  categoryId: string;
  description: string;
  logoColor: string;
  logoLetter: string;
  linked: boolean;
  memberNumber: string | null;
  services: string[];
}

export interface Contribution {
  period: string;
  amount: number;
  status: 'posted' | 'pending';
  employerShare: number;
  total: number;
}

// ----------------------------------------------------------------
// Service functions
// ----------------------------------------------------------------

/** Get all agencies. */
export async function getAgencies(): Promise<Agency[]> {
  await delay(500 + Math.random() * 300);
  maybeThrow(0.04);
  return db.get<Agency[]>('agencies') ?? [];
}

/** Get a single agency by ID. */
export async function getAgencyById(id: string): Promise<Agency> {
  await delay(400 + Math.random() * 200);
  const agencies = db.get<Agency[]>('agencies') ?? [];
  const agency = agencies.find(a => a.id === id);
  if (!agency) throw new ApiError('AGENCY_NOT_FOUND', 'Agency not found.');
  return agency;
}

/** Get contribution history for a specific agency. */
export async function getContributions(agencyId: string): Promise<Contribution[]> {
  await delay(600 + Math.random() * 400);
  maybeThrow(0.05);
  const contributions = db.get<Record<string, Contribution[]>>('contributions') ?? {};
  return contributions[agencyId] ?? [];
}

/** Link a user's account to an agency. */
export async function linkAgencyAccount(
  agencyId: string,
  memberNumber: string
): Promise<{ success: boolean }> {
  await delay(1200 + Math.random() * 600);
  maybeThrow(0.04);

  // Simple validation: member number must be at least 6 chars
  if (!memberNumber || memberNumber.trim().length < 6) {
    throw new ApiError('INVALID_MEMBER_NUMBER', 'Please enter a valid member number.');
  }

  const agencies = db.get<Agency[]>('agencies') ?? [];
  const idx = agencies.findIndex(a => a.id === agencyId);
  if (idx === -1) throw new ApiError('AGENCY_NOT_FOUND');

  agencies[idx] = { ...agencies[idx], linked: true, memberNumber: memberNumber.trim() };
  db.set('agencies', agencies);

  return { success: true };
}

/** Unlink an agency (for reset purposes). */
export async function unlinkAgencyAccount(agencyId: string): Promise<void> {
  await delay(600 + Math.random() * 300);

  const agencies = db.get<Agency[]>('agencies') ?? [];
  const idx = agencies.findIndex(a => a.id === agencyId);
  if (idx !== -1) {
    agencies[idx] = { ...agencies[idx], linked: false, memberNumber: null };
    db.set('agencies', agencies);
  }
}

/** Get all category IDs and labels for the "By Category" view. */
export function getCategories(): { id: string; label: string; icon: string }[] {
  return [
    { id: 'social-security', label: 'Social Security', icon: 'shield' },
    { id: 'health', label: 'Health', icon: 'heart-pulse' },
    { id: 'housing', label: 'Housing', icon: 'home' },
    { id: 'transportation', label: 'Transportation', icon: 'car' },
    { id: 'taxation', label: 'Taxation', icon: 'receipt' },
    { id: 'public-safety', label: 'Public Safety', icon: 'badge' },
    { id: 'foreign-affairs', label: 'Foreign Affairs', icon: 'globe' },
    { id: 'employment', label: 'Employment', icon: 'briefcase' },
    { id: 'professional-licensing', label: 'Professional Licensing', icon: 'award' },
    { id: 'ofw-services', label: 'OFW Services', icon: 'plane' },
    { id: 'social-welfare', label: 'Social Welfare', icon: 'users' },
  ];
}
