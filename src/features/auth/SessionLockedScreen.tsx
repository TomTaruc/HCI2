/**
 * SessionLockedScreen — shown when 5-minute inactivity timer expires
 * User must re-enter MPIN to unlock the session
 */
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { MPINInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../state/AuthContext';
import { login as loginService } from '../../mock/services/authService';

export function SessionLockedScreen() {
  const { user, unlockSession, logout } = useAuth();
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async () => {
    if (mpin.length < 6) { setError('Enter all 6 digits.'); return; }
    setIsLoading(true);
    try {
      await loginService(user!.mobileNumber, mpin);
      setError('');
      unlockSession();
    } catch {
      setError('Incorrect MPIN. Please try again.');
      setMpin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMpinChange = (value: string) => {
    setMpin(value);
    setError('');
    if (value.length === 6) {
      setTimeout(() => {
        setIsLoading(true);
        loginService(user!.mobileNumber, value)
          .then(() => { unlockSession(); })
          .catch(() => { setError('Incorrect MPIN.'); setMpin(''); setIsLoading(false); });
      }, 100);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center">
          <Lock size={36} className="text-primary" />
        </div>
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Session locked</h1>
          <p className="text-body text-text-secondary mt-1">
            Your session timed out for security. Enter your MPIN to continue.
          </p>
        </div>
        {user && (
          <div className="bg-bg rounded-lg px-4 py-2">
            <p className="text-body-sm text-text-secondary">{user.mobileNumber}</p>
          </div>
        )}
      </div>

      <MPINInput value={mpin} onChange={handleMpinChange} error={error} />

      {isLoading && <p className="text-body-sm text-text-secondary">Verifying…</p>}

      <div className="flex flex-col gap-3 w-full">
        <Button variant="primary" fullWidth size="lg" onClick={handleUnlock} isLoading={isLoading} disabled={mpin.length < 6}>
          Unlock
        </Button>
        <Button variant="ghost" fullWidth onClick={logout}>
          Log out instead
        </Button>
      </div>
    </div>
  );
}
