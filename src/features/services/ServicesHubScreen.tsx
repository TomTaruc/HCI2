/**
 * ServicesHubScreen — main services landing (Services tab)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

const SERVICES = [
  { icon: '🏛️', label: 'NGAs', desc: 'National government agency portals', path: '/agencies' },
  { icon: '🏙️', label: 'LGUs', desc: 'Local government services', path: '/lgu' },
  { icon: '📋', label: 'BPESH', desc: 'Bagong Pilipinas eGovPH Serbisyo Hub', path: '/bpesh' },
  { icon: '✈️', label: 'eTravel', desc: 'Electronic travel declaration', path: '/etravel' },
  { icon: '💼', label: 'Employment', desc: 'Jobs, SPES, livelihood programs', path: '/employment' },
  { icon: '📝', label: 'Consultation', desc: 'Send concerns to agencies', path: '/consultation' },
  { icon: '🚨', label: 'eReport', desc: 'File non-emergency incident reports', path: '/ereport' },
  { icon: '💳', label: 'eGovPay', desc: 'Pay government fees and contributions', path: '/egovpay' },
  { icon: '💬', label: 'eGov AI', desc: 'AI assistant for FAQs and navigation', path: '/egov-ai' },
  { icon: '☀️', label: 'Weather', desc: 'Current conditions and alerts', path: '/weather' },
  { icon: '📶', label: 'Speed Test', desc: 'Test your internet connection', path: '/speedtest' },
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
          {SERVICES.map(s => (
            <button key={s.path} onClick={() => navigate(s.path)}
              className="w-full bg-white border border-border rounded-lg p-4 flex items-center gap-3 text-left hover:shadow-card-hover hover:border-primary/20 transition-all active:scale-[0.99]">
              <div className="w-11 h-11 bg-primary-light rounded-xl flex items-center justify-center text-2xl shrink-0">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-body font-semibold text-text-primary">{s.label}</p>
                <p className="text-body-sm text-text-secondary truncate">{s.desc}</p>
              </div>
              <span className="text-text-secondary text-lg" aria-hidden="true">›</span>
            </button>
          ))}
        </div>
      </ScreenContainer>
    </div>
  );
}
