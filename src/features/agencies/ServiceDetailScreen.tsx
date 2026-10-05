import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getServiceById } from '../../registry/services';
import { useAuth } from '../../state/AuthContext';

export function ServiceDetailScreen() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState<'info' | 'form' | 'review' | 'success'>('info');
  const [formData, setFormData] = useState({ purpose: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refNum, setRefNum] = useState('');

  const service = getServiceById(serviceId || '');

  if (!service) {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="Service Not Found" onBack={() => navigate(-1)} />
        <ScreenContainer className="pt-8 items-center text-center gap-4">
          <p className="text-body text-text-secondary">We couldn't find the service you're looking for.</p>
          <Button variant="outline" onClick={() => navigate('/services')}>Return to Services</Button>
        </ScreenContainer>
      </div>
    );
  }

  // Handle external link check
  const isExternal = service.accessPolicy === 'public' && !service.agencyId && service.id !== 'sim-registration' && service.id !== 'startup';

  const handleNext = () => setStep('form');
  const handleReview = () => setStep('review');
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setRefNum(`REQ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      setIsSubmitting(false);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title={service.title} onBack={() => step === 'info' || step === 'success' ? navigate(-1) : setStep(step === 'review' ? 'form' : 'info')} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {step === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-3xl">
                {service.icon || '🏛️'}
              </div>
              <div className="flex-1">
                <h1 className="text-h2 font-bold text-text-primary">{service.title}</h1>
                <p className="text-body-sm text-text-secondary mt-1">{service.description}</p>
              </div>
            </div>

            <Card padding="md">
              <h2 className="text-body font-semibold text-text-primary mb-3">Requirements</h2>
              <ul className="space-y-2">
                <li className="flex gap-2 text-body-sm text-text-secondary">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  <span>Valid government-issued ID</span>
                </li>
                <li className="flex gap-2 text-body-sm text-text-secondary">
                  <CheckCircle size={16} className="text-success shrink-0" />
                  <span>Supporting documents (if applicable)</span>
                </li>
              </ul>
            </Card>

            <Card padding="md">
              <h2 className="text-body font-semibold text-text-primary mb-2">Instructions</h2>
              <ol className="list-decimal pl-5 space-y-1 text-body-sm text-text-secondary">
                <li>Review the requirements above.</li>
                <li>Fill out the application form accurately.</li>
                <li>Submit and wait for your reference number.</li>
              </ol>
            </Card>

            {isExternal ? (
              <a 
                href="#"
                className="mt-4 flex items-center justify-center gap-2 h-12 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                onClick={(e) => { e.preventDefault(); alert('This would open the official external portal.'); }}
              >
                Go to Official Portal <ExternalLink size={18} />
              </a>
            ) : (
              <Button variant="primary" size="lg" className="mt-4" onClick={handleNext}>
                {service.supportedAction} <ArrowRight size={18} />
              </Button>
            )}
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
            <h2 className="text-h2 font-bold text-text-primary">Application Form</h2>
            <Card className="flex flex-col gap-4">
              <Input 
                label="Full Name" 
                value={user ? `${user.firstName} ${user.lastName}` : ''} 
                disabled 
              />
              <Input 
                label="Purpose of Request" 
                placeholder="e.g. Employment, Personal"
                value={formData.purpose}
                onChange={e => setFormData({ ...formData, purpose: e.target.value })}
              />
              <Input 
                label="Additional Details (Optional)" 
                placeholder="Any other relevant info"
                value={formData.details}
                onChange={e => setFormData({ ...formData, details: e.target.value })}
              />
              
              <div className="border border-dashed border-border rounded-lg p-4 text-center">
                <FileText size={24} className="text-text-secondary mx-auto mb-2" />
                <p className="text-body-sm text-text-secondary">Attach required documents</p>
                <button className="mt-2 text-primary font-medium text-body-sm hover:underline">
                  Browse files
                </button>
              </div>
            </Card>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleReview}
              disabled={!formData.purpose.trim()}
            >
              Review Application
            </Button>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
            <h2 className="text-h2 font-bold text-text-primary">Review Application</h2>
            <Card className="flex flex-col gap-4">
              <div>
                <p className="text-body-sm text-text-secondary">Applicant Name</p>
                <p className="text-body font-medium">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-body-sm text-text-secondary">Purpose</p>
                <p className="text-body font-medium">{formData.purpose}</p>
              </div>
              {formData.details && (
                <div>
                  <p className="text-body-sm text-text-secondary">Details</p>
                  <p className="text-body font-medium">{formData.details}</p>
                </div>
              )}
            </Card>
            <p className="text-body-sm text-text-secondary text-center px-4">
              By submitting, you certify that the information provided is correct.
            </p>
            <Button variant="primary" size="lg" isLoading={isSubmitting} onClick={handleSubmit}>
              Submit Request
            </Button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-6 pt-8">
            <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-success" />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary">Request Submitted!</h2>
              <p className="text-body text-text-secondary mt-2">
                Your request for {service.title} has been received.
              </p>
            </div>
            <Card className="w-full bg-bg border-dashed">
              <p className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold mb-1">Reference Number</p>
              <p className="text-h2 font-mono font-bold text-primary tracking-widest">{refNum}</p>
            </Card>
            <div className="w-full flex flex-col gap-3 mt-4">
              <Button variant="primary" fullWidth onClick={() => navigate('/home')}>
                Back to Home
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate(-1)}>
                View Other Services
              </Button>
            </div>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
