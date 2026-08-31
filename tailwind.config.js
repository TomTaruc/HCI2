/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Override the ENTIRE default theme — no default Tailwind colors should leak through
  theme: {
    // Reset all colors — only our design tokens
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      primary: {
        DEFAULT: '#0038A8',
        dark: '#002D82',
        light: '#EAF0FB',
      },
      secondary: {
        DEFAULT: '#CE1126',
        dark: '#A50D1E',
      },
      accent: {
        DEFAULT: '#FCD116',
      },
      bg: {
        DEFAULT: '#F4F6FA',
      },
      surface: {
        DEFAULT: '#FFFFFF',
      },
      text: {
        primary: '#17203A',
        secondary: '#5B6478',
      },
      border: {
        DEFAULT: '#E4E8F0',
      },
      success: {
        DEFAULT: '#16A34A',
        light: '#DCFCE7',
      },
      warning: {
        DEFAULT: '#F59E0B',
        light: '#FEF3C7',
      },
      error: {
        DEFAULT: '#DC2626',
        light: '#FEE2E2',
      },
      verified: {
        DEFAULT: '#0038A8',
      },
      // Grays for utility (borders, disabled, etc.) but still named to avoid Tailwind defaults
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      // Custom type scale — matches Section 4.2 exactly
      'display': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
      'h1': ['22px', { lineHeight: '1.3', fontWeight: '700' }],
      'h2': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
      'body': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
      'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      'label': ['12px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.04em' }],
      'button': ['15px', { lineHeight: '1', fontWeight: '600' }],
      // Keep some utility sizes
      xs: ['11px', { lineHeight: '1.4' }],
      sm: ['13px', { lineHeight: '1.5' }],
      base: ['15px', { lineHeight: '1.6' }],
      lg: ['18px', { lineHeight: '1.4' }],
      xl: ['22px', { lineHeight: '1.3' }],
      '2xl': ['28px', { lineHeight: '1.2' }],
    },
    spacing: {
      // Design system spacing scale: 4/8/12/16/24/32 + utility values
      '0': '0px',
      '0.5': '2px',
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '11': '44px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
      '20': '80px',
      '24': '96px',
      '28': '112px',
      '32': '128px',
      '36': '144px',
      '40': '160px',
      '44': '176px',
      '48': '192px',
      '52': '208px',
      '56': '224px',
      '60': '240px',
      '64': '256px',
      '72': '288px',
      '80': '320px',
      '96': '384px',
      'px': '1px',
      'full': '100%',
      'screen': '100vh',
    },
    borderRadius: {
      'none': '0',
      'sm': '4px',
      'DEFAULT': '8px',
      'md': '12px',   // buttons, inputs
      'lg': '16px',   // cards, modals
      'xl': '20px',
      '2xl': '24px',
      'full': '9999px', // pills, badges
    },
    extend: {
      boxShadow: {
        // The one shadow used on cards — soft, not heavy
        'card': '0 1px 3px rgba(23,32,58,0.08)',
        'card-hover': '0 4px 12px rgba(23,32,58,0.12)',
        'bottom-nav': '0 -1px 0 #E4E8F0',
        'modal': '0 20px 60px rgba(23,32,58,0.20)',
      },
      maxWidth: {
        'app': '430px',
        'phone': '390px',
      },
      minHeight: {
        'touch': '44px',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'spin-slow': 'spin 2s linear infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      screens: {
        'xs': '360px',
        'sm': '430px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}
