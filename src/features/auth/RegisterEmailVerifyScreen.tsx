/**
 * RegisterEmailVerifyScreen — Step 5
 * Email verification pending. Mock: auto-advances on button tap.
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';

export function RegisterEmailVerifyScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email: string })?.email ?? 'your email';
  const [resendSent, setResendSent] = useState(false); // L-01: State for resend button

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Create Account" showBack={false} />
      <ScreenContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center gap-6 pt-12 text-center"
        >
          <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
            <Mail size={44} className="text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-h1 font-bold text-text-primary">Check your email</h1>
            <p className="text-body text-text-secondary max-w-xs">
              We sent a verification link to <strong className="text-text-primary">{email}</strong>.
              Click the link to verify your account.
            </p>
          </div>

          <div className="bg-primary-light rounded-lg px-4 py-3 w-full text-left">
            <p className="text-body-sm text-primary font-medium">
              📧 Demo mode: Tap the button below to simulate email verification.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Button
              variant="primary"
              fullWidth
              size="lg"
              leftIcon={<CheckCircle size={18} />}
              onClick={() => navigate('/home', { replace: true })}
            >
              I've verified my email
            </Button>
            <Button
              variant="ghost"
              fullWidth
              size="md"
              onClick={() => { setResendSent(true); setTimeout(() => setResendSent(false), 3000); }}
              disabled={resendSent}
            >
              {resendSent ? 'Verification link resent!' : 'Resend verification link'}
            </Button>
          </div>

          <p className="text-body-sm text-text-secondary">
            Your account has been created. Some features require account verification — you can complete this later from your Profile.
          </p>
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
