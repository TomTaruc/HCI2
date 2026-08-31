/**
 * IDQRShareScreen — Tier 1 Flow B
 * Full-screen QR with consent toggle and digital signature badge.
 * Consent must be toggled ON before QR is revealed.
 */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Eye, EyeOff } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { db } from '../../mock/db';

interface DigitalID {
  type: string;
  label: string;
  agency: string;
  available: boolean;
  idNumber?: string | null;
  holderName?: string | null;
  qrPayload?: string | null;
  color: string;
}

export function IDQRShareScreen() {
  const { idType } = useParams<{ idType: string }>();
  const navigate = useNavigate();
  const [consentGiven, setConsentGiven] = useState(false);

  const ids = db.get<DigitalID[]>('digitalIds') ?? [];
  const id = ids.find(i => i.type === idType);

  if (!id) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black">
        <p className="text-white">ID not found.</p>
        <button onClick={() => navigate(-1)} className="text-white/70 mt-2">Go back</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a1a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <p className="text-white/60 text-xs uppercase tracking-widest">Share ID</p>
          <h1 className="text-white text-h2 font-bold">{id.label}</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Close QR share"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Consent toggle — must be enabled before QR is shown */}
      <div className="mx-4 mb-4 bg-white/10 rounded-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-white text-body font-semibold">Share my information with the verifier</p>
            <p className="text-white/60 text-body-sm mt-1">
              Your ID details will be readable by the scanner when consent is ON. Turn OFF when done.
            </p>
          </div>
          <button
            onClick={() => setConsentGiven(c => !c)}
            className={[
              'relative w-12 h-6 rounded-full transition-all duration-200 shrink-0 mt-0.5',
              consentGiven ? 'bg-success' : 'bg-white/20',
            ].join(' ')}
            role="switch"
            aria-checked={consentGiven}
            aria-label="Share information consent"
          >
            <motion.div
              animate={{ x: consentGiven ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full"
            />
          </button>
        </div>
      </div>

      {/* QR Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <AnimatePresence mode="wait">
          {consentGiven ? (
            <motion.div
              key="qr-visible"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              {/* QR Code — real QR of the qrPayload string */}
              <div className="bg-white p-6 rounded-2xl shadow-modal">
                <QRCodeSVG
                  value={id.qrPayload ?? `EGOV-${id.type}-DEMO-NOT-REAL`}
                  size={220}
                  level="H"
                  fgColor="#17203A"
                  bgColor="#FFFFFF"
                />
              </div>

              {/* Digital signature badge */}
              <div className="flex items-center gap-2 bg-success/20 border border-success/40 rounded-full px-4 py-2">
                <ShieldCheck size={16} className="text-success" />
                <span className="text-success text-body-sm font-semibold">Digitally Signed</span>
              </div>

              <div className="text-center">
                <p className="text-white font-bold text-body">{id.holderName}</p>
                <p className="text-white/60 text-body-sm font-mono">{id.idNumber}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="qr-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-52 h-52 bg-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                <EyeOff size={40} className="text-white/40" />
                <p className="text-white/40 text-body-sm px-4">
                  Turn on consent to reveal your QR code
                </p>
              </div>
              <p className="text-white/50 text-body-sm max-w-xs">
                Your QR code is hidden until you grant consent to share. Toggle the switch above to reveal it.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 pb-8 flex flex-col gap-3">
        <div className="bg-white/10 rounded-lg px-4 py-3 text-center">
          <p className="text-white/60 text-xs">
            This QR code contains encrypted demo data only. No real government records are accessible through this prototype.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-full h-12 bg-white/10 rounded-lg text-white font-semibold hover:bg-white/20 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
