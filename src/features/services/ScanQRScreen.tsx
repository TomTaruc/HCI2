/**
 * ScanQRScreen — QR Scanner mock (no real camera scanning)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';

export function ScanQRScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col bg-black">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-white text-h2 font-bold">Scan QR</h1>
        <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white text-body-sm">Cancel</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        <div className="relative w-56 h-56">
          <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
          {/* Corner frames */}
          {[['top-0 left-0', 'border-t-4 border-l-4 rounded-tl-xl'],
            ['top-0 right-0', 'border-t-4 border-r-4 rounded-tr-xl'],
            ['bottom-0 left-0', 'border-b-4 border-l-4 rounded-bl-xl'],
            ['bottom-0 right-0', 'border-b-4 border-r-4 rounded-br-xl']].map(([pos, cls]) => (
            <div key={pos} className={`absolute ${pos} w-8 h-8 border-white ${cls}`} />
          ))}
          <ScanLine size={60} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40 animate-pulse" />
        </div>
        <p className="text-white/70 text-body text-center">
          Point your camera at a QR code to scan it.
        </p>
        <div className="bg-white/10 rounded-lg px-4 py-3 text-center">
          <p className="text-white/60 text-xs">Demo mode: camera scanning is simulated. Tap a digital ID to share its QR instead.</p>
        </div>
        <button onClick={() => navigate('/mobile-id')} className="h-12 px-8 bg-white/20 rounded-lg text-white font-semibold hover:bg-white/30 transition-colors">
          Open ID Wallet
        </button>
      </div>
    </div>
  );
}
