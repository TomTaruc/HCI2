/**
 * VerifySuccessScreen — Tier 1 Flow A, Step 6
 * Checkmark animation + one-time confetti + "Continue to Dashboard" button.
 */
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../state/AuthContext';

// Simple confetti implementation — no third-party library, no real canvas
function ConfettiPiece({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      className="fixed w-2 h-3 rounded-sm pointer-events-none z-50"
      style={{ left: `${x}%`, top: '-10px', backgroundColor: color }}
      initial={{ y: -20, rotate: 0, opacity: 1 }}
      animate={{ y: '110vh', rotate: 720, opacity: 0 }}
      transition={{ duration: 3, delay, ease: 'linear' }}
    />
  );
}

const CONFETTI_COLORS = ['#0038A8', '#CE1126', '#FCD116', '#16A34A', '#FFFFFF'];

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    delay: Math.random() * 1.5,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  }));

  return (
    <div aria-hidden="true">
      {pieces.map(p => (
        <ConfettiPiece key={p.id} delay={p.delay} x={p.x} color={p.color} />
      ))}
    </div>
  );
}

export function VerifySuccessScreen() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const hasShownConfetti = useRef(false);

  useEffect(() => {
    refreshUser();
    // Clear sessionStorage verification data
    sessionStorage.removeItem('verify_personal');
    sessionStorage.removeItem('verify_pcn');
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* One-time confetti — per spec Section 7.1 */}
      {!hasShownConfetti.current && (() => { hasShownConfetti.current = true; return <Confetti />; })()}

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8 text-center">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
          className="relative"
        >
          <div className="w-28 h-28 bg-success/10 rounded-full flex items-center justify-center">
            <ShieldCheck size={60} className="text-success" />
          </div>
          {/* Gold star badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -top-1 -right-1 w-10 h-10 bg-accent rounded-full flex items-center justify-center"
          >
            <Star size={18} className="text-primary fill-primary" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          {/* Verified ribbon */}
          <div className="flex justify-center">
            <span className="badge-verified text-sm">
              ✓ Identity Verified
            </span>
          </div>
          <h1 className="text-display font-bold text-text-primary">Account Verified!</h1>
          <p className="text-body text-text-secondary max-w-xs">
            Congratulations! Your identity has been verified. You now have full access to all eGovPH services, including your Digital ID wallet and government agency portals.
          </p>
        </motion.div>

        {/* What's unlocked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full bg-bg rounded-lg p-4 text-left flex flex-col gap-3"
        >
          <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider">Now unlocked</p>
          {[
            '🪪 Digital ID wallet (ePhilID, eDL, and more)',
            '🏦 SSS, GSIS, PhilHealth, Pag-IBIG portals',
            '📋 BPESH service appointments',
            '💰 eGovPay for government fees',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-base">{item.split(' ')[0]}</span>
              <span className="text-body-sm text-text-primary">{item.slice(item.indexOf(' ') + 1)}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full"
        >
          <Button
            variant="primary"
            fullWidth
            size="lg"
            rightIcon={<ChevronRight size={18} />}
            onClick={() => navigate('/home', { replace: true })}
          >
            Continue to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
