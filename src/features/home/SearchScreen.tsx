/**
 * SearchScreen — global service search
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

const ALL_SERVICES = [
  { name: 'NBI Clearance Appointment', path: '/bpesh/appointment', category: 'BPESH', hint: 'Book NBI clearance online' },
  { name: 'PSA Birth Certificate', path: '/bpesh/psa', category: 'BPESH', hint: 'Request official PSA documents' },
  { name: 'eTravel Declaration', path: '/etravel', category: 'Travel', hint: 'Electronic travel declaration' },
  { name: 'SSS Contributions', path: '/agencies/sss', category: 'Agencies', hint: 'View SSS records' },
  { name: 'PhilHealth Membership', path: '/agencies/philhealth', category: 'Agencies', hint: 'View PhilHealth records' },
  { name: 'Pag-IBIG Fund', path: '/agencies/pagibig', category: 'Agencies', hint: 'View Pag-IBIG records' },
  { name: 'Digital National ID', path: '/mobile-id/ePhilID', category: 'Mobile ID', hint: 'View your ePhilID' },
  { name: 'eDriver\'s License', path: '/mobile-id/eDL', category: 'Mobile ID', hint: 'View your digital license' },
  { name: 'Weather', path: '/weather', category: 'Services', hint: 'Current weather and alerts' },
  { name: 'Speed Test', path: '/speedtest', category: 'Services', hint: 'Test your internet speed' },
  { name: 'eReport', path: '/ereport', category: 'Services', hint: 'File an incident report' },
  { name: 'eGovPay', path: '/egovpay', category: 'Services', hint: 'Pay government fees' },
  { name: 'DOLE Job Search', path: '/employment', category: 'Employment', hint: 'Find government-listed jobs' },
  { name: 'Consultation Services', path: '/consultation', category: 'Services', hint: 'Contact a government agency' },
  { name: 'eGov AI Assistant', path: '/egov-ai', category: 'Services', hint: 'Ask about government services' },
  { name: 'Tourism Destinations', path: '/home/tourism', category: 'Tourism', hint: 'Explore Philippine destinations' },
  { name: 'LGU Services', path: '/lgu', category: 'LGU', hint: 'Local government services' },
];

export function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = query.length > 1
    ? ALL_SERVICES.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase()) ||
        s.hint.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Search Services" showBack />
      <ScreenContainer noPadding className="gap-0">
        {/* Search bar */}
        <div className="px-4 py-3 bg-white border-b border-border sticky top-0 z-10">
          <div className="flex items-center gap-2 h-11 px-4 bg-bg border border-border rounded-full focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Search size={18} className="text-text-secondary shrink-0" />
            <input
              type="search"
              placeholder="Search services…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-body text-text-primary outline-none placeholder-text-secondary"
              aria-label="Search all government services"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear search">
                <X size={16} className="text-text-secondary" />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 pt-4 pb-4">
          {/* Suggestions / results */}
          {query.length <= 1 && (
            <div className="flex flex-col gap-3">
              <p className="text-body-sm text-text-secondary">Popular searches</p>
              {['NBI Clearance', 'eTravel', 'SSS', 'Digital ID', 'Weather'].map(q => (
                <button key={q} onClick={() => setQuery(q)}
                  className="flex items-center gap-3 py-2 text-text-primary hover:text-primary transition-colors">
                  <Search size={16} className="text-text-secondary" />
                  <span className="text-body">{q}</span>
                </button>
              ))}
            </div>
          )}

          {query.length > 1 && results.length === 0 && (
            <p className="text-body text-text-secondary py-8 text-center">No results for "{query}"</p>
          )}

          {results.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-body-sm text-text-secondary">{results.length} result{results.length !== 1 ? 's' : ''}</p>
              {results.map(r => (
                <button key={r.path} onClick={() => navigate(r.path)}
                  className="w-full flex items-center gap-3 bg-white border border-border rounded-lg p-4 text-left hover:shadow-card-hover hover:border-primary/20 transition-all">
                  <div className="flex-1">
                    <p className="text-body font-semibold text-text-primary">{r.name}</p>
                    <p className="text-body-sm text-text-secondary">{r.hint}</p>
                    <span className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full mt-1 inline-block">{r.category}</span>
                  </div>
                  <ArrowRight size={16} className="text-text-secondary shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </ScreenContainer>
    </div>
  );
}
