import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CheckCircle } from 'lucide-react';
import { db } from '../../mock/db';
import type { Agency } from '../../mock/services/agencyService';
import { motion } from 'framer-motion';

export function PhilHealthClaimsScreen() {
  const navigate = useNavigate();
  const agencies = db.get<Agency[]>('agencies') || [];
  const philhealth = agencies.find(a => a.id === 'philhealth');
  const isLinked = philhealth?.linked;

  const [step, setStep] = useState<'info' | 'form' | 'success'>('info');
  const [formData, setFormData] = useState({ patientName: '', hospitalName: '', dateAdmitted: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refNum, setRefNum] = useState('');

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setRefNum(`PHIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      setIsSubmitting(false);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title="Benefits & Claims" onBack={() => step === 'info' || step === 'success' ? navigate(-1) : setStep('info')} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {!isLinked ? (
          <Card padding="md" className="text-center flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-warning-light text-warning rounded-full flex items-center justify-center text-2xl">
              !
            </div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary">Account Not Linked</h2>
              <p className="text-body text-text-secondary mt-2">
                You must link your PhilHealth account to file or view claims.
              </p>
            </div>
            <Button variant="primary" onClick={() => navigate('/agencies/philhealth')}>
              Link Account Now
            </Button>
          </Card>
        ) : (
          <>
            {step === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                <h1 className="text-h1 font-bold text-text-primary">File a Claim</h1>
                <p className="text-body-sm text-text-secondary">
                  Submit a claim request for recent hospitalizations or medical procedures.
                </p>

                <Card padding="md">
                  <h2 className="text-body font-semibold text-text-primary mb-2">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-1 text-body-sm text-text-secondary">
                    <li>Duly accomplished PhilHealth Claim Form (CF1, CF2)</li>
                    <li>Statement of Account from the hospital</li>
                    <li>Medical Certificate or Operative Record</li>
                    <li>Proof of contribution (if required)</li>
                  </ul>
                </Card>

                <Button variant="primary" onClick={() => setStep('form')}>
                  Start Claim Application
                </Button>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
                <h2 className="text-h2 font-bold text-text-primary">Claim Details</h2>
                <Card className="flex flex-col gap-4">
                  <Input 
                    label="Patient Name" 
                    placeholder="Full name of patient"
                    value={formData.patientName}
                    onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                  />
                  <Input 
                    label="Hospital / Facility Name" 
                    placeholder="Name of admitted facility"
                    value={formData.hospitalName}
                    onChange={e => setFormData({ ...formData, hospitalName: e.target.value })}
                  />
                  <Input 
                    label="Date Admitted" 
                    type="date"
                    value={formData.dateAdmitted}
                    onChange={e => setFormData({ ...formData, dateAdmitted: e.target.value })}
                  />
                </Card>
                <Button 
                  variant="primary" 
                  size="lg" 
                  isLoading={isSubmitting} 
                  onClick={handleSubmit}
                  disabled={!formData.patientName || !formData.hospitalName || !formData.dateAdmitted}
                >
                  Submit Claim Request
                </Button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-6 pt-8">
                <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center">
                  <CheckCircle size={40} className="text-success" />
                </div>
                <div>
                  <h2 className="text-h2 font-bold text-text-primary">Claim Submitted!</h2>
                  <p className="text-body text-text-secondary mt-2">
                    Your claim request has been forwarded to PhilHealth for evaluation.
                  </p>
                </div>
                <Card className="w-full bg-bg border-dashed">
                  <p className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold mb-1">Claim Reference</p>
                  <p className="text-h2 font-mono font-bold text-primary tracking-widest">{refNum}</p>
                </Card>
                <Button variant="primary" fullWidth onClick={() => navigate('/home')}>
                  Back to Home
                </Button>
              </motion.div>
            )}
          </>
        )}
      </ScreenContainer>
    </div>
  );
}
