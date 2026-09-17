import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './state/AuthContext';
import { ServiceProvider } from './state/ServiceContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ServiceProvider>
          <div className="phone-frame">
            <App />
          </div>
        </ServiceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
