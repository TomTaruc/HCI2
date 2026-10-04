/**
 * LangContext — eGovPH HCI Prototype
 *
 * Provides English and Filipino (Tagalog) language support.
 * The selected language is persisted to localStorage and
 * restored on reload.
 *
 * DEMO ONLY — academic prototype.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';

// ----------------------------------------------------------------
// Supported locales
// ----------------------------------------------------------------

export type Locale = 'en' | 'fil';

// ----------------------------------------------------------------
// Translation strings
// ----------------------------------------------------------------

export type TranslationKey =
  // Navigation
  | 'nav.home'
  | 'nav.mobileId'
  | 'nav.agencies'
  | 'nav.services'
  | 'nav.account'
  // Common actions
  | 'action.continue'
  | 'action.confirm'
  | 'action.cancel'
  | 'action.back'
  | 'action.retry'
  | 'action.done'
  | 'action.submit'
  | 'action.save'
  | 'action.edit'
  | 'action.delete'
  | 'action.search'
  | 'action.login'
  | 'action.logout'
  | 'action.signup'
  | 'action.verify'
  // Auth
  | 'auth.mobileNumber'
  | 'auth.mpin'
  | 'auth.enterMPIN'
  | 'auth.welcomeBack'
  | 'auth.newUser'
  | 'auth.forgotMPIN'
  | 'auth.biometric'
  // Home
  | 'home.greeting'
  | 'home.searchPlaceholder'
  | 'home.allServices'
  | 'home.featuredServices'
  | 'home.popularDestinations'
  | 'home.verifyBanner'
  // Verification
  | 'verify.title'
  | 'verify.personalInfo'
  | 'verify.pcn'
  | 'verify.liveness'
  | 'verify.pending'
  | 'verify.success'
  // Settings
  | 'settings.title'
  | 'settings.account'
  | 'settings.preferences'
  | 'settings.changeMPIN'
  | 'settings.changeEmail'
  | 'settings.updateMobile'
  | 'settings.language'
  | 'settings.appearance'
  | 'settings.notifications'
  | 'settings.light'
  | 'settings.dark'
  | 'settings.system'
  | 'settings.english'
  | 'settings.filipino'
  // Errors
  | 'error.networkError'
  | 'error.tryAgain'
  | 'error.sessionExpired'
  // Disclaimer
  | 'disclaimer.title'
  | 'disclaimer.body'
  | 'disclaimer.understand';

type Translations = Record<TranslationKey, string>;

const EN: Translations = {
  // Navigation
  'nav.home': 'Home',
  'nav.mobileId': 'Mobile ID',
  'nav.agencies': 'Agencies',
  'nav.services': 'Services',
  'nav.account': 'Account',
  // Common actions
  'action.continue': 'Continue',
  'action.confirm': 'Confirm',
  'action.cancel': 'Cancel',
  'action.back': 'Back',
  'action.retry': 'Try Again',
  'action.done': 'Done',
  'action.submit': 'Submit',
  'action.save': 'Save',
  'action.edit': 'Edit',
  'action.delete': 'Delete',
  'action.search': 'Search',
  'action.login': 'Log In',
  'action.logout': 'Log Out',
  'action.signup': 'Create Account',
  'action.verify': 'Verify',
  // Auth
  'auth.mobileNumber': 'Mobile Number',
  'auth.mpin': 'MPIN',
  'auth.enterMPIN': 'Enter your 6-digit MPIN',
  'auth.welcomeBack': 'Welcome back',
  'auth.newUser': 'New to eGovPH?',
  'auth.forgotMPIN': 'Forgot MPIN?',
  'auth.biometric': 'Use Biometric',
  // Home
  'home.greeting': 'Mabuhay',
  'home.searchPlaceholder': 'Search government services',
  'home.allServices': 'All Services',
  'home.featuredServices': 'Featured eGov Services',
  'home.popularDestinations': 'Popular Destinations',
  'home.verifyBanner': 'Verify account to unlock all services',
  // Verification
  'verify.title': 'Verify Account',
  'verify.personalInfo': 'Personal Information',
  'verify.pcn': 'PhilSys Card Number',
  'verify.liveness': 'Liveness Check',
  'verify.pending': 'Verification Pending',
  'verify.success': 'Verified!',
  // Settings
  'settings.title': 'Settings',
  'settings.account': 'Account',
  'settings.preferences': 'Preferences',
  'settings.changeMPIN': 'Change MPIN',
  'settings.changeEmail': 'Change Email',
  'settings.updateMobile': 'Update Mobile Number',
  'settings.language': 'Language',
  'settings.appearance': 'Appearance',
  'settings.notifications': 'Push Notifications',
  'settings.light': 'Light',
  'settings.dark': 'Dark',
  'settings.system': 'System',
  'settings.english': 'English',
  'settings.filipino': 'Filipino',
  // Errors
  'error.networkError': 'A network error occurred. Please try again.',
  'error.tryAgain': 'Please try again.',
  'error.sessionExpired': 'Your session has expired. Please log in again.',
  // Disclaimer
  'disclaimer.title': 'Academic Prototype',
  'disclaimer.body':
    'This is an academic research prototype of eGovPH. It is NOT the official eGovPH application. No real government data, payments, or official transactions are processed. All data is synthetic and stored locally in your browser.',
  'disclaimer.understand': 'I Understand',
};

const FIL: Translations = {
  // Navigation
  'nav.home': 'Tahanan',
  'nav.mobileId': 'Mobile ID',
  'nav.agencies': 'Mga Ahensya',
  'nav.services': 'Mga Serbisyo',
  'nav.account': 'Account',
  // Common actions
  'action.continue': 'Magpatuloy',
  'action.confirm': 'Kumpirmahin',
  'action.cancel': 'Kanselahin',
  'action.back': 'Bumalik',
  'action.retry': 'Subukan Ulit',
  'action.done': 'Tapos',
  'action.submit': 'Isumite',
  'action.save': 'I-save',
  'action.edit': 'I-edit',
  'action.delete': 'Burahin',
  'action.search': 'Maghanap',
  'action.login': 'Mag-login',
  'action.logout': 'Mag-logout',
  'action.signup': 'Gumawa ng Account',
  'action.verify': 'I-verify',
  // Auth
  'auth.mobileNumber': 'Numero ng Cellphone',
  'auth.mpin': 'MPIN',
  'auth.enterMPIN': 'Ilagay ang iyong 6-digit na MPIN',
  'auth.welcomeBack': 'Maligayang pagbabalik',
  'auth.newUser': 'Bago sa eGovPH?',
  'auth.forgotMPIN': 'Nakalimutan ang MPIN?',
  'auth.biometric': 'Gumamit ng Biometric',
  // Home
  'home.greeting': 'Mabuhay',
  'home.searchPlaceholder': 'Maghanap ng serbisyo ng gobyerno',
  'home.allServices': 'Lahat ng Serbisyo',
  'home.featuredServices': 'Mga Tampok na eGov Serbisyo',
  'home.popularDestinations': 'Mga Sikat na Destinasyon',
  'home.verifyBanner': 'I-verify ang account para i-unlock ang lahat ng serbisyo',
  // Verification
  'verify.title': 'I-verify ang Account',
  'verify.personalInfo': 'Personal na Impormasyon',
  'verify.pcn': 'PhilSys Card Number',
  'verify.liveness': 'Liveness Check',
  'verify.pending': 'Naka-pending ang Verification',
  'verify.success': 'Na-verify na!',
  // Settings
  'settings.title': 'Mga Setting',
  'settings.account': 'Account',
  'settings.preferences': 'Mga Kagustuhan',
  'settings.changeMPIN': 'Palitan ang MPIN',
  'settings.changeEmail': 'Palitan ang Email',
  'settings.updateMobile': 'I-update ang Numero ng Cellphone',
  'settings.language': 'Wika',
  'settings.appearance': 'Hitsura',
  'settings.notifications': 'Push Notifications',
  'settings.light': 'Maliwanag',
  'settings.dark': 'Madilim',
  'settings.system': 'Sistema',
  'settings.english': 'Ingles',
  'settings.filipino': 'Filipino',
  // Errors
  'error.networkError': 'May naganap na error sa network. Subukan ulit.',
  'error.tryAgain': 'Subukan ulit.',
  'error.sessionExpired': 'Nag-expire na ang iyong session. Mag-login ulit.',
  // Disclaimer
  'disclaimer.title': 'Pananaliksik na Prototype',
  'disclaimer.body':
    'Ito ay isang pananaliksik na prototype ng eGovPH. HINDI ito ang opisyal na eGovPH application. Walang tunay na datos ng gobyerno, pagbabayad, o opisyal na transaksyon ang pinoproseso. Lahat ng datos ay synthetic at naka-store nang lokal sa iyong browser.',
  'disclaimer.understand': 'Naiintindihan Ko',
};

const TRANSLATIONS: Record<Locale, Translations> = { en: EN, fil: FIL };

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------

interface LangContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = 'egov_locale';

function readStoredLocale(): Locale {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'en' || raw === 'fil') return raw;
  } catch {
    // ignore
  }
  return 'en';
}

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return TRANSLATIONS[locale][key] ?? TRANSLATIONS['en'][key] ?? key;
    },
    [locale]
  );

  return (
    <LangContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LangContext.Provider>
  );
}

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
