/**
 * WelcomeScreen — eGovPH HCI Prototype
 * Entry point: Log In or Register. EN/FIL language toggle (visual only — demo).
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'EN' | 'FIL'>('EN');

  const copy = {
    EN: {
      tagline: 'Your Government. One App.',
      sub: 'Access over 1,000 government services from national agencies and local government units — all in one place.',
      login: 'Log In',
      register: 'Create Account',
      guest: 'Continue as Guest (eTravel only)',
      terms: 'By continuing, you agree to our Terms of Service and Privacy Policy.',
    },
    FIL: {
      tagline: 'Iyong Pamahalaan. Isang App.',
      sub: 'I-access ang mahigit 1,000 serbisyo mula sa mga ahensya ng pamahalaan at lokal na pamahalaan — lahat sa iisang lugar.',
      login: 'Mag-Login',
      register: 'Lumikha ng Account',
      guest: 'Magpatuloy bilang Bisita (eTravel lamang)',
      terms: 'Sa pamamagitan ng pagpapatuloy, sumasang-ayon ka sa aming Mga Tuntunin ng Serbisyo at Patakaran sa Privacy.',
    },
  };

  const t = copy[lang];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero section */}
      <div className="bg-primary relative flex-1 flex flex-col items-center justify-center px-8 pb-8 overflow-hidden">
        {/* Background ray pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 390 600" className="w-full h-full">
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line key={i} x1="195" y1="300"
                  x2={195 + 600 * Math.cos(rad)} y2={300 + 600 * Math.sin(rad)}
                  stroke="white" strokeWidth="60"
                />
              );
            })}
          </svg>
        </div>

        {/* Language toggle */}
        <div className="absolute top-4 right-4 flex bg-white/20 rounded-full p-0.5">
          {(['EN', 'FIL'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={[
                'px-3 py-1 rounded-full text-xs font-bold transition-all',
                lang === l ? 'bg-white text-primary' : 'text-white/80',
              ].join(' ')}
              aria-pressed={lang === l}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 z-10"
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" aria-label="eGovPH logo">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <circle cx="50" cy="50" r="18" fill="#FCD116" />
            <circle cx="50" cy="50" r="10" fill="#0038A8" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line key={i}
                  x1={50 + 20 * Math.cos(rad)} y1={50 + 20 * Math.sin(rad)}
                  x2={50 + 38 * Math.cos(rad)} y2={50 + 38 * Math.sin(rad)}
                  stroke="#FCD116" strokeWidth="3.5" strokeLinecap="round"
                />
              );
            })}
          </svg>

          <div className="text-center">
            <div className="text-white text-3xl font-bold tracking-tight">
              eGOV<span className="text-accent">PH</span>
            </div>
            <div className="text-accent text-xs font-semibold uppercase tracking-widest mt-0.5">
              Bagong Pilipinas
            </div>
          </div>

          <p className="text-h1 font-bold text-white text-center leading-tight mt-2">
            {t.tagline}
          </p>
          <p className="text-white/70 text-body text-center leading-relaxed max-w-xs">
            {t.sub}
          </p>
        </motion.div>
      </div>

      {/* Actions section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white px-6 pt-6 pb-8 flex flex-col gap-3"
      >
        {/* Bagong Pilipinas stripe */}
        <div className="h-0.5 bg-gradient-to-r from-secondary to-accent -mx-6 mb-2" aria-hidden="true" />

        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => navigate('/login')}
        >
          {t.login}
        </Button>

        <Button
          variant="outline"
          fullWidth
          size="lg"
          onClick={() => navigate('/register/mobile')}
        >
          {t.register}
        </Button>

        <button
          onClick={() => navigate('/etravel')}
          className="text-center text-body-sm text-text-secondary hover:text-primary transition-colors py-2 underline underline-offset-2"
        >
          {t.guest}
        </button>

        <p className="text-xs text-text-secondary text-center leading-relaxed">
          {t.terms}
        </p>

        <div className="text-center">
          <span className="text-xs text-error bg-error/10 px-3 py-1 rounded-full font-semibold">
            ⚠ Unofficial Research Prototype — Not the real eGovPH
          </span>
        </div>
      </motion.div>
    </div>
  );
}
