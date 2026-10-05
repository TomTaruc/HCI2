/**
 * VerifyLivenessScreen — Tier 1 Flow A, Step 4
 * Simulated liveness check — pure UI, no real facial recognition.
 * 3–5 second sequence of prompts, ends in a checkmark.
 * Spec requirement: MUST NOT implement real biometric verification.
 */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ScanLine, Eye, RotateCw, AlertTriangle, VideoOff } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { submitVerification } from '../../mock/services/verificationService';
import { useAuth } from '../../state/AuthContext';

const LIVENESS_PROMPTS = [
  { text: 'Position your face in the frame', icon: <ScanLine size={40} className="text-white" />, duration: 2000 },
  { text: 'Hold still…', icon: <ScanLine size={40} className="text-white" />, duration: 2000 },
  { text: 'Blink now…', icon: <Eye size={40} className="text-white" />, duration: 1500 },
  { text: 'Turn slightly to the right…', icon: <RotateCw size={40} className="text-white" />, duration: 2000 },
  { text: 'Verifying your identity…', icon: <CheckCircle size={40} className="text-success" />, duration: 1500 },
];

export function VerifyLivenessScreen() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [canRetry, setCanRetry] = useState(false);

  const personalData = (() => {
    try { return JSON.parse(sessionStorage.getItem('verify_personal') ?? '{}'); } catch { return {}; }
  })();
  const pcn = sessionStorage.getItem('verify_pcn') ?? '';

  // Guard — redirect to flow start if required data is missing
  useEffect(() => {
    if (!sessionStorage.getItem('verify_personal') || !sessionStorage.getItem('verify_pcn')) {
      navigate('/verify/pcn', { replace: true });
    }
  }, [navigate]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  // Initialize camera
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to access camera", err);
        setCameraError(true);
      }
    }
    setupCamera();

    return () => {
      // Cleanup stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let totalDelay = 0;
    LIVENESS_PROMPTS.forEach((prompt, i) => {
      setTimeout(() => {
        setStep(i);
        if (i === LIVENESS_PROMPTS.length - 1) {
          setTimeout(async () => {
            // Submit verification
            setIsSubmitting(true);
            try {
              await submitVerification({
                userId: user!.id,
                fullName: personalData.fullName,
                dateOfBirth: personalData.dateOfBirth,
                sex: personalData.sex,
                address: personalData.address,
                nationality: personalData.nationality,
                pcn: pcn,
              });
              refreshUser();
              setIsDone(true);
            } catch (err: unknown) {
              setSubmitError(err instanceof Error ? err.message : 'Verification submission failed. Please try again.');
              setCanRetry(true);
            } finally {
              setIsSubmitting(false);
            }
          }, 800);
        }
      }, totalDelay);
      totalDelay += prompt.duration;
    });
  }, []);

  useEffect(() => {
    if (isDone) {
      setTimeout(() => navigate('/verify/pending'), 800);
    }
  }, [isDone, navigate]);

  const currentPrompt = LIVENESS_PROMPTS[step];

  return (
    <div className="flex-1 flex flex-col bg-black">
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Real camera feed */}
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover bg-black"
        />

        {cameraError && (
          <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-4 text-center px-6">
            <VideoOff size={48} className="text-error" />
            <p className="text-white">Camera access denied or unavailable. Please enable permissions to proceed.</p>
          </div>
        )}

        {/* Scanning overlay grid (visual cue) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" aria-hidden="true">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Face frame oval */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            {/* Oval face guide cutout effect */}
            <div
              className="w-56 h-72 rounded-full border-4 border-primary relative overflow-hidden flex items-center justify-center"
              style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)' }}
              aria-label="Position your face here"
            >

              {/* Corner scan animations */}
              {isDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-success/20 flex items-center justify-center"
                >
                  <CheckCircle size={60} className="text-success" />
                </motion.div>
              )}
            </div>

            {/* Scanning beam */}
            {!isDone && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-primary/80"
                animate={{ top: ['20%', '80%', '20%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Prompt text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center flex flex-col items-center gap-2"
            >
              <div aria-hidden="true">{currentPrompt.icon}</div>
              <p className="text-white text-h2 font-bold">{currentPrompt.text}</p>
            </motion.div>
          </AnimatePresence>

          {/* Step dots */}
          <div className="flex gap-2" role="progressbar" aria-valuenow={step + 1} aria-valuemax={LIVENESS_PROMPTS.length} aria-label="Liveness check progress">
            {LIVENESS_PROMPTS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-white' : 'bg-white/30'}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Top label */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="bg-black/50 px-3 py-1.5 rounded-full">
            <p className="text-white text-xs font-semibold uppercase tracking-wider">Liveness Check</p>
          </div>
          <div className="bg-black/50 px-3 py-1.5 rounded-full">
            <p className="text-white text-xs">
              Demo simulation only
            </p>
          </div>
        </div>

        {/* Bottom notice */}
        <div className="absolute bottom-8 left-4 right-4">
          {submitError ? (
            <div className="bg-red-900/90 rounded-lg px-4 py-4 text-center flex flex-col gap-3">
              <p className="text-white text-sm font-semibold flex items-center justify-center gap-2">
                <AlertTriangle size={16} /> Verification Failed
              </p>
              <p className="text-white/80 text-xs">{submitError}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/verify/pcn', { replace: true })}
                  className="flex-1 h-9 bg-white/20 rounded-md text-white text-xs font-semibold hover:bg-white/30 transition-colors"
                >
                  Go Back
                </button>
                {canRetry && (
                  <button
                    onClick={() => { setSubmitError(''); setCanRetry(false); setStep(0); setIsDone(false); }}
                    className="flex-1 h-9 bg-white rounded-md text-red-900 text-xs font-semibold hover:bg-white/90 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-black/60 rounded-lg px-4 py-3 text-center">
              <p className="text-white/70 text-xs">
                This is a simulated identity check for research purposes only. No biometric data is captured or processed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
