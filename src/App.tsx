/**
 * App.tsx — Root routing for eGovPH HCI Prototype
 * 
 * Routes are organized by auth state:
 * - Public routes (no auth required): splash, welcome, register, etravel
 * - Protected routes (auth required): home, mobile-id, agencies, account
 * 
 * Session-locked state shows the MPIN re-entry screen inline.
 */

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './state/AuthContext';
import { BottomNav } from './components/layout/BottomNav';
import { db } from './mock/db';

// Auth & Onboarding
import { SplashScreen } from './features/auth/SplashScreen';
import { WelcomeScreen } from './features/auth/WelcomeScreen';
import { RegisterMobileScreen } from './features/auth/RegisterMobileScreen';
import { RegisterOTPScreen } from './features/auth/RegisterOTPScreen';
import { RegisterMPINScreen } from './features/auth/RegisterMPINScreen';
import { RegisterProfileScreen } from './features/auth/RegisterProfileScreen';
import { RegisterEmailVerifyScreen } from './features/auth/RegisterEmailVerifyScreen';
import { LoginMPINScreen } from './features/auth/LoginMPINScreen';
import { ForgotMPINScreen } from './features/auth/ForgotMPINScreen';
import { DisclaimerModal } from './features/auth/DisclaimerModal';

// Verification (Tier 1 — Flow A)
import { VerifyIntroScreen } from './features/verification/VerifyIntroScreen';
import { VerifyPersonalInfoScreen } from './features/verification/VerifyPersonalInfoScreen';
import { VerifyPCNScreen } from './features/verification/VerifyPCNScreen';
import { VerifyLivenessScreen } from './features/verification/VerifyLivenessScreen';
import { VerifyPendingScreen } from './features/verification/VerifyPendingScreen';
import { VerifySuccessScreen } from './features/verification/VerifySuccessScreen';

// Home
import { HomeScreen } from './features/home/HomeScreen';
import { NotificationsScreen } from './features/home/NotificationsScreen';
import { SearchScreen } from './features/home/SearchScreen';
import { NewsScreen } from './features/home/NewsScreen';
import { TourismScreen } from './features/home/TourismScreen';

// Mobile ID (Tier 1 — Flow B)
import { IDWalletScreen } from './features/mobile-id/IDWalletScreen';
import { IDDetailScreen } from './features/mobile-id/IDDetailScreen';
import { IDQRShareScreen } from './features/mobile-id/IDQRShareScreen';

// Agencies / NGAs (Tier 1 — Flow C)
import { NGAsDirectoryScreen } from './features/agencies/NGAsDirectoryScreen';
import { AgencyDetailScreen } from './features/agencies/AgencyDetailScreen';
import { LGUScreen } from './features/agencies/LGUScreen';

// Services Hub
import { ServicesHubScreen } from './features/services/ServicesHubScreen';
import { BPESHScreen } from './features/bpesh/BPESHScreen';
import { AppointmentBookingScreen } from './features/bpesh/AppointmentBookingScreen';
import { PSADocumentScreen } from './features/bpesh/PSADocumentScreen';
import { ETravelScreen } from './features/etravel/ETravelScreen';
import { ConsultationScreen } from './features/consultation/ConsultationScreen';
import { EmploymentScreen } from './features/employment/EmploymentScreen';
import { EReportScreen } from './features/ereport/EReportScreen';
import { EGovPayScreen } from './features/egovpay/EGovPayScreen';
import { EGovAIScreen } from './features/egov-ai/EGovAIScreen';
import { WeatherScreen } from './features/weather/WeatherScreen';
import { SpeedTestScreen } from './features/speedtest/SpeedTestScreen';
import { ScanQRScreen } from './features/services/ScanQRScreen';

// Account / Settings
import { AccountScreen } from './features/settings/AccountScreen';
import { ProfileScreen } from './features/settings/ProfileScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { AboutScreen } from './features/settings/AboutScreen';
import { ResearchToolsScreen } from './features/settings/ResearchToolsScreen';
import { SessionLockedScreen } from './features/auth/SessionLockedScreen';

// ----------------------------------------------------------------
// Protected Route wrapper
// ----------------------------------------------------------------

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, sessionStatus, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/welcome" replace />;
  if (sessionStatus === 'locked') return <SessionLockedScreen />;

  return <>{children}</>;
}

// ----------------------------------------------------------------
// App
// ----------------------------------------------------------------

