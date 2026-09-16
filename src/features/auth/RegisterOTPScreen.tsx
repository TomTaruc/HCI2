/**
 * RegisterOTPScreen — Step 2 of registration
 * Enter 6-digit OTP. Countdown timer, resend button.
 * Demo OTP: 123456 always succeeds.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { OTPInput } from '../../components/ui/Input';
import { StepIndicator } from './RegisterMobileScreen';
import { requestOTP, verifyOTP } from '../../mock/services/authService';

const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const RESEND_COOLDOWN = 60;

export function RegisterOTPScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = (location.state as { mobileNumber: string })?.mobileNumber;

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [isResending, setIsResending] = useState(false);

  // Redirect if no mobile number in state
  useEffect(() => {
    if (!mobileNumber) navigate('/register/mobile', { replace: true });
  }, [mobileNumber, navigate]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1));
      setResendCooldown(c => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleVerify = useCallback(async (value?: string) => {
    const code = value ?? otp;
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits.');
      return;
    }
    // H-05: Block submission if OTP has expired
    if (countdown === 0) {
      setOtpError('Your OTP has expired. Please request a new one.');
      return;
    }
    setIsVerifying(true);
    setOtpError('');
    try {
      const { valid } = await verifyOTP(mobileNumber, code);
      if (!valid) {
        setOtpError('Incorrect OTP. Please check the code and try again.');
        return;
      }
      navigate('/register/mpin', { state: { mobileNumber } });
    } catch {
      setOtpError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }, [otp, mobileNumber, navigate]);

  // Auto-submit when 6 digits entered — H-05: also check countdown
  const handleOTPChange = (value: string) => {
    setOtp(value);
    setOtpError('');
    if (value.length === 6 && countdown > 0) handleVerify(value);
    else if (value.length === 6 && countdown === 0) {
      setOtpError('Your OTP has expired. Please request a new one.');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    try {
      await requestOTP(mobileNumber);
      setCountdown(OTP_EXPIRY_SECONDS);
      setResendCooldown(RESEND_COOLDOWN);
      setOtp('');
      setOtpError('');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Create Account" showBack />

      <ScreenContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-8 pt-6"
        >
          <StepIndicator current={2} total={5} />

          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
              <MessageSquare size={24} className="text-primary" />
            </div>
            <h1 className="text-h1 font-bold text-text-primary">Enter OTP</h1>
            <p className="text-body text-text-secondary">
              We sent a 6-digit one-time password to{' '}
              <strong className="text-text-primary">{mobileNumber}</strong>.
            </p>
          </div>

          {/* Demo hint */}
          <div className="bg-accent/20 border border-accent rounded-lg px-4 py-3">
            <p className="text-body-sm text-text-primary font-semibold">
              🔬 Demo mode: OTP is always <strong>123456</strong>
            </p>
          </div>

          {/* OTP Input */}
          <OTPInput
            value={otp}
            onChange={handleOTPChange}
            error={otpError}
            autoFocus
          />

          {/* Timer */}
          {countdown > 0 && (
            <p className="text-center text-body-sm text-text-secondary">
              OTP expires in{' '}
              <span className="text-primary font-semibold">{formatTime(countdown)}</span>
            </p>
          )}
          {countdown === 0 && (
            <p className="text-center text-body-sm text-error">
              Your OTP has expired. Please request a new one.
            </p>
          )}

          {/* Verify button */}
          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isVerifying}
            onClick={() => handleVerify()}
            disabled={otp.length !== 6 || countdown === 0}
          >
            Verify OTP
          </Button>

          {/* Resend */}
          <div className="text-center">
            {resendCooldown > 0 ? (
              <p className="text-body-sm text-text-secondary">
                Resend available in{' '}
                <span className="font-semibold">{resendCooldown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-primary font-semibold text-body-sm hover:underline disabled:opacity-50"
              >
                {isResending ? 'Sending…' : "Didn't receive it? Resend OTP"}
              </button>
            )}
          </div>
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
