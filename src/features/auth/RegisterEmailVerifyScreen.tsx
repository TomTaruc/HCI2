/**
 * RegisterEmailVerifyScreen — Step 5
 * Email verification pending. Integrates the real local challenge and proof flow.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { useAuth } from '../../state/AuthContext';
import { db } from '../../mock/db';
import { requestEmailOTP, verifyOTP, verifyAccountEmail, type User } from '../../mock/services/authService';
import { Button } from '../../components/ui/Button';
import { OTPInput } from '../../components/ui/Input';

export function RegisterEmailVerifyScreen() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const email = (location.state as { email: string })?.email ?? user?.email ?? 'your email';
  const [resendSent, setResendSent] = useState(false);
  
  const [challengeId, setChallengeId] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cancel stale completion on unmount
  useEffect(() => {
    let active = true;
    if (email) {
      requestEmailOTP(email, 'registration')
        .then(res => { if (active) setChallengeId(res.challengeId); })
        .catch(err => { if (active) setError(err.message || 'Failed to send OTP'); });
    }
    return () => { active = false; };
  }, [email]);

  const handleVerify = async (value?: string) => {
    if (isLoading) return; // Prevent duplicate submissions
    const code = value ?? otp;
    if (code.length !== 6) {
      setError('Enter all 6 digits.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { valid } = await verifyOTP(challengeId, code);
      if (valid && user) {
        await verifyAccountEmail(user.id, challengeId);
        await refreshUser();
      }
      navigate('/home', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendSent(true);
    setError('');
    try {
      const res = await requestEmailOTP(email, 'registration');
      setChallengeId(res.challengeId);
      setTimeout(() => setResendSent(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend');
      setResendSent(false);
    }
  };

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
              We sent a verification code to <strong className="text-text-primary">{email}</strong>.
            </p>
          </div>

          <div className="bg-primary-light rounded-lg px-4 py-3 w-full text-left">
            <p className="text-body-sm text-primary font-medium">
              📧 Demo mode: The simulated code is <strong>123456</strong>
            </p>
          </div>

          <div className="w-full text-left">
            <OTPInput 
              value={otp} 
              onChange={(val) => {
                setOtp(val);
                if (val.length === 6) {
                  handleVerify(val);
                }
              }} 
              error={error} 
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Button
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              disabled={otp.length !== 6}
              onClick={() => handleVerify()}
            >
              Verify Email
            </Button>
            <Button
              variant="ghost"
              fullWidth
              size="md"
              onClick={handleResend}
              disabled={resendSent || isLoading}
            >
              {resendSent ? 'Code resent!' : 'Resend code'}
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              size="md"
              onClick={() => navigate('/home', { replace: true })}
            >
              Skip for now
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
