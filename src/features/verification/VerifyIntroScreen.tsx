/**
 * VerifyIntroScreen — Tier 1 Flow A, Step 1
 * Explains what verification requires. Links to the first step.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, IdCard, Camera, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../state/AuthContext';

const steps = [
  { icon: IdCard, title: 'Personal Information', description: 'Enter your details exactly as they appear on your National ID.' },
  { icon: IdCard, title: 'PhilSys Card Number', description: 'Provide or scan the 12-digit number on your National ID card.' },
  { icon: Camera, title: 'Liveness Check', description: 'A brief face verification to confirm your identity.' },
  { icon: Clock, title: 'Pending Verification', description: 'Your information is checked against PhilSys records.' },
];

export function VerifyIntroScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.verificationStatus === 'verified') {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="Account Verification" showBack />
        <ScreenContainer>
          <div className="flex flex-col items-center gap-6 pt-12 text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
              <ShieldCheck size={40} className="text-success" />
            </div>
            <h1 className="text-h1 font-bold text-text-primary">Already Verified</h1>
            <p className="text-body text-text-secondary">Your account has been fully verified. You have access to all eGovPH services.</p>
            <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/home')}>Go to Dashboard</Button>
          </div>
        </ScreenContainer>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Verify Account" showBack />

      <ScreenContainer>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="flex flex-col gap-6 pt-6">

          {/* Hero */}
          <div className="bg-primary rounded-lg p-5 flex items-start gap-4">
            <ShieldCheck size={36} className="text-white shrink-0 mt-0.5" />
            <div>
              <h1 className="text-h2 font-bold text-white">Unlock Full Access</h1>
              <p className="text-white/80 text-body-sm mt-1">
                Verify your identity to access your Digital ID wallet, government agency portals, and all eGovPH services.
              </p>
            </div>
          </div>

          {/* What you'll need */}
          <div className="flex flex-col gap-2">
            <h2 className="text-h2 font-semibold text-text-primary">What you'll need</h2>
            <div className="flex flex-col gap-2">
              {[
                '📋 Your personal information (full legal name, date of birth, sex, address)',
                '🪪 Your PhilSys Card Number (the 12-digit number on your National ID)',
                '📱 Good lighting for the liveness check',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg border border-border p-3">
                  <span className="text-base">{item.split(' ')[0]}</span>
                  <p className="text-body-sm text-text-primary">{item.slice(item.indexOf(' ') + 1)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-2">
            <h2 className="text-h2 font-semibold text-text-primary">Verification steps</h2>
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-body font-semibold text-text-primary">{step.title}</p>
                  <p className="text-body-sm text-text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary-light rounded-lg p-4">
            <p className="text-body-sm text-primary font-medium">
              🔒 Your information is encrypted and used only to verify your identity against PhilSys records. It is never shared with third parties.
            </p>
          </div>

          <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/verify/personal-info')}>
            Start Verification
          </Button>
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
