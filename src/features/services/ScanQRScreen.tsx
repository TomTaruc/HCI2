/**
 * ScanQRScreen — QR Scanner mock (no real camera scanning)
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AppBar } from '../../components/layout/AppBar';

export function ScanQRScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { returnTo?: string; returnParam?: string; title?: string } | null;
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } }, 
      false
    );
    scanner.render(
      (text) => {
        scanner.clear();
        setScanResult(text);
      },
      (error) => {
        // ignore continuous scanning errors
      }
    );
    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);
  return (
    <div className="flex-1 flex flex-col bg-black">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-white text-h2 font-bold">Scan QR</h1>
        <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white text-body-sm">Cancel</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 pb-8">
        
        {!scanResult ? (
          <>
            <div id="qr-reader" className="w-full max-w-sm overflow-hidden rounded-xl bg-white text-black"></div>
            <p className="text-white/70 text-body text-center mt-4">
              Point your camera or upload an image to scan.
            </p>
            <button onClick={() => navigate('/mobile-id')} className="h-12 px-8 bg-white/20 rounded-lg text-white font-semibold hover:bg-white/30 transition-colors mt-4">
              Open ID Wallet
            </button>
          </>
        ) : (
          <div className="bg-white rounded-xl p-6 text-center w-full max-w-sm">
            <h2 className="text-xl font-bold text-success mb-2">Scan Successful</h2>
            <p className="text-body text-text-primary mb-4 break-words font-mono bg-bg p-3 rounded-lg">
              {scanResult}
            </p>
            <div className="flex flex-col gap-3 justify-center mt-6">
              {state?.returnTo ? (
                <button 
                  onClick={() => {
                    const params = state.returnParam ? { [state.returnParam]: scanResult } : { scanResult };
                    navigate(state.returnTo!, { state: params, replace: true });
                  }} 
                  className="px-6 py-3 bg-primary rounded-lg text-white font-medium w-full"
                >
                  Use Scanned Data
                </button>
              ) : null}
              <button onClick={() => { setScanResult(null); window.location.reload(); }} className="px-6 py-3 border border-border rounded-lg text-text-secondary font-medium w-full">
                Scan Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
