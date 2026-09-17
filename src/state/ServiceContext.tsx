import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WeatherData {
  temp: number;
  condition: string;
  isNight: boolean;
  hourly: { time: string; temp: number; code: number }[];
  daily: { day: string; high: number; low: number; code: number }[];
}

export interface SpeedData {
  downlink: number | null;
  rtt: number | null;
}

interface ServiceContextType {
  weather: WeatherData | null;
  speed: SpeedData;
  refreshWeather: () => Promise<void>;
  refreshSpeed: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [speed, setSpeed] = useState<SpeedData>({ downlink: null, rtt: null });

  const refreshWeather = async () => {
    try {
      // Quezon City coordinates
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=14.6333&longitude=121.0333&current=temperature_2m,is_day,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore');
      const data = await res.json();
      
      const codes: Record<number, string> = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 71: 'Slight snow',
        80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
      };

      if (data.current && data.hourly && data.daily) {
        // Parse hourly (next 7 hours starting from current time)
        const currentHourIdx = data.hourly.time.findIndex((t: string) => t.startsWith(data.current.time.slice(0, 13)));
        const startIdx = currentHourIdx !== -1 ? currentHourIdx : 0;
        const nextHourly = [];
        for (let i = startIdx; i < startIdx + 7; i++) {
          const date = new Date(data.hourly.time[i]);
          let hours = date.getHours();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          
          nextHourly.push({
            time: `${hours} ${ampm}`,
            temp: Math.round(data.hourly.temperature_2m[i]),
            code: data.hourly.weather_code[i]
          });
        }

        // Parse daily (next 5 days)
        const nextDaily = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i < 5; i++) {
          const date = new Date(data.daily.time[i]);
          nextDaily.push({
            day: days[date.getDay()],
            high: Math.round(data.daily.temperature_2m_max[i]),
            low: Math.round(data.daily.temperature_2m_min[i]),
            code: data.daily.weather_code[i]
          });
        }

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          condition: codes[data.current.weather_code] || 'Unknown',
          isNight: data.current.is_day === 0,
          hourly: nextHourly,
          daily: nextDaily,
        });
      }
    } catch (err) {
      console.error('Failed to fetch weather', err);
    }
  };

  const refreshSpeed = () => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as any).connection;
      setSpeed({
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0,
      });
    } else {
      // Fallback
      setSpeed({ downlink: 25, rtt: 45 });
    }
  };

  useEffect(() => {
    refreshWeather();
    refreshSpeed();
  }, []);

  return (
    <ServiceContext.Provider value={{ weather, speed, refreshWeather, refreshSpeed }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) throw new Error('useServices must be used within a ServiceProvider');
  return context;
}
