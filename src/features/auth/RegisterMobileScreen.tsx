/**
 * RegisterMobileScreen — Step 1 of registration
 * Enter 10-digit PH mobile number
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { requestOTP } from '../../mock/services/authService';

const schema = z.object({
  mobileNumber: z
    .string()
    .regex(/^9\d{9}$/, 'Enter a valid 10-digit Philippine mobile number starting with 9 (e.g., 9171234567)')
    .length(10, 'Mobile number must be exactly 10 digits'),
});

type FormValues = z.infer<typeof schema>;

export function RegisterMobileScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setApiError('');
    try {
      await requestOTP(data.mobileNumber);
      navigate('/register/otp', { state: { mobileNumber: data.mobileNumber } });
    } catch {
      setApiError('Could not send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Create Account" showBack />

      <ScreenContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-8 pt-6"
        >
          {/* Step indicator */}
          <StepIndicator current={1} total={5} />

          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
              <Phone size={24} className="text-primary" />
            </div>
            <h1 className="text-h1 font-bold text-text-primary">Mobile Number</h1>
            <p className="text-body text-text-secondary">
              Enter your Philippine mobile number. We will send a one-time password (OTP) to verify it.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="9XXXXXXXXX"
              maxLength={10}
              leftIcon={<span className="text-text-secondary text-body-sm font-semibold">+63</span>}
              error={errors.mobileNumber?.message}
              autoFocus
              {...register('mobileNumber')}
            />

            {apiError && (
              <p className="text-body-sm text-error bg-error/10 rounded-md px-3 py-2" role="alert">
                {apiError}
              </p>
            )}

            <div className="bg-primary-light rounded-lg px-4 py-3">
              <p className="text-body-sm text-primary font-medium">
                📱 Make sure your number is active and can receive SMS. The OTP expires in 5 minutes.
              </p>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading}>
              Send OTP
            </Button>
          </form>

          {/* Login redirect */}
          <p className="text-center text-body-sm text-text-secondary">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-semibold hover:underline"
            >
              Log In
            </button>
          </p>
        </motion.div>
      </ScreenContainer>
    </div>
  );
}

// ----------------------------------------------------------------
// Step Indicator (reused across all register steps)
// ----------------------------------------------------------------

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={[
            'h-1 rounded-full transition-all duration-300',
            i + 1 < current ? 'bg-primary flex-1' : '',
            i + 1 === current ? 'bg-primary flex-[2]' : '',
            i + 1 > current ? 'bg-border flex-1' : '',
          ].join(' ')}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
