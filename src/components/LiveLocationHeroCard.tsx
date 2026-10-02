import React from 'react';
import {
  MapPin,
  RotateCw,
  Radio,
  Thermometer,
  Droplets,
  AlertTriangle,
  Sparkles,
  Flame,
} from 'lucide-react';
import { WeatherData, PredictionResult, TemperatureUnit } from '../types';
import { celsiusToFahrenheit } from '../services/heatIndexCalculator';

interface LiveLocationHeroCardProps {
  weather: WeatherData;
  prediction: PredictionResult;
  unit: TemperatureUnit;
  secondsUntilNextRefresh: number;
  isRefreshing: boolean;
  onRefreshNow: () => void;
  isGpsActive: boolean;
  onSelectLocation?: (tempC: number, rh: number, name: string) => void;
}

export const LiveLocationHeroCard: React.FC<LiveLocationHeroCardProps> = ({
  weather,
  prediction,
  unit,
  secondsUntilNextRefresh,
  isRefreshing,
  onRefreshNow,
  isGpsActive,
  onSelectLocation,
}) => {
  const displayTemp =
    unit === 'C'
      ? weather.temperature
      : Math.round(celsiusToFahrenheit(weather.temperature) * 10) / 10;

  // Exact location title as requested or detected
  const locationTitle = weather.locationName || 'Bada Raghunathpur, Bhubaneswar';

  // Badge styles according to risk
  const riskTheme = {
    LOW: {
      cardBorder: 'border-emerald-500/50 shadow-emerald-950/40',
      badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500',
      glow: 'from-emerald-500/20 via-slate-900/90 to-slate-950',
      tagColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-600',
    },
    MODERATE: {
      cardBorder: 'border-amber-500/50 shadow-amber-950/40',
      badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-500',
      glow: 'from-amber-500/20 via-slate-900/90 to-slate-950',
      tagColor: 'text-amber-400 bg-amber-950/70 border-amber-600',
    },
    HIGH: {
      cardBorder: 'border-orange-500/60 shadow-orange-950/60 ring-2 ring-orange-500/20',
      badgeBg: 'bg-orange-950/95 text-orange-200 border-orange-500',
      glow: 'from-orange-500/25 via-slate-900/95 to-slate-950',
      tagColor: 'text-orange-300 bg-orange-950/80 border-orange-500',
    },
    SEVERE: {
      cardBorder: 'border-rose-600 shadow-rose-950/70 ring-4 ring-rose-500/30 animate-pulse',
      badgeBg: 'bg-rose-950 text-rose-200 border-rose-500 animate-pulse',
      glow: 'from-rose-600/30 via-slate-900 to-slate-950',
      tagColor: 'text-rose-300 bg-rose-950 border-rose-600',
    },
  }[prediction.riskLevel];

  return (
    <div className="w-full relative my-2">
      {/* Dynamic Solar Glow Backdrop positioned directly in front of the 3D Sun */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-rose-500/20 rounded-3xl blur-2xl opacity-75 pointer-events-none" />

      {/* Main Big Glowing Card */}
      <div
        className={`relative bg-gradient-to-r ${riskTheme.glow} backdrop-blur-2xl border-2 ${riskTheme.cardBorder} rounded-3xl p-6 sm:p-7 shadow-2xl transition-all overflow-hidden`}
      >
        {/* Subtle decorative radiant rays in the card background */}
        <div className="absolute top-0 right-0 w-80 h-48 bg-gradient-to-bl from-amber-400/15 via-orange-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Main Visual Display */}
          <div className="space-y-3">
            {/* Header: Location with LIVE Tag */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-mono font-black uppercase tracking-wider shadow-sm shadow-rose-500/30 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>LIVE</span>
              </span>

              {isGpsActive && (
                <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 border border-sky-700/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>GPS Device Synced</span>
                </span>
              )}

              <span className="text-xs font-mono text-slate-400">
                Timestamp: {weather.timestamp}
              </span>
            </div>

            {/* MANDATED FORMAT LINE 1:
                "📍 LIVE - Bada Raghunathpur, Bhubaneswar" */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-rose-500 text-2xl sm:text-3xl inline-block drop-shadow-md">📍</span>
              <span className="text-white drop-shadow-sm">LIVE - {locationTitle}</span>
            </h2>

            {/* MANDATED FORMAT LINE 2 & 3:
                "36°C | 72% RH"
                "Risk: HIGH" */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap pt-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-amber-300 tracking-tight drop-shadow-sm">
                  {displayTemp}°{unit}
                </span>
                <span className="text-2xl sm:text-3xl text-slate-600 font-light">|</span>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-sky-300">
                  {weather.humidity}% RH
                </span>
              </div>

              <div className="flex items-center gap-2 pl-0 sm:pl-2">
                <span className="text-sm sm:text-base font-bold text-slate-300 font-mono">Risk:</span>
                <span
                  className={`px-3.5 py-1 rounded-xl text-base sm:text-lg font-black font-mono border-2 shadow-md ${riskTheme.badgeBg}`}
                >
                  {prediction.riskLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action & Diagnostics Console */}
          <div className="flex flex-col sm:items-end justify-between gap-4">
            {/* Quick Metrics Capsule */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:text-right space-y-1 w-full sm:w-auto">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Feels Like (Heat Index)
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                {weather.heatIndex}°C
              </div>
              <div className="text-[10px] text-slate-400">
                Wet-Bulb: <strong className="text-slate-200">{weather.wetBulb}°C</strong>
              </div>
            </div>

            {/* Manual Sync Trigger */}
            <button
              type="button"
              onClick={onRefreshNow}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-100 text-xs font-bold transition-all shadow-md disabled:opacity-60 whitespace-nowrap"
            >
              <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Sensor Telemetry'}</span>
            </button>
          </div>
        </div>

        {/* Quick Hotspot Switcher (e.g. Jatani 42.5°C, Bhubaneswar 36°C) */}
        {onSelectLocation && (
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
              <span>⚡ Live Hotspots:</span>
            </span>
            <button
              type="button"
              onClick={() => onSelectLocation(42.5, 68, 'Jatani, Odisha')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                weather.locationName.includes('Jatani')
                  ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                  : 'bg-slate-950/80 text-rose-300 border-rose-900/60 hover:bg-slate-800'
              }`}
            >
              🔥 Jatani: 42.5°C
            </button>
            <button
              type="button"
              onClick={() => onSelectLocation(36, 72, 'Bada Raghunathpur, Bhubaneswar')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                weather.locationName.includes('Bhubaneswar')
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-950/80 text-amber-300 border-amber-900/60 hover:bg-slate-800'
              }`}
            >
              📍 Bhubaneswar: 36°C
            </button>
            <button
              type="button"
              onClick={() => onSelectLocation(41, 62, 'Bhanjanagar, Odisha')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                weather.locationName.includes('Bhanjanagar')
                  ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-sm'
                  : 'bg-slate-950/80 text-orange-300 border-orange-900/60 hover:bg-slate-800'
              }`}
            >
              ☀️ Bhanjanagar: 41°C
            </button>
          </div>
        )}

        {/* MANDATED REQUIREMENT 6:
            Small text below card: "Detected automatically • Updates every 30 sec" with blinking dot */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {/* Blinking Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium text-slate-300">
              Detected automatically • Updates every 30 sec
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Next auto-poll in: <strong className="text-amber-400">{secondsUntilNextRefresh}s</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
