/**
 * BottomNav — eGovPH layout component
 * 5 tabs: Home · News · Mobile ID (center FAB) · Scan QR · Account
 * Matches the layout observed in the provided app screenshots
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Newspaper, ScanLine, User } from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  isFab?: boolean;
}

export function BottomNav() {
  const { user, sessionStatus } = useAuth();
  const location = useLocation();

  // Only show bottom nav when logged in AND session is not locked
  if (!user || sessionStatus === 'locked') return null;

  // Don't show on auth flows or full-screen views
  const hideOn = ['/splash', '/welcome', '/register', '/login', '/verify/liveness', '/id/qr'];
  if (hideOn.some(p => location.pathname.startsWith(p))) return null;

  const navItems: NavItem[] = [
    {
      path: '/home',
      label: 'Home',
      icon: <Home size={22} strokeWidth={1.5} />,
      activeIcon: <Home size={22} strokeWidth={2.5} />,
    },
    {
      path: '/news',
      label: 'News',
      icon: <Newspaper size={22} strokeWidth={1.5} />,
      activeIcon: <Newspaper size={22} strokeWidth={2.5} />,
    },
    {
      path: '/mobile-id',
      label: 'Mobile ID',
      icon: null,
      isFab: true,
    },
    {
      path: '/scan',
      label: 'Scan QR',
      icon: <ScanLine size={22} strokeWidth={1.5} />,
      activeIcon: <ScanLine size={22} strokeWidth={2.5} />,
    },
    {
      path: '/account',
      label: 'Account',
      icon: <User size={22} strokeWidth={1.5} />,
      activeIcon: <User size={22} strokeWidth={2.5} />,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-full md:max-w-[768px] bg-white border-t border-border bottom-safe z-50"
      aria-label="Main navigation"
    >
      <div className="flex items-end justify-around h-16 px-2">
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.path);

          if (item.isFab) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 -mt-5 relative"
                aria-label="Mobile ID"
              >
                <div className={[
                  'w-14 h-14 rounded-full flex items-center justify-center',
                  'shadow-modal transition-all duration-150',
                  isActive
                    ? 'bg-primary-dark scale-105'
                    : 'bg-primary',
                ].join(' ')}>
                  {/* ID Card icon */}
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <circle cx="8" cy="11" r="2" />
                    <path d="M14 9h4M14 13h4M4 17c0-2 1.5-3 4-3s4 1 4 3" />
                  </svg>
                </div>
                <span className={[
                  'text-xs font-semibold',
                  isActive ? 'text-primary' : 'text-text-secondary',
                ].join(' ')}>
                  Mobile ID
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-0.5 h-full flex-1 min-w-0 relative"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={[
                'transition-colors duration-150',
                isActive ? 'text-primary' : 'text-text-secondary',
              ].join(' ')}>
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
              </span>
              <span className={[
                'text-xs font-semibold truncate',
                isActive ? 'text-primary' : 'text-text-secondary',
              ].join(' ')}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-primary rounded-full" aria-hidden="true" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
