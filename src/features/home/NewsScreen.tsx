/**
 * NewsScreen — government news feed (mock)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

const NEWS = [
  { id: 1, title: 'eGovPH surpasses 6 million downloads milestone', source: 'Philippine Information Agency', date: 'Aug 28, 2026', category: 'eGovPH Update', emoji: '📱' },
  { id: 2, title: 'Digital TIN ID now available in eGovPH Mobile ID wallet', source: 'Bureau of Internal Revenue', date: 'Aug 20, 2026', category: 'Service Update', emoji: '🆔' },
  { id: 3, title: 'Republic Act 12254: E-Governance Act signed into law', source: 'Official Gazette', date: 'Apr 12, 2026', category: 'Policy', emoji: '📜' },
  { id: 4, title: 'DICT expands eGovPH to cover 1,000+ government services', source: 'DICT', date: 'Mar 5, 2026', category: 'eGovPH Update', emoji: '🏛️' },
  { id: 5, title: 'PhilHealth contribution rates update effective January 2026', source: 'PhilHealth', date: 'Jan 1, 2026', category: 'Advisory', emoji: '❤️' },
  { id: 6, title: 'PSA issues advisory on proper use of digital National ID', source: 'Philippine Statistics Authority', date: 'Dec 10, 2025', category: 'Advisory', emoji: '🪪' },
];

export function NewsScreen() {
  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="News" />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Newspaper size={20} className="text-primary" />
          <h1 className="text-h2 font-bold text-text-primary">Government News</h1>
        </div>
        {NEWS.map((item, i) => (
          <button key={item.id} className="w-full bg-white rounded-lg border border-border p-4 text-left hover:shadow-card-hover hover:border-primary/20 transition-all">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center text-xl shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs bg-bg text-text-secondary px-2 py-0.5 rounded-full">{item.category}</span>
                <p className="text-body font-semibold text-text-primary mt-1 leading-tight">{item.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-body-sm text-text-secondary">{item.source}</p>
                  <span className="text-text-secondary">·</span>
                  <p className="text-body-sm text-text-secondary">{item.date}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </ScreenContainer>
    </div>
  );
}
