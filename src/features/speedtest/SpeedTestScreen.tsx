/**
 * SpeedTestScreen — Simulated internet speed test
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

import { useServices } from '../../state/ServiceContext';

type Stage = 'idle' | 'ping' | 'download' | 'upload' | 'done';

export function SpeedTestScreen() {
  const [stage, setStage] = useState<Stage>('idle');
  const [ping, setPing] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [progress, setProgress] = useState(0);

  const { speed, refreshSpeed } = useServices();

  const runTest = async () => {
    refreshSpeed();
    setStage('ping');
    setProgress(0);
    // Simulate ping test animation up to actual RTT
    const targetPing = speed.rtt || 24;
    await new Promise(r => setTimeout(r, 800));
    setPing(targetPing);
    setProgress(25);

    setStage('download');
    const targetDown = speed.downlink || 25;
    for (let i = 0; i <= 30; i++) {
      await new Promise(r => setTimeout(r, 60));
      setDownload(Math.floor(i * (Math.random() * 2 + (targetDown / 30))));
      setProgress(25 + i * 1.5);
    }
    setDownload(targetDown);
    setProgress(70);

    setStage('upload');
    const targetUp = targetDown > 10 ? Math.floor(targetDown * 0.4) : 5;
    for (let i = 0; i <= 20; i++) {
      await new Promise(r => setTimeout(r, 60));
      setUpload(Math.floor(i * (Math.random() + (targetUp / 20))));
      setProgress(70 + i * 1.5);
    }
    setUpload(targetUp);
    setProgress(100);
    setStage('done');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Speed Test" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="flex flex-col items-center gap-8 pt-8">
        <div className="flex items-center gap-2 text-text-secondary">
          <Wifi size={18} /> <span className="text-body-sm font-semibold">Internet Speed Test</span>
        </div>

        {/* Gauge */}
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#E4E8F0" strokeWidth="14" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="#0038A8" strokeWidth="14" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
              className="transition-all duration-200" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-text-primary">
              {stage === 'idle' ? '--' : stage === 'ping' ? ping : stage === 'download' ? download : stage === 'upload' ? upload : download}
            </span>
            <span className="text-body-sm text-text-secondary font-semibold">
              {stage === 'ping' ? 'ms' : 'Mbps'}
            </span>
            <span className="text-xs text-text-secondary capitalize mt-0.5">
              {stage === 'idle' ? 'Ready' : stage === 'done' ? 'Complete' : stage + ' test…'}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <AnimatePresence>
          {(stage === 'done' || stage !== 'idle') && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4 w-full">
              {[{ label: 'Ping', value: ping, unit: 'ms', color: 'text-success' },
                { label: 'Download', value: download, unit: 'Mbps', color: 'text-primary' },
                { label: 'Upload', value: upload, unit: 'Mbps', color: 'text-secondary' }].map(s => (
                <div key={s.label} className="bg-white border border-border rounded-lg p-3 text-center">
                  <p className="text-body-sm text-text-secondary">{s.label}</p>
                  <p className={`text-h2 font-bold ${s.color}`}>{s.value || '--'}</p>
                  <p className="text-xs text-text-secondary">{s.unit}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => { if (stage === 'idle' || stage === 'done') { setPing(0); setDownload(0); setUpload(0); setProgress(0); runTest(); } }}
          disabled={stage !== 'idle' && stage !== 'done'}
          className={[
            'w-36 h-36 rounded-full text-white font-bold text-h2 transition-all',
            stage !== 'idle' && stage !== 'done' ? 'bg-primary/60 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark active:scale-95',
          ].join(' ')}
          aria-label={stage === 'idle' ? 'Start speed test' : stage === 'done' ? 'Retest' : 'Testing…'}
        >
          {stage === 'idle' ? 'GO' : stage === 'done' ? 'Retest' : '…'}
        </button>

        {stage === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary-light rounded-lg p-4 text-body-sm text-primary w-full">
            📶 {download >= 25 ? 'Good connection for streaming and video calls.' : download >= 10 ? 'Adequate for most services.' : 'Slow connection. Consider moving closer to your router.'}
          </motion.div>
        )}

        <p className="text-body-sm text-text-secondary text-center">
          Results are based on local network condition estimates using the Network Information API.
        </p>
      </ScreenContainer>
    </div>
  );
}
