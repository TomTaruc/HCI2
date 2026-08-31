/**
 * ForgotMPINScreen — OTP verification → liveness mock → reset MPIN
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OTPInput, MPINInput } from '../../components/ui/Input';
import { requestOTP, verifyOTP, updateMPIN } from '../../mock/services/authService';
import { db } from '../../mock/db';
import type { User } from '../../mock/services/authService';

type Stage = 'mobile' | 'otp' | 'liveness' | 'reset' | 'done';

export function ForgotMPINScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillMobile = (location.state as { mobileNumber: string })?.mobileNumber ?? '';

  const [stage, setStage] = useState<Stage>(prefillMobile ? 'otp' : 'mobile');
  const [mobileNumber, setMobileNumber] = useState(prefillMobile);
  const [otp, setOtp] = useState('');
  const [newMpin, setNewMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [mpinStage, setMpinStage] = useState<'new' | 'confirm'>('new');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [livenessStep, setLivenessStep] = useState(0);
  const livenessPrompts = ['Hold still…', 'Blink now…', 'Turn slightly right…', 'Verifying…'];

  const handleSendOTP = async () => {
    if (!mobileNumber.match(/^09\d{9}$/)) { setError('Enter a valid mobile number.'); return; }
    setIsLoading(true);
    try {
      await requestOTP(mobileNumber);
      setStage('otp');
      setError('');
    } catch { setError('Could not send OTP. Try again.'); }
    finally { setIsLoading(false); }
  };

  const handleVerifyOTP = async (value?: string) => {
    const code = value ?? otp;
    if (code.length !== 6) { setError('Enter all 6 digits.'); return; }
    setIsLoading(true);
    try {
      const { valid } = await verifyOTP(mobileNumber, code);
      if (!valid) { setError('Incorrect OTP.'); setIsLoading(false); return; }
      setStage('liveness');
      setError('');
      // Auto-advance liveness prompts
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setLivenessStep(step);
        if (step >= livenessPrompts.length - 1) {
          clearInterval(interval);
          setTimeout(() => setStage('reset'), 1000);
        }
      }, 1200);
    } catch { setError('Verification failed.'); }
    finally { setIsLoading(false); }
  };

  const handleResetMpin = async () => {
    if (mpinStage === 'new') {
      if (newMpin.length < 6) { setError('Enter all 6 digits.'); return; }
      setMpinStage('confirm'); setError('');
    } else {
      if (confirmMpin !== newMpin) { setError('MPINs do not match.'); setConfirmMpin(''); return; }
      setIsLoading(true);
      try {
        const users = db.get<User[]>('users') ?? [];
        const user = users.find(u => u.mobileNumber === mobileNumber);
        if (user) await updateMPIN(user.id, newMpin);
        setStage('done');
      } catch { setError('Failed to update MPIN. Try again.'); }
      finally { setIsLoading(false); }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Forgot MPIN" showBack />
      <ScreenContainer>
        <motion.div key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="flex flex-col gap-6 pt-6">

          {stage === 'mobile' && (
            <>
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
                <KeyRound size={24} className="text-primary" />
              </div>
              <h1 className="text-h1 font-bold text-text-primary">Reset your MPIN</h1>
              <p className="text-body text-text-secondary">Enter your registered mobile number to begin.</p>
              <Input label="Mobile Number" type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} error={error} placeholder="09XXXXXXXXX" maxLength={11} />
              <Button variant="primary" fullWidth size="lg" isLoading={isLoading} onClick={handleSendOTP}>Send OTP</Button>
            </>
          )}

          {stage === 'otp' && (
            <>
              <h1 className="text-h1 font-bold text-text-primary">Enter OTP</h1>
              <p className="text-body text-text-secondary">We sent a code to <strong>{mobileNumber}</strong>.</p>
              <div className="bg-accent/20 border border-accent rounded-lg px-4 py-3">
                <p className="text-body-sm font-semibold">🔬 Demo OTP: 123456</p>
              </div>
              <OTPInput value={otp} onChange={v => { setOtp(v); if (v.length === 6) handleVerifyOTP(v); }} error={error} autoFocus />
              <Button variant="primary" fullWidth size="lg" isLoading={isLoading} onClick={() => handleVerifyOTP()} disabled={otp.length !== 6}>Verify</Button>
            </>
          )}

          {stage === 'liveness' && (
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <div className="w-40 h-40 rounded-full border-4 border-primary bg-primary-light flex items-center justify-center relative overflow-hidden">
                <span className="text-6xl">👤</span>
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
              </div>
              <div>
                <h2 className="text-h2 font-bold text-text-primary">{livenessPrompts[livenessStep]}</h2>
                <p className="text-body-sm text-text-secondary mt-1">Identity check in progress…</p>
              </div>
              <div className="flex gap-2">
                {livenessPrompts.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i <= livenessStep ? 'bg-primary' : 'bg-border'}`} />
                ))}
              </div>
            </div>
          )}

          {stage === 'reset' && (
            <>
              <h1 className="text-h1 font-bold text-text-primary">
                {mpinStage === 'new' ? 'New MPIN' : 'Confirm MPIN'}
              </h1>
              <MPINInput value={mpinStage === 'new' ? newMpin : confirmMpin} onChange={mpinStage === 'new' ? setNewMpin : setConfirmMpin} error={error} />
              <Button variant="primary" fullWidth size="lg" isLoading={isLoading}
                onClick={handleResetMpin} disabled={(mpinStage === 'new' ? newMpin : confirmMpin).length < 6}>
                {mpinStage === 'new' ? 'Continue' : 'Confirm New MPIN'}
              </Button>
            </>
          )}

          {stage === 'done' && (
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">✓</span>
              </div>
              <h1 className="text-h1 font-bold text-text-primary">MPIN updated</h1>
              <p className="text-body text-text-secondary">Your new MPIN has been set. You can now log in.</p>
              <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/login', { replace: true })}>Back to Log In</Button>
            </div>
          )}
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
