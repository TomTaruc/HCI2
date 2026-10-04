/**
 * main.tsx — eGovPH HCI Prototype entry point
 *
 * Uses HashRouter so that GitHub Pages can serve deep links
 * without a rewrite-capable host. The Vite base path /HCI2/
 * applies to static assets only; all client routes are
 * resolved by the hash fragment (#/path).
 *
 * ACADEMIC PROTOTYPE — Not the real eGovPH application.
 * No real personal data is collected or processed.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './state/AuthContext';
import { ServiceProvider } from './state/ServiceContext';
import { ThemeProvider } from './state/ThemeContext';
import { LangProvider } from './state/LangContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <LangProvider>
          <AuthProvider>
            <ServiceProvider>
              <div className="phone-frame">
                <App />
              </div>
            </ServiceProvider>
          </AuthProvider>
        </LangProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
