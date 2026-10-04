/**
 * VerifyPCNScreen — Tier 1 Flow A, Step 3
 *
 * 16-digit PhilSys Card Number (PCN) entry in XXXX-XXXX-XXXX-XXXX format.
 * The public PCN is 16 digits. The private PSN (12 digits) is never requested.
 *
 * Validates against the mock PhilSys record for the current user's account.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import {
  validatePersonalInfo,
  getDemoPCN,
  formatPCNInput,
} from '../../mock/services/verificationService';
import { useAuth } from '../../state/AuthContext';

export function VerifyPCNScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pcn, setPcn] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [error, setError] = useState('');

  const personalData = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('verify_personal') ?? '{}');
    } catch {
      return {};
    }
  })();

  // Guard: redirect to start of flow if personal info is missing
  useEffect(() => {
    if (!sessionStorage.getItem('verify_personal')) {
      navigate('/verify/personal-info', { replace: true });
    }
  }, [navigate]);

  const handlePCNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPCNInput(e.target.value);
    setPcn(formatted);
    setError('');
  };

  const handleLoadSample = () => {
    if (!user) return;
    setIsScanLoading(true);
    setError('');
    // Simulate a brief loading state for the "load sample" action
    setTimeout(() => {
      const demoPCN = getDemoPCN(user.id);
      if (demoPCN) {
        setPcn(demoPCN);
      } else {
        setError('No sample PCN is available for this account. Enter your PCN manually.');
      }
      setIsScanLoading(false);
    }, 1000);
  };

  const handleContinue = async () => {
    const digits = pcn.replace(/\D/g, '');
    if (digits.length !== 16) {
      setError('Enter the complete 16-digit PhilSys Card Number (XXXX-XXXX-XXXX-XXXX).');
      return;
    }
    setIsValidating(true);
    setError('');
    try {
      await validatePersonalInfo(user!.id, pcn, {
        fullName: personalData.fullName,
        dateOfBirth: personalData.dateOfBirth,
        sex: personalData.sex,
        nationality: personalData.nationality,
      });
      sessionStorage.setItem('verify_pcn', pcn);
      navigate('/verify/liveness');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('This does not match our records. Check your details and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const digits = pcn.replace(/\D/g, '');
  const isComplete = digits.length === 16;

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Verify Account" showBack />
      <ScreenContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-5 pt-4"
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 flex-1">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= 2 ? 'bg-primary' : 'bg-border'}`} />
              ))}
            </div>
            <span className="text-body-sm text-text-secondary shrink-0">Step 2 of 4</span>
          </div>

          <div>
            <h1 className="text-h1 font-bold text-text-primary">PhilSys Card Number</h1>
            <p className="text-body text-text-secondary mt-1">
              Enter the 16-digit number on the front of your National ID card, formatted as XXXX-XXXX-XXXX-XXXX.
            </p>
          </div>

          {/* PCN illustration */}
          <div className="bg-primary rounded-lg p-4 relative overflow-hidden">
            <div className="text-white/50 text-xs uppercase tracking-widest mb-2">
              National ID, PhilSys Card Number (PCN)
            </div>
            <div className="font-mono text-h2 font-bold text-white tracking-widest">
              {pcn || '____-____-____-____'}
            </div>
            <div className="text-white/40 text-xs mt-2">
              16-digit public PCN (4 groups of 4 digits)
            </div>
            <div className="sample-watermark text-[20px]" aria-hidden="true">SAMPLE</div>
          </div>

          {/* Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pcn-input" className="text-label text-text-secondary uppercase tracking-wider">
              PhilSys Card Number (PCN)
            </label>
            <input
              id="pcn-input"
              type="text"
              inputMode="numeric"
              value={pcn}
              onChange={handlePCNChange}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              maxLength={19}
              aria-invalid={!!error}
              aria-describedby={error ? 'pcn-error' : 'pcn-hint'}
              className={[
                'w-full h-12 px-4 bg-surface border rounded-md',
                'font-mono text-body text-text-primary tracking-widest',
                'outline-none transition-colors',
                'focus:border-primary focus:ring-2 focus:ring-primary/20',
                error ? 'border-error' : 'border-border',
              ].join(' ')}
            />
            <p id="pcn-hint" className="text-xs text-text-secondary">
              The 16-digit public PCN appears on the front of your PhilSys National ID card. Do not enter the private 12-digit PSN on the back.
            </p>
            {error && (
              <p id="pcn-error" className="text-body-sm text-error flex items-start gap-1" role="alert">
                <span aria-hidden="true">
                  <Info size={14} className="shrink-0 mt-0.5" />
                </span>
                {error}
              </p>
            )}
          </div>

          {/* Load sample button (separate from actual scanning) */}
          <AnimatePresence>
            {isScanLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-6 bg-bg rounded-lg border border-border"
              >
                <div className="relative w-16 h-16">
                  <ScanLine size={40} className="text-primary animate-pulse" />
                  <div className="absolute inset-0 border-2 border-primary/30 rounded-md animate-ping" />
                </div>
                <p className="text-body-sm text-text-secondary font-medium">Loading sample details...</p>
              </motion.div>
            ) : (
              <button
                onClick={handleLoadSample}
                className="flex items-center gap-3 border border-dashed border-primary rounded-lg p-4 text-primary hover:bg-primary-light transition-colors w-full"
                aria-label="Load sample PCN for this demo account"
              >
                <ScanLine size={24} aria-hidden="true" />
                <div className="text-left">
                  <p className="text-body font-semibold">Load sample details</p>
                  <p className="text-body-sm text-text-secondary">
                    Auto-fill the PCN assigned to your demo account.
                  </p>
                </div>
              </button>
            )}
          </AnimatePresence>

          {/* Demo hint */}
          <div className="bg-accent/10 border border-accent/40 rounded-lg px-4 py-3">
            <p className="text-body-sm text-text-primary font-semibold mb-1 flex items-center gap-1.5">
              <Info size={14} className="text-primary" aria-hidden="true" />
              Demo: PCN for your account
            </p>
            {user?.id === 'user-unverified-01' && (
              <p className="text-body-sm text-text-primary">
                Juan Santos dela Cruz: <code className="font-mono bg-white/60 px-1 rounded">0000-0000-0000-0001</code>
              </p>
            )}
            {user?.id === 'user-verified-01' && (
              <p className="text-body-sm text-text-primary">
                Maria Lourdes Reyes Santos: <code className="font-mono bg-white/60 px-1 rounded">1234-5678-9012-3456</code>
              </p>
            )}
            {user && !['user-unverified-01', 'user-verified-01'].includes(user.id) && (
              <p className="text-body-sm text-text-secondary">
                No sample PCN is pre-configured for newly registered accounts. This screen demonstrates the verification flow.
              </p>
            )}
            <p className="text-body-sm text-text-secondary mt-1">
              Or tap "Load sample details" to auto-fill.
            </p>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-success text-body-sm font-medium"
              role="status"
            >
              <CheckCircle size={16} aria-hidden="true" />
              16-digit PCN entered
            </motion.div>
          )}

          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isValidating}
            onClick={handleContinue}
            disabled={!isComplete || isScanLoading}
          >
            {isValidating ? 'Validating...' : 'Continue'}
          </Button>
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
