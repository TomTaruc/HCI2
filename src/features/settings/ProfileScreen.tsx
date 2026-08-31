/**
 * ProfileScreen — User profile details
 */
import React from 'react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { useAuth } from '../../state/AuthContext';
import { Badge } from '../../components/ui/Card';

export function ProfileScreen() {
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Profile" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center border-4 border-primary-light">
            <span className="text-white font-bold text-4xl">{(user?.firstName ?? 'U')[0]}</span>
          </div>
          <div className="text-center">
            <h1 className="text-h1 font-bold text-text-primary">{user?.fullName}</h1>
            <p className="text-body text-text-secondary mt-1">{user?.mobileNumber}</p>
          </div>
          {isVerified ? (
            <Badge variant="success">✓ Verified Account</Badge>
          ) : (
            <Badge variant="warning">⚠ Unverified Account</Badge>
          )}
        </div>

        <div className="bg-white border border-border rounded-lg divide-y divide-border">
          {[
            { label: 'Full Name', value: user?.fullName },
            { label: 'PhilSys Number', value: user?.philSysNumber || 'Not provided' },
            { label: 'Mobile Number', value: user?.mobileNumber },
            { label: 'Email', value: user?.email || 'Not provided' },
            { label: 'LGU Code', value: user?.lguCode || 'QC' },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col px-4 py-3">
              <span className="text-xs text-text-secondary">{label}</span>
              <span className="text-body font-semibold text-text-primary mt-0.5">{value}</span>
            </div>
          ))}
        </div>
      </ScreenContainer>
    </div>
  );
}
