/**
 * IDWalletScreen — Tier 1 Flow B
 * Shows the user's digital ID cards in a scrollable grid.
 * Unavailable IDs are visible but grayed out.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, Download } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { CardSkeleton, ErrorState, Badge } from '../../components/ui/Card';
import { useAuth } from '../../state/AuthContext';
import { db } from '../../mock/db';

interface DigitalID {
  type: string;
  label: string;
  agency: string;
  available: boolean;
  idNumber?: string | null;
  issuedDate?: string | null;
  expiresDate?: string | null;
  holderName?: string | null;
  qrPayload?: string | null;
  description: string;
  color: string;
}

export function IDWalletScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ids, setIds] = useState<DigitalID[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isVerified = user?.verificationStatus === 'verified';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await new Promise(r => setTimeout(r, 600));
        const data = db.get<DigitalID[]>('digitalIds') ?? [];
        setIds(data);
      } catch {
        setError('Couldn\'t load your ID wallet. Try again.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (!isVerified) {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="Mobile ID" />
        <div className="bp-stripe" aria-hidden="true" />
        <ScreenContainer className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-5 text-center py-12">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center">
              <Lock size={36} className="text-primary" />
            </div>
            <div>
              <h1 className="text-h1 font-bold text-text-primary">Verification Required</h1>
              <p className="text-body text-text-secondary mt-2 max-w-xs">
                Your Digital ID wallet is locked until your identity is verified.
              </p>
            </div>
            <button
              onClick={() => navigate('/verify')}
              className="h-12 px-8 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors"
            >
              Verify Account
            </button>
          </div>
        </ScreenContainer>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Mobile ID" />
      <div className="bp-stripe" aria-hidden="true" />

      <ScreenContainer className="pt-4 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-text-primary">Digital ID Wallet</h1>
            <p className="text-body-sm text-text-secondary">
              {ids.filter(i => i.available).length} IDs available
            </p>
          </div>
          <Badge variant="primary">✓ Verified</Badge>
        </div>

        {/* Quick summary card */}
        <div className="bg-primary rounded-lg p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-h2">{(user?.firstName ?? 'U')[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-body truncate">{user?.fullName}</p>
            <p className="text-white/70 text-body-sm">PhilSys: {user?.philSysNumber}</p>
          </div>
          <Badge variant="success" className="text-xs">Verified</Badge>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <ErrorState
            title="Couldn't load IDs"
            description={error}
            onRetry={() => { setError(''); setIsLoading(true); }}
          />
        )}

        {/* ID Cards */}
        {!isLoading && !error && (
          <div className="flex flex-col gap-3">
            {ids.map((id, i) => (
              <motion.div
                key={id.type}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => id.available && navigate(`/mobile-id/${id.type}`)}
                  disabled={!id.available}
                  className={[
                    'w-full rounded-lg border p-4 text-left transition-all',
                    'flex items-center gap-4',
                    id.available
                      ? 'bg-white border-border hover:shadow-card-hover hover:border-primary/20 active:scale-[0.99]'
                      : 'bg-gray-50 border-border opacity-60 cursor-not-allowed',
                  ].join(' ')}
                  aria-label={`${id.label}${!id.available ? ' — not available for your profile' : ''}`}
                >
                  {/* Color stripe / logo placeholder */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 font-bold text-white text-xs"
                    style={{ backgroundColor: id.available ? id.color : '#9CA3AF' }}
                  >
                    {id.type.slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-body font-semibold text-text-primary truncate">{id.label}</p>
                      {id.available && <Badge variant="success" className="text-xs shrink-0">Available</Badge>}
                    </div>
                    <p className="text-body-sm text-text-secondary truncate">{id.agency}</p>
                    {id.available && id.idNumber && (
                      <p className="text-xs text-text-secondary font-mono mt-0.5">{id.idNumber}</p>
                    )}
                    {!id.available && (
                      <p className="text-xs text-gray-400 mt-0.5">Not available for your profile</p>
                    )}
                  </div>

                  {id.available ? (
                    <ChevronRight size={18} className="text-text-secondary shrink-0" />
                  ) : (
                    <Lock size={16} className="text-gray-300 shrink-0" aria-hidden="true" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-body-sm text-text-secondary text-center pb-2">
          IDs are cached for offline viewing once opened. Tap any available ID to view details.
        </p>
      </ScreenContainer>
    </div>
  );
}
