/**
 * VerifyPersonalInfoScreen — Tier 1 Flow A, Step 2
 * Personal info form validated against the mock PhilSys record.
 * Stores form data in sessionStorage for use by later steps.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../state/AuthContext';

const schema = z.object({
  fullName: z.string().min(3, 'Enter your full legal name as it appears on your National ID'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  sex: z.enum(['M', 'F'], { required_error: 'Please select your sex' }),
  address: z.string().min(10, 'Enter your full home address including barangay, city/municipality, and province'),
  nationality: z.string().min(3, 'Enter your nationality'),
});

type FormValues = z.infer<typeof schema>;

export function VerifyPersonalInfoScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      dateOfBirth: user?.dateOfBirth ?? '',
      sex: user?.sex ?? undefined,
      address: user?.address ?? '',
      nationality: user?.nationality ?? 'Filipino',
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    // Store form data for subsequent steps
    sessionStorage.setItem('verify_personal', JSON.stringify(data));
    setTimeout(() => {
      navigate('/verify/pcn');
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Verify Account" showBack />
      <ScreenContainer>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="flex flex-col gap-5 pt-4 pb-6">

          {/* Step progress */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 flex-1">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= 1 ? 'bg-primary' : 'bg-border'}`} />
              ))}
            </div>
            <span className="text-body-sm text-text-secondary shrink-0">Step 1 of 4</span>
          </div>

          <div>
            <h1 className="text-h1 font-bold text-text-primary">Personal Information</h1>
            <p className="text-body text-text-secondary mt-1">
              Enter your details <strong>exactly</strong> as they appear on your National ID. Any mismatch will prevent verification.
            </p>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3">
            <p className="text-body-sm text-text-primary font-medium">
              ⚠ Make sure your spelling, dates, and sex exactly match your PhilSys records.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Full Legal Name"
              placeholder="e.g., Maria Lourdes Reyes Santos"
              hint="First Name, Middle Name, Last Name — as on your National ID"
              error={errors.fullName?.message}
              {...register('fullName')}
            />
            <Input
              label="Date of Birth"
              type="date"
              error={errors.dateOfBirth?.message}
              {...register('dateOfBirth')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text-secondary uppercase tracking-wider">Sex</label>
              <div className="flex gap-3">
                {[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }].map(opt => (
                  <label key={opt.value}
                    className="flex-1 flex items-center gap-2 h-12 border border-border rounded-md px-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-light transition-colors">
                    <input type="radio" value={opt.value} className="accent-primary" {...register('sex')} />
                    <span className="text-body text-text-primary">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.sex && <p className="text-body-sm text-error" role="alert">{errors.sex.message}</p>}
            </div>

            <Input
              label="Home Address"
              placeholder="e.g., 123 Sampaguita St., Brgy. Bagong Silang, Quezon City, Metro Manila 1116"
              error={errors.address?.message}
              {...register('address')}
            />
            <Input
              label="Nationality"
              placeholder="e.g., Filipino"
              error={errors.nationality?.message}
              {...register('nationality')}
            />

            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading}>
              Continue
            </Button>
          </form>
        </motion.div>
      </ScreenContainer>
    </div>
  );
}
