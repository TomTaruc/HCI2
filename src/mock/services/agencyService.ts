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
export async function getAgencies(userId: string): Promise<Agency[]> {
  await delay(500 + Math.random() * 300);
  maybeThrow(0.04);
  const baseAgencies = db.get<Agency[]>('agencies') ?? [];
  const links = db.get<Record<string, { memberNumber: string }>>(`agencyLinks:${userId}`) ?? {};

  return baseAgencies.map(a => ({
    ...a,
    linked: !!links[a.id],
    memberNumber: links[a.id]?.memberNumber ?? null,
  }));
}

/** Get a single agency by ID. */
export async function getAgencyById(userId: string, id: string): Promise<Agency> {
  await delay(400 + Math.random() * 200);
  const agencies = await getAgencies(userId);
  const agency = agencies.find(a => a.id === id);
  if (!agency) throw new ApiError('AGENCY_NOT_FOUND', 'Agency not found.');
  return agency;
}

/** Get contribution history for a specific agency. */
export async function getContributions(userId: string, agencyId: string): Promise<Contribution[]> {
  await delay(600 + Math.random() * 400);
  maybeThrow(0.05);
  // Actually, contributions should be tied to the user as well.
  // For demo purposes, we will just use `contributions:${userId}:${agencyId}` or default
  const contributions = db.get<Record<string, Contribution[]>>(`contributions:${userId}`) ?? {};
  
  if (!contributions[agencyId]) {
    // Generate dummy data if linked
    const agency = await getAgencyById(userId, agencyId);
    if (agency.linked) {
      contributions[agencyId] = [
        { period: '2023-10', amount: 1500, status: 'posted', employerShare: 1500, total: 3000 },
        { period: '2023-11', amount: 1500, status: 'posted', employerShare: 1500, total: 3000 },
        { period: '2023-12', amount: 1500, status: 'pending', employerShare: 1500, total: 3000 },
      ];
      db.set(`contributions:${userId}`, contributions);
    }
  }

  return contributions[agencyId] ?? [];
}

/** Link a user's account to an agency. */
export async function linkAgencyAccount(
  userId: string,
  agencyId: string,
  memberNumber: string
): Promise<{ success: boolean }> {
  await delay(1200 + Math.random() * 600);
  maybeThrow(0.04);

  if (!memberNumber || memberNumber.trim().length < 6) {
    throw new ApiError('INVALID_MEMBER_NUMBER', 'Please enter a valid member number.');
  }

  const baseAgencies = db.get<Agency[]>('agencies') ?? [];
  if (!baseAgencies.find(a => a.id === agencyId)) {
    throw new ApiError('AGENCY_NOT_FOUND');
  }

  const links = db.get<Record<string, { memberNumber: string }>>(`agencyLinks:${userId}`) ?? {};
  links[agencyId] = { memberNumber: memberNumber.trim() };
  db.set(`agencyLinks:${userId}`, links);

  return { success: true };
}

/** Unlink an agency (for reset purposes). */
export async function unlinkAgencyAccount(userId: string, agencyId: string): Promise<void> {
  await delay(600 + Math.random() * 300);

  const links = db.get<Record<string, { memberNumber: string }>>(`agencyLinks:${userId}`) ?? {};
  if (links[agencyId]) {
    delete links[agencyId];
    db.set(`agencyLinks:${userId}`, links);
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
