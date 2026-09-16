/**
 * ResearchToolsScreen — Testing utilities
 */
import React from 'react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../state/AuthContext';
import { db, resetDatabase } from '../../mock/db';

export function ResearchToolsScreen() {
  const { user } = useAuth();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This will log you out and clear all localStorage state.')) {
      resetDatabase(); // M-06: Use central reset function instead of direct localStorage manipulation
      window.location.href = '/';
    }
  };

  const toggleInstantVerify = () => {
    const current = db.get<boolean>('instantVerify') ?? false;
    db.set('instantVerify', !current);
    alert(`Instant Verify is now ${!current ? 'ON' : 'OFF'}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Research Tools" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
        <h1 className="text-h1 font-bold text-text-primary">Research Tools</h1>
        <p className="text-body-sm text-text-secondary">
          These tools are for test facilitators to control the state of the prototype during usability sessions.
        </p>

        <div className="bg-white border border-border rounded-lg p-4 flex flex-col gap-4">
          <div>
            <p className="text-body font-bold text-text-primary mb-1">Reset Demo Data</p>
            <p className="text-body-sm text-text-secondary mb-3">
              Clears all localStorage data (accounts, appointments, mock database state) and reloads the app to a clean state.
            </p>
            <Button variant="outline" className="border-error text-error hover:bg-error/10" fullWidth onClick={handleReset}>
              Reset Demo Data
            </Button>
          </div>
          
          <hr className="border-border" />
          
          <div>
            <p className="text-body font-bold text-text-primary mb-1">Instant Verification</p>
            <p className="text-body-sm text-text-secondary mb-3">
              When ON, the verification pending screen resolves immediately instead of waiting.
            </p>
            <Button variant="outline" fullWidth onClick={toggleInstantVerify}>
              Toggle Instant Verify
            </Button>
          </div>
          
          <hr className="border-border" />
          
          <div>
            <p className="text-body font-bold text-text-primary mb-1">Current State</p>
            <pre className="text-xs font-mono bg-bg p-2 rounded overflow-x-auto text-text-secondary mt-2">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
}
