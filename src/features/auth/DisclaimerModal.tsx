/**
 * DisclaimerModal — eGovPH HCI Prototype
 * 
 * MANDATORY first-launch modal per Section 17 of the spec.
 * Must be dismissed before the user can proceed.
 * Also accessible from Settings > About.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface DisclaimerModalProps {
  onClose: () => void;
  asPage?: boolean; // when true, renders inline (for About screen)
}

export function DisclaimerModal({ onClose, asPage = false }: DisclaimerModalProps) {
  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-primary px-6 pt-8 pb-6 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
          <ShieldAlert size={28} className="text-white" />
        </div>
        <div>
          <div className="text-white/70 text-label uppercase tracking-widest mb-1">Important Notice</div>
          <h1 className="text-white text-h1 font-bold">Unofficial Research Prototype</h1>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 bg-white">
        {/* Verbatim disclaimer text — Section 17 of the spec */}
        <div className="bg-primary-light border border-primary/20 rounded-lg p-4">
          <p className="text-body text-text-primary leading-relaxed">
            <strong>Unofficial Student Research Prototype.</strong> This application is a non-commercial academic recreation built for a university human-computer interaction usability study. It is not affiliated with, endorsed by, or produced by the Department of Information and Communications Technology (DICT) or any Philippine government agency, and it is not the real eGovPH app. It uses only fictional, locally-stored sample data — no real personal information, government ID numbers, or transactions are collected, transmitted, or stored anywhere.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-success text-sm font-bold">✓</span>
            </div>
            <div>
              <p className="text-body font-semibold text-text-primary">For academic purposes only</p>
              <p className="text-body-sm text-text-secondary">This prototype is used solely for HCI usability research at the university level.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-success text-sm font-bold">✓</span>
            </div>
            <div>
              <p className="text-body font-semibold text-text-primary">No real data collected</p>
              <p className="text-body-sm text-text-secondary">All information entered is fictional and stored only in your browser's local storage.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-success text-sm font-bold">✓</span>
            </div>
            <div>
              <p className="text-body font-semibold text-text-primary">No real transactions processed</p>
              <p className="text-body-sm text-text-secondary">All payments, ID verifications, and government interactions are simulated locally.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-warning text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-body font-semibold text-text-primary">For real government services</p>
              <p className="text-body-sm text-text-secondary">Visit the official eGovPH app on the Google Play Store or Apple App Store.</p>
            </div>
          </div>
        </div>

        {!asPage && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={onClose}
            className="mt-2"
          >
            I understand — Proceed
          </Button>
        )}
      </div>
    </div>
  );

  if (asPage) return <div className="flex-1 flex flex-col">{content}</div>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col"
        style={{ maxWidth: 430, left: '50%', transform: 'translateX(-50%)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Research prototype disclaimer"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
