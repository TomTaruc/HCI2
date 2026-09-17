/**
 * WeatherScreen — current weather + PAGASA advisories (syncs with live ServiceContext)
 */
import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, CloudDrizzle } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { useServices } from '../../state/ServiceContext';

const ADVISORIES = [
  { level: 'warning', title: 'INTERTROPICAL CONVERGENCE ZONE', body: 'Affecting eastern portions of the Visayas and Mindanao. Residents are advised to take precautionary measures.' },
  { level: 'info', title: 'WEATHER UPDATE 4:00 PM', body: 'The Philippine Area of Responsibility (PAR) is currently clear. Isolated rain showers expected over Metro Manila this afternoon.' },
];

export function getWeatherIcon(code: number, className = "text-white") {
  // Map WMO weather codes to Lucide icons
  if (code === 0 || code === 1) return <Sun className={className} />;
  if (code === 2 || code === 3) return <Cloud className={className} />;
  if (code >= 45 && code <= 48) return <CloudFog className={className} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className={className} />;
  if (code >= 61 && code <= 65) return <CloudRain className={className} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={className} />;
  if (code >= 80 && code <= 82) return <CloudRain className={className} />;
  if (code >= 95 && code <= 99) return <CloudLightning className={className} />;
  return <Sun className={className} />;
}

export function WeatherScreen() {
  const { weather, refreshWeather } = useServices();
  
  if (!weather) {
    return (
      <div className="flex-1 flex flex-col">
        <AppBar title="Weather" showBack />
        <div className="flex-1 flex items-center justify-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Weather" showBack rightContent={
        <button onClick={refreshWeather} className="text-xs text-primary font-semibold mr-2">Refresh</button>
      } />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer noPadding className="gap-0">
        {/* Hero */}
        <div className="bg-gradient-to-b from-[#0284C7] to-[#38BDF8] px-4 pt-6 pb-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70 text-body-sm">📍 Quezon City</p>
              <p className="text-6xl font-bold mt-1">{weather.temp}°</p>
              <p className="text-xl text-white/80">{weather.condition}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="mt-2 opacity-90 scale-150 transform origin-right">
                 {getWeatherIcon(weather.hourly[0]?.code ?? 0, "text-white w-12 h-12")}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 flex flex-col gap-5 pb-4">
          {/* Hourly */}
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Hourly Forecast</p>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {weather.hourly.map(h => (
                <div key={h.time} className="flex flex-col items-center gap-2 bg-white border border-border rounded-lg p-3 shrink-0 min-w-[64px]">
                  <span className="text-xs text-text-secondary">{h.time}</span>
                  {getWeatherIcon(h.code, "text-text-primary w-6 h-6")}
                  <span className="text-body-sm font-semibold text-text-primary">{h.temp}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly */}
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">5-Day Forecast</p>
            <div className="bg-white border border-border rounded-lg divide-y divide-border">
              {weather.daily.map(d => (
                <div key={d.day} className="flex items-center justify-between px-4 py-3">
                  <span className="text-body text-text-primary w-12">{d.day}</span>
                  {getWeatherIcon(d.code, "text-text-secondary w-5 h-5")}
                  <div className="flex gap-3 w-16 justify-end">
                    <span className="text-body font-semibold text-text-primary">{d.high}°</span>
                    <span className="text-body text-text-secondary">{d.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PAGASA Advisories */}
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">PAGASA Advisories</p>
            {ADVISORIES.map(a => (
              <div key={a.title} className={`rounded-lg p-4 mb-2 border ${a.level === 'warning' ? 'bg-warning/10 border-warning/30' : 'bg-primary-light border-primary/20'}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${a.level === 'warning' ? 'text-warning' : 'text-primary'}`}>{a.title}</p>
                <p className="text-body-sm text-text-primary">{a.body}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-text-secondary text-center">Source: Open-Meteo & PAGASA Mock</p>
        </div>
      </ScreenContainer>
    </div>
  );
}
