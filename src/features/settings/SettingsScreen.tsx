/**
 * SettingsScreen — App settings
 */
import React from 'react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

export function SettingsScreen() {
  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Settings" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-4">
        <h1 className="text-h1 font-bold text-text-primary">Settings</h1>
        
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Account</p>
            <div className="bg-white border border-border rounded-lg divide-y divide-border">
              {['Change Email', 'Change MPIN', 'Update Mobile Number'].map(item => (
                <button key={item} className="w-full text-left px-4 py-3 text-body font-semibold text-text-primary hover:bg-bg transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Preferences</p>
            <div className="bg-white border border-border rounded-lg divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-body font-semibold text-text-primary">Language</span>
                <span className="text-body-sm text-text-secondary">English</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-body font-semibold text-text-primary">Push Notifications</span>
                <div className="w-12 h-6 bg-success rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-body font-semibold text-text-primary">Dark Mode</span>
                <span className="text-body-sm text-text-secondary">System</span>
              </div>
            </div>
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
}
