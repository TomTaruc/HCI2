/**
 * LGUScreen — Browse your LGU and Other LGUs
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, ChevronRight, MapPin } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../state/AuthContext';
import { db } from '../../mock/db';

interface LGU {
  code: string;
  name: string;
  province: string;
  region: string;
  mayor: string;
  website: string;
  services: string[];
}

export function LGUScreen() {
  const { user } = useAuth();
  const [selectedLGU, setSelectedLGU] = useState<LGU | null>(null);
  const lgus = db.get<LGU[]>('lgus') ?? [];
  const myLGU = lgus.find(l => l.code === (user?.lguCode ?? 'QC')) ?? lgus[0];
  const otherLGUs = lgus.filter(l => l.code !== myLGU?.code);

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="LGU" showBack />
      <div className="bp-stripe" aria-hidden="true" />

      <ScreenContainer className="pt-4 gap-5">
        {/* My LGU */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" />
            <h2 className="text-h2 font-bold text-text-primary">Your LGU</h2>
          </div>
          {myLGU && (
            <button
              onClick={() => setSelectedLGU(selectedLGU?.code === myLGU.code ? null : myLGU)}
              className="w-full bg-primary rounded-lg p-4 text-left hover:bg-primary-dark transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-h2">{myLGU.name}</p>
                  <p className="text-white/70 text-body-sm">{myLGU.province} · {myLGU.region}</p>
                  <p className="text-white/60 text-body-sm mt-0.5">Mayor: {myLGU.mayor}</p>
                </div>
                <ChevronRight size={20} className={`text-white/60 transition-transform ${selectedLGU?.code === myLGU.code ? 'rotate-90' : ''}`} />
              </div>
              {selectedLGU?.code === myLGU.code && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-white/70 text-body-sm mb-2">Available Services:</p>
                  {myLGU.services.map(s => (
                    <div key={s} className="flex items-center gap-2 py-1">
                      <span className="text-accent" aria-hidden="true">›</span>
                      <span className="text-white text-body-sm">{s}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </button>
          )}
        </div>

        {/* Other LGUs */}
        <div>
          <h2 className="text-h2 font-bold text-text-primary mb-3">Other LGUs</h2>
          <div className="flex flex-col gap-2">
            {otherLGUs.map(lgu => (
              <button
                key={lgu.code}
                onClick={() => setSelectedLGU(selectedLGU?.code === lgu.code ? null : lgu)}
                className="w-full bg-white border border-border rounded-lg p-4 text-left hover:shadow-card-hover hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <Building size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-semibold text-text-primary">{lgu.name}</p>
                    <p className="text-body-sm text-text-secondary">{lgu.province}</p>
                  </div>
                  <ChevronRight size={16} className={`text-text-secondary transition-transform ${selectedLGU?.code === lgu.code ? 'rotate-90' : ''}`} />
                </div>
                {selectedLGU?.code === lgu.code && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-border">
                    <p className="text-body-sm text-text-secondary mb-1">Mayor: {lgu.mayor}</p>
                    <p className="text-body-sm font-semibold text-text-primary mb-1">Services:</p>
                    {lgu.services.slice(0, 4).map(s => (
                      <p key={s} className="text-body-sm text-text-secondary py-0.5">• {s}</p>
                    ))}
                    {lgu.services.length > 4 && (
                      <p className="text-body-sm text-primary font-semibold">+{lgu.services.length - 4} more</p>
                    )}
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
}