export function App() {
  const { user, isLoading } = useAuth();
  const [showDisclaimer, setShowDisclaimer] = React.useState(false);

  useEffect(() => {
    const shown = db.get<boolean>('disclaimerShown');
    if (!shown) setShowDisclaimer(true);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      {showDisclaimer && (
        <DisclaimerModal onClose={() => {
          db.set('disclaimerShown', true);
          setShowDisclaimer(false);
        }} />
      )}

      <Routes>
        {/* Public / Auth */}
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/register/mobile" element={<RegisterMobileScreen />} />
        <Route path="/register/otp" element={<RegisterOTPScreen />} />
        <Route path="/register/mpin" element={<RegisterMPINScreen />} />
        <Route path="/register/profile" element={<RegisterProfileScreen />} />
        <Route path="/register/email-verify" element={<RegisterEmailVerifyScreen />} />
        <Route path="/login" element={<LoginMPINScreen />} />
        <Route path="/forgot-mpin" element={<ForgotMPINScreen />} />

        {/* eTravel — accessible without login per spec */}
        <Route path="/etravel" element={<ETravelScreen />} />

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/home/tourism" element={<ProtectedRoute><TourismScreen /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><NewsScreen /></ProtectedRoute>} />

        {/* Verification — Flow A */}
        <Route path="/verify" element={<ProtectedRoute><VerifyIntroScreen /></ProtectedRoute>} />
        <Route path="/verify/personal-info" element={<ProtectedRoute><VerifyPersonalInfoScreen /></ProtectedRoute>} />
        <Route path="/verify/pcn" element={<ProtectedRoute><VerifyPCNScreen /></ProtectedRoute>} />
        <Route path="/verify/liveness" element={<ProtectedRoute><VerifyLivenessScreen /></ProtectedRoute>} />
        <Route path="/verify/pending" element={<ProtectedRoute><VerifyPendingScreen /></ProtectedRoute>} />
        <Route path="/verify/success" element={<ProtectedRoute><VerifySuccessScreen /></ProtectedRoute>} />

        {/* Mobile ID — Flow B */}
        <Route path="/mobile-id" element={<ProtectedRoute><IDWalletScreen /></ProtectedRoute>} />
        <Route path="/mobile-id/:idType" element={<ProtectedRoute><IDDetailScreen /></ProtectedRoute>} />
        <Route path="/id/qr/:idType" element={<ProtectedRoute><IDQRShareScreen /></ProtectedRoute>} />

        {/* NGAs / Agencies — Flow C */}
        <Route path="/agencies" element={<ProtectedRoute><NGAsDirectoryScreen /></ProtectedRoute>} />
        <Route path="/agencies/:agencyId" element={<ProtectedRoute><AgencyDetailScreen /></ProtectedRoute>} />
        <Route path="/lgu" element={<ProtectedRoute><LGUScreen /></ProtectedRoute>} />

        {/* Services Hub */}
        <Route path="/services" element={<ProtectedRoute><ServicesHubScreen /></ProtectedRoute>} />
        <Route path="/bpesh" element={<ProtectedRoute><BPESHScreen /></ProtectedRoute>} />
        <Route path="/bpesh/appointment" element={<ProtectedRoute><AppointmentBookingScreen /></ProtectedRoute>} />
        <Route path="/bpesh/psa" element={<ProtectedRoute><PSADocumentScreen /></ProtectedRoute>} />
        <Route path="/consultation" element={<ProtectedRoute><ConsultationScreen /></ProtectedRoute>} />
        <Route path="/employment" element={<ProtectedRoute><EmploymentScreen /></ProtectedRoute>} />
        <Route path="/ereport" element={<ProtectedRoute><EReportScreen /></ProtectedRoute>} />
        <Route path="/egovpay" element={<ProtectedRoute><EGovPayScreen /></ProtectedRoute>} />
        <Route path="/egov-ai" element={<ProtectedRoute><EGovAIScreen /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><WeatherScreen /></ProtectedRoute>} />
        <Route path="/speedtest" element={<ProtectedRoute><SpeedTestScreen /></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute><ScanQRScreen /></ProtectedRoute>} />

        {/* Account */}
        <Route path="/account" element={<ProtectedRoute><AccountScreen /></ProtectedRoute>} />
        <Route path="/account/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/account/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
        <Route path="/account/about" element={<ProtectedRoute><AboutScreen /></ProtectedRoute>} />
        <Route path="/account/research-tools" element={<ProtectedRoute><ResearchToolsScreen /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={user ? '/home' : '/splash'} replace />} />
        <Route path="*" element={<Navigate to={user ? '/home' : '/splash'} replace />} />
      </Routes>

      <BottomNav />
    </>
  );
}

// ----------------------------------------------------------------
// Loading Screen
// ----------------------------------------------------------------

function LoadingScreen() {
  return (
    <div className="flex-1 flex items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-4">
        <svg width="60" height="60" viewBox="0 0 30 30" fill="none" aria-label="eGovPH loading">
          <circle cx="15" cy="15" r="14" fill="white" opacity="0.2" />
          <circle cx="15" cy="15" r="7" fill="#FCD116" />
          <circle cx="15" cy="15" r="4" fill="#0038A8" />
        </svg>
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
      </div>
    </div>
  );
}
