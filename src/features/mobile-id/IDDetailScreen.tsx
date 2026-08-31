/**
 * IDDetailScreen — Tier 1 Flow B
 * Full ID card view: photo, details, QR block, download action.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, QrCode } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { CardSkeleton } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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

export function IDDetailScreen() {
  const { idType } = useParams<{ idType: string }>();
  const navigate = useNavigate();
  const [id, setId] = useState<DigitalID | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadMsg, setDownloadMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      await new Promise(r => setTimeout(r, 500));
      const ids = db.get<DigitalID[]>('digitalIds') ?? [];
      const found = ids.find(i => i.type === idType);
      setId(found ?? null);
      setIsLoading(false);
    };
    load();
  }, [idType]);

  const handleDownload = () => {
    // Client-side "download" — shows a toast message (no real file generation needed for usability test)
    setDownloadMsg('Your ID card has been saved to your downloads folder (demo only).');
    setTimeout(() => setDownloadMsg(''), 3000);
  };

  const formatDate = (iso: string | null | undefined) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="ID Details" showBack />
        <ScreenContainer className="pt-4 gap-3">
          <CardSkeleton />
          <CardSkeleton />
        </ScreenContainer>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="ID Details" showBack />
        <ScreenContainer className="flex items-center justify-center">
          <p className="text-body text-text-secondary">ID not found.</p>
        </ScreenContainer>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title={id.label} showBack />
      <div className="bp-stripe" aria-hidden="true" />

      <ScreenContainer className="pt-4 gap-4">
        {/* ID Card visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl overflow-hidden shadow-card-hover"
          style={{ background: `linear-gradient(135deg, ${id.color} 0%, ${id.color}CC 100%)` }}
        >
          {/* Top bar */}
          <div className="px-5 pt-5 pb-3 flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                Republic of the Philippines
              </p>
              <p className="text-white text-body font-bold mt-0.5">{id.agency}</p>
            </div>
            {/* Original SVG crest */}
            <svg width="36" height="36" viewBox="0 0 30 30" fill="none" aria-label="Philippine government crest" className="opacity-60">
              <circle cx="15" cy="15" r="14" fill="none" stroke="white" strokeWidth="1" />
              <circle cx="15" cy="15" r="7" fill="rgba(255,255,255,0.4)" />
              <circle cx="15" cy="15" r="4" fill={id.color} />
            </svg>
          </div>

          {/* Photo + details */}
          <div className="px-5 pb-4 flex items-center gap-4">
            {/* Placeholder avatar */}
            <div className="w-16 h-20 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 shrink-0">
              <span className="text-3xl">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-body leading-tight">{id.holderName}</p>
              <div className="mt-2 flex flex-col gap-0.5">
                <p className="text-white/60 text-xs">ID Number</p>
                <p className="text-white font-mono text-xs font-semibold tracking-wider">{id.idNumber}</p>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="bg-black/20 px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Issued</p>
              <p className="text-white text-xs font-semibold">{formatDate(id.issuedDate)}</p>
            </div>
            {id.expiresDate && (
              <div>
                <p className="text-white/60 text-xs">Expires</p>
                <p className="text-white text-xs font-semibold">{formatDate(id.expiresDate)}</p>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-success rounded-full" aria-hidden="true" />
              <p className="text-white text-xs font-semibold">Valid</p>
            </div>
          </div>
        </motion.div>

        {/* Details list */}
        <div className="bg-white rounded-lg border border-border divide-y divide-border">
          {[
            { label: 'Full Name', value: id.holderName ?? '—' },
            { label: 'ID Number', value: id.idNumber ?? '—', mono: true },
            { label: 'Issuing Authority', value: id.agency },
            { label: 'Issue Date', value: formatDate(id.issuedDate) },
            { label: 'Expiry Date', value: id.expiresDate ? formatDate(id.expiresDate) : 'No expiry' },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex justify-between items-start px-4 py-3 gap-3">
              <span className="text-body-sm text-text-secondary shrink-0">{label}</span>
              <span className={`text-body-sm text-text-primary text-right ${mono ? 'font-mono' : 'font-medium'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-primary-light rounded-lg px-4 py-3">
          <p className="text-body-sm text-primary">{id.description}</p>
        </div>

        {/* Download toast */}
        {downloadMsg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-success/10 border border-success rounded-lg px-4 py-3"
            role="status"
          >
            <p className="text-body-sm text-success font-medium">✓ {downloadMsg}</p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            leftIcon={<Download size={18} />}
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button
            variant="primary"
            fullWidth
            leftIcon={<QrCode size={18} />}
            onClick={() => navigate(`/id/qr/${id.type}`)}
          >
            Show QR
          </Button>
        </div>

        <p className="text-body-sm text-text-secondary text-center">
          This ID is cached for offline viewing. Last synced: Aug 31, 2026.
        </p>
      </ScreenContainer>
    </div>
  );
}
