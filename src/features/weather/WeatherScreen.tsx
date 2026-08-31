/**
 * WeatherScreen — current weather + PAGASA advisories (mock)
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

const WEATHER = {
  city: 'Quezon City', temp: 32, feelsLike: 36, condition: 'Partly Cloudy', humidity: 75, wind: 24, uv: 7,
  hourly: [
    { time: '1 PM', temp: 32, emoji: '⛅' }, { time: '2 PM', temp: 33, emoji: '🌤️' }, { time: '3 PM', temp: 33, emoji: '🌤️' },
    { time: '4 PM', temp: 31, emoji: '⛅' }, { time: '5 PM', temp: 30, emoji: '🌧️' }, { time: '6 PM', temp: 28, emoji: '🌧️' }, { time: '7 PM', temp: 27, emoji: '🌧️' },
  ],
  weekly: [
    { day: 'Mon', high: 33, low: 26, emoji: '☀️' }, { day: 'Tue', high: 32, low: 25, emoji: '⛅' }, { day: 'Wed', high: 29, low: 24, emoji: '🌧️' },
    { day: 'Thu', high: 30, low: 25, emoji: '⛅' }, { day: 'Fri', high: 33, low: 26, emoji: '☀️' },
  ],
};

const ADVISORIES = [
  { level: 'warning', title: 'INTERTROPICAL CONVERGENCE ZONE', body: 'Affecting eastern portions of the Visayas and Mindanao. Residents are advised to take precautionary measures.' },
  { level: 'info', title: 'WEATHER UPDATE 4:00 PM', body: 'The Philippine Area of Responsibility (PAR) is currently clear. Isolated rain showers expected over Metro Manila this afternoon.' },
];

export function WeatherScreen() {
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const convert = (c: number) => unit === 'C' ? c : Math.round(c * 9 / 5 + 32);

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Weather" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer noPadding className="gap-0">
        {/* Hero */}
        <div className="bg-gradient-to-b from-[#0284C7] to-[#38BDF8] px-4 pt-6 pb-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70 text-body-sm">📍 {WEATHER.city}</p>
              <p className="text-6xl font-bold mt-1">{convert(WEATHER.temp)}°</p>
              <p className="text-xl text-white/80">{WEATHER.condition}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-6xl" aria-hidden="true">⛅</span>
              <div className="flex gap-1 bg-white/20 rounded-full p-0.5">
                {(['C', 'F'] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${unit === u ? 'bg-white text-[#0284C7]' : 'text-white/80'}`}>{u}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            {[['Feels like', `${convert(WEATHER.feelsLike)}°`], ['Humidity', `${WEATHER.humidity}%`], ['Wind', `${WEATHER.wind} km/h`], ['UV', WEATHER.uv]].map(([k, v]) => (
              <div key={String(k)}>
                <p className="text-white/60 text-xs">{k}</p>
                <p className="text-white font-semibold text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pt-4 flex flex-col gap-5 pb-4">
          {/* Hourly */}
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Hourly Forecast</p>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {WEATHER.hourly.map(h => (
                <div key={h.time} className="flex flex-col items-center gap-1 bg-white border border-border rounded-lg p-3 shrink-0 min-w-[58px]">
                  <span className="text-body-sm text-text-secondary">{h.time}</span>
                  <span className="text-xl" aria-hidden="true">{h.emoji}</span>
                  <span className="text-body-sm font-semibold text-text-primary">{convert(h.temp)}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly */}
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">5-Day Forecast</p>
            <div className="bg-white border border-border rounded-lg divide-y divide-border">
              {WEATHER.weekly.map(d => (
                <div key={d.day} className="flex items-center justify-between px-4 py-3">
                  <span className="text-body text-text-primary w-12">{d.day}</span>
                  <span className="text-xl" aria-hidden="true">{d.emoji}</span>
                  <div className="flex gap-3">
                    <span className="text-body font-semibold text-text-primary">{convert(d.high)}°</span>
                    <span className="text-body text-text-secondary">{convert(d.low)}°</span>
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

          <p className="text-xs text-text-secondary text-center">Source: PAGASA — Philippine Atmospheric, Geophysical and Astronomical Services Administration</p>
        </div>
      </ScreenContainer>
    </div>
  );
}
