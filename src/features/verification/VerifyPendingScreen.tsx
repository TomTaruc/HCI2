/**
 * VerifyPendingScreen — Tier 1 Flow A, Step 5
 * Shows verification pending status. Auto-resolves after 8–10 seconds
 * (or immediately if Instant-Verify research toggle is on).
 */
import React, { useEffect, useState } from 'react';
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

  const instantVerify = db.get<boolean>('instantVerify') ?? false;
  const duration = instantVerify ? 500 : PENDING_DURATION_MS;

  useEffect(() => {
    // Poll verification status every 2 seconds
    const poll = setInterval(async () => {
      if (!user) return;
      const status = await getVerificationStatus(user.id);
      if (status === 'verified') {
        clearInterval(poll);
        setIsApproved(true);
        setTimeout(() => navigate('/verify/success'), 800);
      }
    }, 2000);

    // Auto-approve after duration
    const approve = setTimeout(async () => {
      if (!user) return;
      await approveVerification(user.id);
      refreshUser();
      clearInterval(poll);
      setIsApproved(true);
      setTimeout(() => navigate('/verify/success'), 800);
    }, duration);

    // Progress counter
    const counter = setInterval(() => setElapsed(e => e + 1), 1000);

    return () => {
      clearInterval(poll);
      clearTimeout(approve);
      clearInterval(counter);
    };
  }, []);

  const progress = Math.min((elapsed * 1000) / duration, 1);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 gap-8">
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
          {!isApproved && (
            <svg className="absolute inset-0 w-24 h-24 -rotate-90" viewBox="0 0 96 96" aria-hidden="true">
              <circle cx="48" cy="48" r="44" fill="none" stroke="#E4E8F0" strokeWidth="4" />
              <circle
                cx="48" cy="48" r="44" fill="none"
                stroke="#0038A8" strokeWidth="4"
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
            {isApproved ? '✓ Approved' : 'In Progress'}
          </div>
          <h1 className="text-h1 font-bold text-text-primary">
            {isApproved ? 'Identity Verified!' : 'Verifying your identity…'}
          </h1>
          <p className="text-body text-text-secondary mt-2">
            {isApproved
              ? 'Your account has been fully verified. Redirecting you to the success page…'
              : 'We are checking your information against PhilSys records. This usually takes a few seconds.'}
          </p>
        </div>

        {!isApproved && (
          <div className="flex flex-col gap-3 w-full">
            <div className="bg-bg rounded-lg p-4 text-left">
              <p className="text-body-sm font-semibold text-text-primary">What happens next:</p>
              <ul className="mt-2 flex flex-col gap-1 text-body-sm text-text-secondary">
                <li>✓ Your face was verified</li>
                <li>✓ Your PCN was submitted</li>
                <li className="text-primary font-medium">⟳ Checking PhilSys records…</li>
                <li className="text-text-secondary/50">○ Approval notification</li>
              </ul>
            </div>
            {instantVerify && (
              <div className="bg-accent/20 border border-accent rounded-lg px-3 py-2">
                <p className="text-body-sm font-semibold text-text-primary">🔬 Instant-Verify is ON</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
