/**
 * RegisterProfileScreen — Step 4 of registration
 * Enter legal name, email, date of birth, gender
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StepIndicator } from './RegisterMobileScreen';
import { register as registerUser } from '../../mock/services/authService';
import { useAuth } from '../../state/AuthContext';

const schema = z.object({
  firstName: z.string().min(2, 'Enter your first name (at least 2 characters)'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Enter your last name (at least 2 characters)'),
  email: z.string().email('Enter a valid email address'),
  dateOfBirth: z.string().min(1, 'Date of birth is required').refine(val => {
    const date = new Date(val);
    const age = (Date.now() - date.getTime()) / (365.25 * 24 * 3600 * 1000);
    return age >= 15 && age <= 120;
  }, 'You must be at least 15 years old to register'),
  sex: z.enum(['M', 'F'], { required_error: 'Please select your sex' }),
});

type FormValues = z.infer<typeof schema>;

export function RegisterProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const state = (location.state as { mobileNumber: string; mpin: string });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setApiError('');
    try {
      const newUser = await registerUser({
        mobileNumber: state.mobileNumber,
        email: data.email,
        fullName: `${data.firstName}${data.middleName ? ' ' + data.middleName : ''} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        dateOfBirth: data.dateOfBirth,
        sex: data.sex,
        mpin: state.mpin,
      });
      setUser(newUser);
      navigate('/register/email-verify', { state: { email: data.email } });
    } catch (err: unknown) {
      if (err instanceof Error) setApiError(err.message);
      else setApiError('Registration failed. Please try again.');
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
          className="flex flex-col gap-6 pt-6"
        >
          <StepIndicator current={4} total={5} />

          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
              <UserCircle size={24} className="text-primary" />
            </div>
            <h1 className="text-h1 font-bold text-text-primary">Basic Information</h1>
            <p className="text-body text-text-secondary">
              Enter your legal name exactly as it appears on your government ID.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="First Name"
              placeholder="e.g., Juan"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Middle Name (optional)"
              placeholder="e.g., Santos"
              error={errors.middleName?.message}
              {...register('middleName')}
            />
            <Input
              label="Last Name"
              placeholder="e.g., dela Cruz"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g., juan@email.com"
              hint="We will send a verification link to this email."
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Date of Birth"
              type="date"
              error={errors.dateOfBirth?.message}
              max={new Date().toISOString().split('T')[0]}
              {...register('dateOfBirth')}
            />

            {/* Sex selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text-secondary uppercase tracking-wider">Sex</label>
              <div className="flex gap-3">
                {[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }].map(opt => (
                  <label
                    key={opt.value}
                    className="flex-1 flex items-center gap-2 h-12 border border-border rounded-md px-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-light transition-colors"
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      className="accent-primary"
                      {...register('sex')}
                    />
                    <span className="text-body text-text-primary">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.sex && (
                <p className="text-body-sm text-error" role="alert">{errors.sex.message}</p>
              )}
            </div>

            {apiError && (
              <p className="text-body-sm text-error bg-error/10 rounded-md px-3 py-2" role="alert">
                {apiError}
              </p>
            )}

            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
