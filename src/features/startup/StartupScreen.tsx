import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Rocket, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function StartupScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'info' | 'form' | 'success'>('info');
  const [formData, setFormData] = useState({ startupName: '', sector: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title="Start-Up PH" onBack={() => step === 'info' || step === 'success' ? navigate(-1) : setStep('info')} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {step === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-2">
              <Rocket size={32} />
            </div>
            <div>
              <h1 className="text-h1 font-bold text-text-primary">Start-Up Registration</h1>
              <p className="text-body-sm text-text-secondary mt-1">
                Register your startup to access grants, networking, and exclusive resources through the Innovative Startup Act.
              </p>
            </div>

            <Card padding="md">
              <h2 className="text-body font-semibold text-text-primary mb-2">Eligibility & Requirements</h2>
              <ul className="list-disc pl-5 space-y-1 text-body-sm text-text-secondary">
                <li>Must be operating in the Philippines</li>
                <li>Innovative business model or tech-driven product</li>
                <li>SEC or DTI Registration (if available)</li>
                <li>Pitch Deck or Business Plan</li>
              </ul>
            </Card>

            <Button variant="primary" size="lg" className="mt-4" onClick={() => setStep('form')}>
              Register Start-Up
            </Button>
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
            <h2 className="text-h2 font-bold text-text-primary">Application Form</h2>
            <Card className="flex flex-col gap-4">
              <Input 
                label="Start-Up Name" 
                placeholder="Name of your company"
                value={formData.startupName}
                onChange={e => setFormData({ ...formData, startupName: e.target.value })}
              />
              <Input 
                label="Sector / Industry" 
                placeholder="e.g. HealthTech, EdTech, FinTech"
                value={formData.sector}
                onChange={e => setFormData({ ...formData, sector: e.target.value })}
              />
              <div>
                <p className="text-body-sm text-text-secondary mb-1">Brief Description</p>
                <textarea
                  className="w-full h-24 p-3 bg-white border border-border rounded-lg text-body-sm resize-none focus:border-primary outline-none"
                  placeholder="What problem are you solving?"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </Card>
            <Button 
              variant="primary" 
              size="lg" 
              isLoading={isSubmitting}
              onClick={handleSubmit}
              disabled={!formData.startupName || !formData.sector || !formData.description}
            >
              Submit Application
            </Button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-6 pt-8">
            <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-success" />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary">Application Received!</h2>
              <p className="text-body text-text-secondary mt-2">
                Your Start-Up registration for <span className="font-semibold text-text-primary">{formData.startupName}</span> has been submitted. We will review your application and contact you soon.
              </p>
            </div>
            <Button variant="primary" fullWidth onClick={() => navigate('/home')}>
              Back to Home
            </Button>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
