/**
 * ServicesHubScreen — main services landing (Services tab)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

import { getAllServices } from '../../registry/services';

const DIRECTORIES = [
  { icon: '🏛️', title: 'NGAs', description: 'National government agency portals', route: '/agencies' },
  { icon: '🏙️', title: 'LGUs', description: 'Local government services', route: '/lgu' },
];

export function ServicesHubScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Services" />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-3">
        <h1 className="text-h1 font-bold text-text-primary">All Services</h1>
        <div className="flex flex-col gap-2">
          {[...DIRECTORIES, ...getAllServices().filter(s => !s.agencyId)].map(s => (
            <button key={s.route} onClick={() => navigate(s.route)}
              className="w-full bg-white border border-border rounded-lg p-4 flex items-center gap-3 text-left hover:shadow-card-hover hover:border-primary/20 transition-all active:scale-[0.99]">
              <div className="w-11 h-11 bg-primary-light rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden p-1">
                {'logoUrl' in s && s.logoUrl ? (
                  <img src={s.logoUrl} alt={s.title} className="w-full h-full object-contain" />
                ) : (
                  s.icon
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body font-semibold text-text-primary">{s.title}</p>
                <p className="text-body-sm text-text-secondary truncate">{s.description}</p>
              </div>
              <span className="text-text-secondary text-lg" aria-hidden="true">›</span>
            </button>
          ))}
        </div>
      </ScreenContainer>
    </div>
  );
}
