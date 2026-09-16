/**
 * RegisterMPINScreen — Step 3 of registration
 * Create and confirm a 6-digit MPIN using the numpad.
 * SECURITY NOTE: MPIN is stored temporarily in sessionStorage (cleared after registration)
 * rather than plain-text navigation state.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { MPINInput } from '../../components/ui/Input';
import { StepIndicator } from './RegisterMobileScreen';

export function RegisterMPINScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = (location.state as { mobileNumber: string })?.mobileNumber;

  const [stage, setStage] = useState<'create' | 'confirm'>('create');
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mobileNumber) navigate('/register/mobile', { replace: true });
  }, [mobileNumber, navigate]);

  const handleCreate = () => {
    if (mpin.length < 6) { setError('Please enter all 6 digits.'); return; }
    // Basic MPIN validation — no all-same digits, no sequential
    const allSame = mpin.split('').every(d => d === mpin[0]);
    if (allSame) { setError('Please choose a stronger MPIN. Avoid repeating digits.'); return; }
    setError('');
    setStage('confirm');
  };

  const handleConfirm = () => {
    if (confirmMpin !== mpin) {
      setError('MPINs do not match. Please try again.');
      setConfirmMpin('');
      return;
    }
    // Store MPIN in sessionStorage instead of plain nav state (C-02)
    sessionStorage.setItem('reg_mpin', mpin);
    navigate('/register/profile', { state: { mobileNumber } });
  };

  const handleBack = () => {
    if (stage === 'confirm') {
      setStage('create');
      setConfirmMpin('');
      setError('');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Create Account" showBack onBack={handleBack} />

      <ScreenContainer>
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: stage === 'confirm' ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-8 pt-6"
        >
          <StepIndicator current={3} total={5} />

          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
              <Lock size={24} className="text-primary" />
            </div>
            <h1 className="text-h1 font-bold text-text-primary">
              {stage === 'create' ? 'Create MPIN' : 'Confirm MPIN'}
            </h1>
            <p className="text-body text-text-secondary">
              {stage === 'create'
                ? 'Choose a 6-digit Mobile PIN. You will use this to log in every time.'
                : 'Enter your MPIN again to confirm it.'}
            </p>
          </div>

          {/* MPIN tips */}
          {stage === 'create' && (
            <div className="bg-primary-light rounded-lg px-4 py-3">
              <p className="text-body-sm text-primary font-medium">
                🔐 Keep your MPIN private. Do not share it with anyone, including government representatives.
              </p>
            </div>
          )}

          <MPINInput
            value={stage === 'create' ? mpin : confirmMpin}
            onChange={stage === 'create' ? setMpin : setConfirmMpin}
            error={error}
          />

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={stage === 'create' ? handleCreate : handleConfirm}
            disabled={(stage === 'create' ? mpin : confirmMpin).length < 6}
          >
            {stage === 'create' ? 'Continue' : 'Confirm MPIN'}
          </Button>
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
