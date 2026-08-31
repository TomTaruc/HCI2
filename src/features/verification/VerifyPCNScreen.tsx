/**
 * VerifyPCNScreen — Tier 1 Flow A, Step 3
 * 12-digit PhilSys Card Number entry (4-4-4 format mask) + "Scan ID" mock.
 * Validates against the mock PhilSys record.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { validatePersonalInfo, getDemoPCN } from '../../mock/services/verificationService';
import { useAuth } from '../../state/AuthContext';

// Format PCN: auto-insert dashes at positions 4, 8 → 1234-5678-9012
function formatPCN(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 12);
  const parts = [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12)].filter(Boolean);
  return parts.join('-');
}

export function VerifyPCNScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pcn, setPcn] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const personalData = JSON.parse(sessionStorage.getItem('verify_personal') ?? '{}');

  const handlePCNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPCN(e.target.value);
    setPcn(formatted);
    setError('');
  };

  const handleScanID = () => {
    setIsScanning(true);
    setError('');
    setTimeout(() => {
      const demoPCN = getDemoPCN(user!.id);
      setPcn(demoPCN);
      setIsScanning(false);
    }, 2500);
  };

  const handleContinue = async () => {
    const digits = pcn.replace(/\D/g, '');
    if (digits.length !== 12) { setError('Enter the complete 12-digit PhilSys Card Number.'); return; }
    setIsValidating(true);
    setError('');
    try {
      await validatePersonalInfo(pcn, {
        fullName: personalData.fullName,
        dateOfBirth: personalData.dateOfBirth,
        sex: personalData.sex,
        nationality: personalData.nationality,
      });
      sessionStorage.setItem('verify_pcn', pcn);
      navigate('/verify/liveness');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("This doesn't match our records. Check your spelling and try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Verify Account" showBack />
      <ScreenContainer>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="flex flex-col gap-5 pt-4">

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
              Enter the 12-digit number on the front of your National ID card (formatted as XXXX-XXXX-XXXX).
            </p>
          </div>

          {/* PCN illustration */}
          <div className="bg-primary rounded-lg p-4 relative overflow-hidden">
            <div className="text-white/50 text-xs uppercase tracking-widest mb-2">National ID — PhilSys Card Number</div>
            <div className="font-mono text-h2 font-bold text-white tracking-widest">
              {pcn || '____-____-____'}
            </div>
            <div className="absolute right-4 top-4 text-accent opacity-60">
              <svg width="32" height="32" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                <circle cx="15" cy="15" r="10" fill="#FCD116" opacity="0.5" />
              </svg>
            </div>
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
              placeholder="XXXX-XXXX-XXXX"
              maxLength={14}
              aria-invalid={!!error}
              aria-describedby={error ? 'pcn-error' : undefined}
              className={[
                'w-full h-12 px-4 bg-white border rounded-md',
                'font-mono text-body text-text-primary tracking-widest',
                'outline-none transition-colors',
                'focus:border-primary focus:ring-2 focus:ring-primary/20',
                error ? 'border-error' : 'border-border',
              ].join(' ')}
            />
            {error && (
              <p id="pcn-error" className="text-body-sm text-error flex items-start gap-1" role="alert">
                <span aria-hidden="true">⚠</span> {error}
              </p>
            )}
          </div>

          {/* Scan mock button */}
          <AnimatePresence>
            {isScanning ? (
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
                <p className="text-body-sm text-text-secondary font-medium">Scanning ID…</p>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`w-1.5 h-1.5 bg-primary rounded-full animate-pulse`}
                      style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <button
                onClick={handleScanID}
                className="flex items-center gap-3 border border-dashed border-primary rounded-lg p-4 text-primary hover:bg-primary-light transition-colors w-full"
                aria-label="Scan ID card to auto-fill PCN"
              >
                <ScanLine size={24} />
                <div className="text-left">
                  <p className="text-body font-semibold">Scan your ID instead</p>
                  <p className="text-body-sm text-text-secondary">Auto-fill the PCN by scanning your National ID card.</p>
                </div>
              </button>
            )}
          </AnimatePresence>

          {/* Demo hint */}
          <div className="bg-accent/20 border border-accent rounded-lg px-4 py-3">
            <p className="text-body-sm text-text-primary font-semibold">🔬 Demo: Try PCN <code>1234-5678-9012</code> (for verified account profile)</p>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isValidating}
            onClick={handleContinue}
            disabled={pcn.replace(/\D/g, '').length !== 12 || isScanning}
          >
            {isValidating ? 'Validating…' : 'Continue'}
          </Button>
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
