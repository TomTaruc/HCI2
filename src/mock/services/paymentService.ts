/**
 * Mock Payment Service — eGovPH HCI Prototype
 */

import { db, delay } from '../db';

export interface PendingPayment {
  id: string; // The transaction ID from the source service (e.g., ET-..., EGOV-...)
  userId: string;
  sourceService: 'eTravel' | 'appointments';
  amount: number;
  description: string;
  returnTo: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
}

export function createPendingPayment(payment: Omit<PendingPayment, 'status' | 'createdAt'>): void {
  const pending = db.get<PendingPayment[]>('pendingPayments') ?? [];
  db.set('pendingPayments', [...pending, { ...payment, status: 'pending', createdAt: new Date().toISOString() }]);
}

export function getPendingPayment(userId: string, id: string): PendingPayment | null {
  const pending = db.get<PendingPayment[]>('pendingPayments') ?? [];
  return pending.find(p => p.userId === userId && p.id === id) || null;
}

export async function processPayment(userId: string, paymentId: string, method: string): Promise<string> {
  await delay(1500);
  
  const pending = db.get<PendingPayment[]>('pendingPayments') ?? [];
  const idx = pending.findIndex(p => p.id === paymentId && p.userId === userId);
  
  if (idx === -1 || pending[idx].status !== 'pending') {
    throw new Error('Payment not found or already processed.');
  }

  // Generate eGovPay reference
  const eGovRef = 'PAY-' + paymentId + '-' + Date.now().toString(36).substring(0, 4).toUpperCase();

  // Mark pending as paid
  pending[idx].status = 'paid';
  db.set('pendingPayments', pending);

  // Add to eGovPay records
  const payments = db.get<unknown[]>('eGovPayPayments') ?? [];
  const newPayment = {
    id: eGovRef,
    sourceTransactionId: paymentId,
    userId,
    label: pending[idx].description,
    agency: pending[idx].sourceService === 'eTravel' ? 'Bureau of Immigration' : 'NBI/Police',
    amount: pending[idx].amount,
    method,
    date: new Date().toISOString()
  };
  db.set('eGovPayPayments', [...payments, newPayment]);

  // Update source service
  if (pending[idx].sourceService === 'eTravel') {
    const records = db.get<any[]>('etravelDeclarations') ?? [];
    const rIdx = records.findIndex(r => r.id === paymentId);
    if (rIdx !== -1) {
      records[rIdx].paymentStatus = 'paid';
      records[rIdx].paymentRef = eGovRef;
      db.set('etravelDeclarations', records);
    }
  } else if (pending[idx].sourceService === 'appointments') {
    const records = db.get<any[]>('appointments') ?? [];
    const rIdx = records.findIndex(r => r.id === paymentId);
    if (rIdx !== -1) {
      records[rIdx].paymentStatus = 'paid';
      records[rIdx].paymentRef = eGovRef;
      db.set('appointments', records);
    }
  }

  return eGovRef;
}

export function cancelPendingPayment(userId: string, paymentId: string): void {
  const pending = db.get<PendingPayment[]>('pendingPayments') ?? [];
  const idx = pending.findIndex(p => p.id === paymentId && p.userId === userId);
  if (idx !== -1 && pending[idx].status === 'pending') {
    pending[idx].status = 'cancelled';
    db.set('pendingPayments', pending);
    
    // Also cancel in source service
    if (pending[idx].sourceService === 'eTravel') {
      const records = db.get<any[]>('etravelDeclarations') ?? [];
      const rIdx = records.findIndex(r => r.id === paymentId);
      if (rIdx !== -1) {
        records.splice(rIdx, 1);
        db.set('etravelDeclarations', records);
      }
    } else if (pending[idx].sourceService === 'appointments') {
      const records = db.get<any[]>('appointments') ?? [];
      const rIdx = records.findIndex(r => r.id === paymentId);
      if (rIdx !== -1) {
        records.splice(rIdx, 1);
        db.set('appointments', records);
      }
    }
  }
}
