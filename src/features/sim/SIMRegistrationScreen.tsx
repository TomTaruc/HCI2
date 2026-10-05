import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Smartphone, AlertTriangle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { db, delay } from '../../mock/db';
import { useAuth } from '../../state/AuthContext';
import { normalizePHMobile, requestOTP, verifyOTP } from '../../mock/services/authService';

interface SimRegistration {
  id: string;
  userId: string;
  mobile: string;
  status: 'registered';
  registeredAt: string;
}

export function SIMRegistrationScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState<'loading' | 'info' | 'input' | 'otp' | 'registered'>('loading');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredSims, setRegisteredSims] = useState<SimRegistration[]>([]);

  useEffect(() => {
    if (user) {
      const allSims = db.get<SimRegistration[]>('sim_registrations') || [];
      const userSims = allSims.filter(s => s.userId === user.id);
      setRegisteredSims(userSims);
      
      if (userSims.length > 0) {
        setStep('registered');
      } else {
        setStep('info');
      }
    }
  }, [user]);

  const [challengeId, setChallengeId] = useState('');

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError('');
    
    const canonical = normalizePHMobile(mobile);
    if (!canonical) {
      setError('Invalid Philippine mobile number format.');
      setIsLoading(false);
      return;
    }
    
    const allSims = db.get<SimRegistration[]>('sim_registrations') || [];
    if (allSims.find(s => s.mobile === canonical)) {
      setError('This SIM is already registered.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await requestOTP(canonical, 'registration');
      setChallengeId(res.challengeId);
      setMobile(canonical);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await verifyOTP(challengeId, otp);
      
      const allSims = db.get<SimRegistration[]>('sim_registrations') || [];
      const newSim: SimRegistration = {
        id: `SIM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        userId: user!.id,
        mobile,
        status: 'registered',
        registeredAt: new Date().toISOString()
      };
      
      db.set('sim_registrations', [...allSims, newSim]);
      setRegisteredSims([...registeredSims, newSim]);
      
      setStep('registered');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'loading') {
    return <div className="flex-1 flex flex-col bg-bg"><AppBar title="SIM Registration" showBack /></div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title="SIM Registration" onBack={() => {
        if (step === 'input') setStep('info');
        else if (step === 'otp') setStep('input');
        else navigate(-1);
      }} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {step === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-2">
              <Smartphone size={32} />
            </div>
            <div>
              <h1 className="text-h1 font-bold text-text-primary">Register Your SIM</h1>
              <p className="text-body-sm text-text-secondary mt-1">
                Verify and register your SIM card under the SIM Registration Act.
              </p>
            </div>
            <Button variant="primary" onClick={() => setStep('input')}>Start Registration</Button>
          </motion.div>
        )}

        {step === 'input' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
            <div>
              <h1 className="text-h1 font-bold text-text-primary">Mobile Number</h1>
              <p className="text-body-sm text-text-secondary mt-1">Enter your 10-digit mobile number.</p>
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-body-sm flex gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Card className="mt-2">
              <Input
                label="Mobile Number"
                placeholder="09XXXXXXXXX or +639XXXXXXXXX"
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
              />
              <Button 
                variant="primary" 
                fullWidth 
                className="mt-4"
                disabled={!mobile}
                isLoading={isLoading}
                onClick={handleSendOTP}
              >
                Send OTP
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
            <div>
              <h1 className="text-h1 font-bold text-text-primary">Enter OTP</h1>
              <p className="text-body-sm text-text-secondary mt-1">
                We sent a 6-digit code to +63 {mobile}. Use 123456 or 000000 for this demo.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-body-sm flex gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Card className="mt-2">
              <Input
                label="One-Time Password"
                placeholder="Enter 6-digit OTP"
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-xl tracking-widest font-mono"
              />
              <Button 
                variant="primary" 
                fullWidth 
                className="mt-4"
                disabled={otp.length !== 6}
                isLoading={isLoading}
                onClick={handleVerifyOTP}
              >
                Verify & Register
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 'registered' && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-6 pt-8">
            <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-success" />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-text-primary">SIM Registered</h2>
              <p className="text-body text-text-secondary mt-2">
                Your SIM cards have been registered successfully.
              </p>
            </div>
            
            <div className="w-full flex flex-col gap-3 mt-2">
              {registeredSims.map(sim => (
                <Card key={sim.id} padding="md" className="flex items-center justify-between text-left">
                  <div className="flex-1">
                    <p className="text-body font-mono font-bold">+63 {sim.mobile}</p>
                    <p className="text-xs text-text-secondary">Registered: {new Date(sim.registeredAt).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const blob = new Blob([`DEMO ACKNOWLEDGMENT\n\nSIM Registration successful for mobile: +63 ${sim.mobile}\nReference ID: ${sim.id}\nDate: ${new Date(sim.registeredAt).toLocaleString()}\n\nNote: This is a simulated registration for academic demo purposes.`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `SIM_Acknowledgment_${sim.mobile}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}>
                    <Download size={20} className="text-primary" />
                  </Button>
                </Card>
              ))}
            </div>

            <Button variant="outline" fullWidth onClick={() => { setMobile(''); setOtp(''); setStep('input'); }}>
              Register Another SIM
            </Button>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
