/**
 * SplashScreen — eGovPH HCI Prototype
 * First screen shown on app launch. Auto-advances to Welcome after 2.5s.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../state/AuthContext';

export function SplashScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(user ? '/home' : '/welcome', { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, user]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-primary overflow-hidden relative">
      {/* Background pattern — Philippine sun rays */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg viewBox="0 0 400 800" className="w-full h-full">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = 200 + 500 * Math.cos(rad);
            const y2 = 400 + 500 * Math.sin(rad);
            return (
              <line
                key={i}
                x1="200" y1="400"
                x2={x2} y2={y2}
                stroke="white"
                strokeWidth="40"
                strokeLinecap="round"
                opacity="0.5"
              />
            );
          })}
        </svg>
      </div>

      {/* Bagong Pilipinas accent stripe at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 z-10"
      >
        {/* Original stylized crest — NOT the real government seal */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" aria-label="eGovPH app logo">
            {/* Outer ring */}
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            {/* Inner filled circle */}
            <circle cx="50" cy="50" r="42" fill="rgba(255,255,255,0.15)" />
            {/* Sun */}
            <circle cx="50" cy="50" r="18" fill="#FCD116" />
            <circle cx="50" cy="50" r="10" fill="#0038A8" />
            {/* 8 Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + 20 * Math.cos(rad);
              const y1 = 50 + 20 * Math.sin(rad);
              const x2 = 50 + 38 * Math.cos(rad);
              const y2 = 50 + 38 * Math.sin(rad);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#FCD116" strokeWidth="3.5" strokeLinecap="round" />
              );
            })}
            {/* 3 Stars (Philippine flag — stylized) */}
            {[{ x: 50, y: 20 }, { x: 30, y: 78 }, { x: 70, y: 78 }].map((pos, i) => (
              <polygon
                key={i}
                points={`${pos.x},${pos.y - 5} ${pos.x + 1.5},${pos.y - 1.5} ${pos.x + 5},${pos.y - 1.5} ${pos.x + 2},${pos.y + 1} ${pos.x + 3},${pos.y + 5} ${pos.x},${pos.y + 2.5} ${pos.x - 3},${pos.y + 5} ${pos.x - 2},${pos.y + 1} ${pos.x - 5},${pos.y - 1.5} ${pos.x - 1.5},${pos.y - 1.5}`}
                fill="white"
                opacity="0.9"
              />
            ))}
          </svg>
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center"
        >
          <div className="text-white text-display font-bold tracking-tight">
            eGOV<span className="text-accent">PH</span>
          </div>
          <div className="text-white/80 text-body mt-1">
            Your Government. One App.
          </div>
        </motion.div>

        {/* Bagong Pilipinas wordmark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="text-accent text-label uppercase tracking-widest font-bold">
            Bagong Pilipinas
          </div>
          <div className="text-white/60 text-xs">
            Powered by DICT — eGovDX Platform
          </div>
        </motion.div>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-16 flex flex-col items-center gap-3"
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom safe area */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-primary-dark/50 to-transparent" aria-hidden="true" />
    </div>
  );
}
