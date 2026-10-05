import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export function SIMRegistrationScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'otp' | 'registered'>('input');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('registered');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg">
      <AppBar title="SIM Registration" onBack={() => step === 'input' || step === 'registered' ? navigate(-1) : setStep('input')} />
      <div className="bp-stripe" aria-hidden="true" />
      
      <ScreenContainer className="pt-4 pb-20 gap-4">
        {step === 'input' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-2">
              <Smartphone size={32} />
            </div>
            <div>
              <h1 className="text-h1 font-bold text-text-primary">Register Your SIM</h1>
              <p className="text-body-sm text-text-secondary mt-1">
                Enter your 10-digit mobile number to verify and register your SIM card under the SIM Registration Act.
              </p>
            </div>

            <Card className="mt-4">
              <Input
                label="Mobile Number"
                placeholder="e.g. 912 345 6789"
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                prefix="+63"
              />
              <Button 
                variant="primary" 
                fullWidth 
                className="mt-4"
                disabled={mobile.length !== 10}
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
                We sent a 6-digit code to +63 {mobile}. Enter it below to confirm your registration.
              </p>
            </div>

            <Card className="mt-4">
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
                Your mobile number +63 {mobile} has been successfully registered to your eGovPH account.
              </p>
            </div>
            <Button variant="primary" fullWidth onClick={() => navigate('/home')}>
              Return to Home
            </Button>
          </motion.div>
        )}
      </ScreenContainer>
    </div>
  );
}
