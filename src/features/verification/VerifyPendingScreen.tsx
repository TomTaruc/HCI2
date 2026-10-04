/**
 * VerifyPendingScreen — Tier 1 Flow A, Step 5
 *
 * Shows verification pending status. Auto-resolves after 9 seconds
 * (or immediately if Instant-Verify research toggle is on).
 *
 * Guard: only accessible when the user's verificationStatus is 'pending'.
 * Direct navigation to this URL does not grant verified status.
 * Approval requires an owned pending verificationRequest record.
 */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';
import { approveVerification, getVerificationStatus } from '../../mock/services/verificationService';
import { useAuth } from '../../state/AuthContext';
import { db } from '../../mock/db';

const PENDING_DURATION_MS = 9000; // 9 seconds default

export function VerifyPendingScreen() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [elapsed, setElapsed] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState('');

  // Prevent double navigation and double approval
  const hasFired = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const approveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const instantVerify = db.get<boolean>('instantVerify') ?? false;
  const duration = instantVerify ? 500 : PENDING_DURATION_MS;

  // Guard: if user is already verified (e.g., direct navigation), redirect to success
  useEffect(() => {
    if (user?.verificationStatus === 'verified') {
      navigate('/verify/success', { replace: true });
      return;
    }
    // Guard: if user is unverified (skipped submission), redirect to start
    if (user?.verificationStatus === 'unverified') {
      navigate('/verify', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const cleanup = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (approveTimerRef.current) clearTimeout(approveTimerRef.current);
      if (counterRef.current) clearInterval(counterRef.current);
    };

    const handleApproved = () => {
      if (hasFired.current) return;
      hasFired.current = true;
      cleanup();
      refreshUser();
      setIsApproved(true);
      setTimeout(() => navigate('/verify/success'), 800);
    };

    // Poll verification status every 2 seconds
    pollRef.current = setInterval(async () => {
      if (hasFired.current) return;
      try {
        const status = await getVerificationStatus(user.id);
        if (status === 'verified') handleApproved();
      } catch {
        // Poll errors are non-fatal — continue polling
      }
    }, 2000);

    // Auto-approve after duration (requires owned pending request)
    approveTimerRef.current = setTimeout(async () => {
      if (hasFired.current) return;
      try {
        await approveVerification(user.id);
        // Refresh and check — approval may have no-op'd if no pending request
        const status = await getVerificationStatus(user.id);
        if (status === 'verified') {
          handleApproved();
        } else {
          setError('Verification could not be completed. Please try submitting again.');
          hasFired.current = true;
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
        hasFired.current = true;
      }
    }, duration);

    // Progress counter
    counterRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    return cleanup;
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = Math.min((elapsed * 1000) / duration, 1);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-surface px-6 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 text-center max-w-xs"
      >
        {/* Animated icon */}
        <div className="relative">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isApproved ? 'bg-success/10' : 'bg-primary-light'}`}>
            {isApproved ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                <CheckCircle size={48} className="text-success" />
              </motion.div>
            ) : (
              <Clock size={48} className="text-primary animate-pulse" />
            )}
          </div>
          {/* Circular progress ring */}
          {!isApproved && !error && (
            <svg className="absolute inset-0 w-24 h-24 -rotate-90" viewBox="0 0 96 96" aria-hidden="true">
              <circle cx="48" cy="48" r="44" fill="none" stroke="var(--color-border)" strokeWidth="4" />
              <circle
                cx="48" cy="48" r="44" fill="none"
                stroke="var(--color-primary)" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
                className="transition-all duration-1000"
              />
            </svg>
          )}
        </div>

        <div>
          <div className="badge-verified mb-3">
            {isApproved ? 'Approved' : 'In Progress'}
          </div>
          <h1 className="text-h1 font-bold text-text-primary">
            {isApproved ? 'Identity Verified!' : error ? 'Verification Issue' : 'Verifying your identity...'}
          </h1>
          <p className="text-body text-text-secondary mt-2">
            {isApproved
              ? 'Your account has been fully verified. Redirecting to the success page...'
              : error
              ? error
              : 'We are checking your information against PhilSys records. This usually takes a few seconds.'}
          </p>
        </div>

        {!isApproved && !error && (
          <div className="flex flex-col gap-3 w-full">
            <div className="bg-bg rounded-lg p-4 text-left">
              <p className="text-body-sm font-semibold text-text-primary">What happens next:</p>
              <ul className="mt-2 flex flex-col gap-1 text-body-sm text-text-secondary list-none">
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-success shrink-0" aria-hidden="true" />
                  Your face was verified
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-success shrink-0" aria-hidden="true" />
                  Your PCN was submitted
                </li>
                <li className="flex items-center gap-2 text-primary font-medium">
                  <Clock size={12} className="shrink-0 animate-spin" aria-hidden="true" />
                  Checking PhilSys records...
                </li>
                <li className="flex items-center gap-2 text-text-secondary/50">
                  <span className="w-3 h-3 rounded-full border border-current shrink-0" aria-hidden="true" />
                  Approval notification
                </li>
              </ul>
            </div>
            {instantVerify && (
              <div className="bg-accent/20 border border-accent rounded-lg px-3 py-2">
                <p className="text-body-sm font-semibold text-text-primary">Research: Instant-Verify is ON</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <button
            onClick={() => navigate('/verify', { replace: true })}
            className="h-12 px-6 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors"
          >
            Start Over
          </button>
        )}
      </motion.div>
    </div>
  );
}
