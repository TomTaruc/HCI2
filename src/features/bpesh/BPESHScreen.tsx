/**
 * BPESHScreen — Bagong Pilipinas eGovPH Serbisyo Hub
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

const BPESH_SERVICES = [
  { icon: '🔍', label: 'NBI Clearance', desc: 'Book an NBI clearance appointment', path: '/bpesh/appointment', params: { service: 'NBI' } },
  { icon: '👮', label: 'Police Clearance', desc: 'Book a police clearance appointment', path: '/bpesh/appointment', params: { service: 'Police' } },
  { icon: '📄', label: 'PSA Documents', desc: 'Request birth, marriage, or death certificate', path: '/bpesh/psa' },
  { icon: '🪪', label: 'National ID (Paper)', desc: 'Request a paper copy of your ePhilID', path: '/bpesh/psa' },
];

export function BPESHScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Serbisyo Hub" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-4">
        <div className="bg-primary rounded-lg p-5">
          <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">Bagong Pilipinas</p>
          <h1 className="text-h1 font-bold text-white">eGovPH Serbisyo Hub</h1>
          <p className="text-white/70 text-body-sm mt-1">
            Book government appointments and request official documents — no need to go to an office.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {BPESH_SERVICES.map(s => (
            <button key={s.label} onClick={() => navigate(s.path, { state: s.params })}
              className="w-full bg-white border border-border rounded-lg p-4 flex items-center gap-3 text-left hover:shadow-card-hover hover:border-primary/20 transition-all">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-2xl shrink-0">{s.icon}</div>
              <div className="flex-1">
                <p className="text-body font-semibold text-text-primary">{s.label}</p>
                <p className="text-body-sm text-text-secondary">{s.desc}</p>
              </div>
              <span className="text-text-secondary" aria-hidden="true">›</span>
            </button>
          ))}
        </div>
      </ScreenContainer>
    </div>
  );
}
