/**
 * AppBar — eGovPH layout component
 * Top navigation bar with back button, title, and optional right actions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';
import { db } from '../../mock/db';

interface AppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  transparent?: boolean;
  light?: boolean; // light text (for dark/image backgrounds)
  subtitle?: string;
}

export function AppBar({
  title,
  showBack = false,
  onBack,
  rightContent,
  transparent = false,
  light = false,
  subtitle,
}: AppBarProps) {
  const navigate = useNavigate();
  const notifications = db.get<{ read: boolean }[]>('notifications') ?? [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header
      className={[
        'flex items-center gap-3 px-4 pt-safe',
        'min-h-14 shrink-0 z-10',
        transparent ? 'bg-transparent' : 'bg-white border-b border-border',
      ].join(' ')}
    >
      {showBack && (
        <button
          onClick={handleBack}
          className={[
            'w-9 h-9 -ml-1 flex items-center justify-center rounded-full',
            'hover:bg-primary-light transition-colors',
            light ? 'text-white' : 'text-text-primary',
          ].join(' ')}
          aria-label="Go back"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
      )}

      {!showBack && !transparent && (
        /* eGovPH Logo mark */
        <div className="flex items-center gap-1">
          <EGovLogo />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <h1 className={[
            'font-semibold leading-tight truncate',
            showBack ? 'text-h2' : 'text-body',
            light ? 'text-white' : 'text-text-primary',
          ].join(' ')}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className={`text-body-sm truncate ${light ? 'text-white/80' : 'text-text-secondary'}`}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        {rightContent}
        {!showBack && (
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-primary-light transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell size={20} className="text-text-secondary" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 bg-secondary rounded-full text-white text-xs font-bold flex items-center justify-center"
                aria-hidden="true"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}

// ----------------------------------------------------------------
// eGovPH Logo — original SVG, not the real DICT trademark
// ----------------------------------------------------------------

function EGovLogo() {
  return (
    <div className="flex items-center gap-1.5">
      {/* Stylized sun-and-rays motif — original SVG, not the real government seal */}
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <circle cx="15" cy="15" r="14" fill="#0038A8" />
        <circle cx="15" cy="15" r="7" fill="#FCD116" />
        <circle cx="15" cy="15" r="4" fill="#0038A8" />
        {/* 8 rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 15 + 8 * Math.cos(rad);
          const y1 = 15 + 8 * Math.sin(rad);
          const x2 = 15 + 13 * Math.cos(rad);
          const y2 = 15 + 13 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#FCD116"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div>
        <span className="font-bold text-primary text-base leading-none tracking-tight">
          eGOV<span className="text-secondary">PH</span>
        </span>
        <div className="text-xs text-text-secondary leading-none font-medium tracking-wide">
          Beta
        </div>
      </div>
    </div>
  );
}
