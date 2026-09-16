/**
 * AccountScreen — Account tab hub
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, Settings, Info, FlaskConical, LogOut, ShieldCheck } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Badge } from '../../components/ui/Card';
import { useAuth } from '../../state/AuthContext';

export function AccountScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';

  const menuItems = [
    { icon: User, label: 'View Profile', sub: 'Personal info, contact details', path: '/account/profile' },
    { icon: ShieldCheck, label: 'Account Verification', sub: isVerified ? 'Verified account' : 'Verify to unlock all services', path: isVerified ? '/verify/success' : '/verify', badge: isVerified ? '✓ Verified' : 'Action needed' },
    { icon: Settings, label: 'Settings', sub: 'Security, language, notifications', path: '/account/settings' },
    { icon: Info, label: 'About eGovPH', sub: 'Disclaimer, version, credits', path: '/account/about' },
    { icon: FlaskConical, label: 'Research Tools', sub: 'Seed data, toggle states, research controls', path: '/account/research-tools' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Account" />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
        {/* Profile card */}
        <div className="bg-primary rounded-lg p-5 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-h1">{(user?.firstName ?? 'U')[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-h2 truncate">{user?.fullName}</p>
            <p className="text-white/70 text-body-sm truncate">{user?.mobileNumber}</p>
            <div className="mt-1">
              {isVerified
                ? <Badge variant="success" className="text-xs">✓ Verified</Badge>
                : <Badge variant="warning" className="text-xs">⚠ Unverified</Badge>}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-lg border border-border divide-y divide-border">
          {menuItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-bg transition-colors">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                <item.icon size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-body font-semibold text-text-primary">{item.label}</p>
                  {item.badge && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isVerified && item.badge?.startsWith('✓') ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'}`}>{item.badge}</span>}
                </div>
                <p className="text-body-sm text-text-secondary">{item.sub}</p>
              </div>
              <ChevronRight size={18} className="text-text-secondary shrink-0" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 h-12 border border-error/30 rounded-lg text-error font-semibold hover:bg-error/5 transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </button>

        <p className="text-center text-xs text-text-secondary">
          eGovPH Research Prototype v1.0.0 · Not the real eGovPH
        </p>
      </ScreenContainer>
    </div>
  );
}
