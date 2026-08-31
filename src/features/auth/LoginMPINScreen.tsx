/**
 * LoginMPINScreen — Returning user login
 * Mobile number + MPIN numpad. Biometric mock button.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import { MPINInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../state/AuthContext';

export function LoginMPINScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mobileNumber, setMobileNumber] = useState('');
  const [mpin, setMpin] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'mobile' | 'mpin'>('mobile');

  const handleMobileSubmit = () => {
    if (!mobileNumber.match(/^09\d{9}$/)) {
      setMobileError('Enter a valid 10-digit Philippine mobile number.');
      return;
    }
    setMobileError('');
    setStep('mpin');
  };

  const handleLogin = async () => {
    if (mpin.length < 6) { setMpinError('Please enter all 6 digits.'); return; }
    setIsLoading(true);
    setMpinError('');
    try {
      await login(mobileNumber, mpin);
      navigate('/home', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) setMpinError(err.message);
      else setMpinError('Login failed. Please try again.');
      setMpin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMpinChange = (value: string) => {
    setMpin(value);
    setMpinError('');
    if (value.length === 6) {
      // Auto-submit when complete
      setTimeout(() => {
        setIsLoading(true);
        login(mobileNumber, value)
          .then(() => navigate('/home', { replace: true }))
          .catch((err: unknown) => {
            setMpinError(err instanceof Error ? err.message : 'Login failed.');
            setMpin('');
          })
          .finally(() => setIsLoading(false));
      }, 100);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Top gradient header */}
      <div className="bg-primary px-6 pt-12 pb-10 flex flex-col gap-3">
        <svg width="44" height="44" viewBox="0 0 30 30" fill="none" aria-hidden="true">
          <circle cx="15" cy="15" r="14" fill="rgba(255,255,255,0.15)" />
          <circle cx="15" cy="15" r="7" fill="#FCD116" />
          <circle cx="15" cy="15" r="4" fill="#0038A8" />
        </svg>
        <h1 className="text-h1 font-bold text-white">Welcome back</h1>
        <p className="text-white/70 text-body">
          {step === 'mobile' ? 'Enter your registered mobile number.' : `Enter your 6-digit MPIN for ${mobileNumber}`}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col gap-6 px-6 pt-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {step === 'mobile' ? (
            <div className="flex flex-col gap-4">
              {/* Demo hint */}
              <div className="bg-accent/20 border border-accent rounded-lg px-4 py-3">
                <p className="text-body-sm text-text-primary font-semibold">
                  🔬 Seeded accounts:
                </p>
                <p className="text-body-sm text-text-secondary">
                  <strong>Unverified:</strong> 09171234567 · MPIN: 111111
                </p>
                <p className="text-body-sm text-text-secondary">
                  <strong>Verified:</strong> 09189876543 · MPIN: 111111
                </p>
              </div>

              <Input
                label="Mobile Number"
                type="tel"
                placeholder="09XXXXXXXXX"
                value={mobileNumber}
                onChange={e => { setMobileNumber(e.target.value); setMobileError(''); }}
                error={mobileError}
                leftIcon={<span className="text-text-secondary text-body-sm font-semibold">+63</span>}
                maxLength={11}
                autoFocus
              />
              <Button variant="primary" fullWidth size="lg" onClick={handleMobileSubmit}>
                Continue
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <MPINInput value={mpin} onChange={handleMpinChange} error={mpinError} />

              {isLoading && (
                <p className="text-center text-body-sm text-text-secondary">Verifying…</p>
              )}

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleLogin}
                isLoading={isLoading}
                disabled={mpin.length < 6}
              >
                Log In
              </Button>

              {/* Biometric mock */}
              <button
                className="flex flex-col items-center gap-2 py-4 text-text-secondary hover:text-primary transition-colors"
                onClick={() => {
                  // Simulate biometric success
                  login(mobileNumber, '111111')
                    .then(() => navigate('/home', { replace: true }))
                    .catch(() => setMpinError('Biometric login not available. Use MPIN.'));
                }}
                aria-label="Use biometric login (simulated)"
              >
                <Fingerprint size={36} strokeWidth={1.5} />
                <span className="text-body-sm font-medium">Use Biometric</span>
              </button>

              {/* Forgot MPIN */}
              <div className="flex justify-between text-body-sm">
                <button
                  onClick={() => { setStep('mobile'); setMpin(''); }}
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  ← Change number
                </button>
                <button
                  onClick={() => navigate('/forgot-mpin', { state: { mobileNumber } })}
                  className="text-primary font-semibold hover:underline"
                >
                  Forgot MPIN?
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-auto pb-8">
          <p className="text-center text-body-sm text-text-secondary">
            New to eGovPH?{' '}
            <button
              onClick={() => navigate('/register/mobile')}
              className="text-primary font-semibold hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
