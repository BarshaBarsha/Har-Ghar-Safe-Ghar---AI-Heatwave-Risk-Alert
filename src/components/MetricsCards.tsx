import React from 'react';
import {
  Thermometer,
  Droplets,
  MapPin,
  Activity,
  Flame,
  Radio,
  Clock,
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types';
import { celsiusToFahrenheit } from '../services/heatIndexCalculator';

interface MetricsCardsProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ weather, unit }) => {
  const displayTemp =
    unit === 'C'
      ? weather.temperature
      : Math.round(celsiusToFahrenheit(weather.temperature) * 10) / 10;

  const displayHeatIndex =
    unit === 'C'
      ? weather.heatIndex
      : Math.round(celsiusToFahrenheit(weather.heatIndex) * 10) / 10;

  const displayWetBulb =
    unit === 'C'
      ? weather.wetBulb
      : Math.round(celsiusToFahrenheit(weather.wetBulb) * 10) / 10;

  // Temperature color scale
  const tempThermalColor =
    weather.temperature >= 40
      ? 'text-rose-400'
      : weather.temperature >= 35
      ? 'text-orange-400'
      : weather.temperature >= 30
      ? 'text-amber-400'
      : 'text-emerald-400';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Location Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider">Location &amp; Station</span>
          <MapPin className="w-4 h-4 text-sky-400" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-100 line-clamp-1">
            {weather.locationName}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-mono">
            {weather.sourceDescription}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Radio className={`w-3 h-3 ${weather.isLive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{weather.isLive ? 'Live API Feed' : 'Calibrated Sim'}</span>
          </div>
          <div className="flex items-center gap-1 font-mono tabular-nums">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{weather.timestamp}</span>
          </div>
        </div>
      </div>

      {/* 2. Temperature Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider">Ambient Temperature</span>
          <Thermometer className="w-4 h-4 text-rose-400" />
        </div>

        <div className="my-1">
          <div className="flex items-baseline">
            <span className={`text-4xl font-extrabold font-mono tabular-nums ${tempThermalColor}`}>
              {displayTemp}
            </span>
            <span className="text-sm font-mono text-slate-400 uppercase ml-2">
              °{unit}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard dry-bulb reading
          </p>
        </div>

        {/* Visual Thermal Bar */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                weather.temperature >= 40
                  ? 'bg-rose-500'
                  : weather.temperature >= 35
                  ? 'bg-orange-500'
                  : weather.temperature >= 30
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{
                width: `${Math.min(100, Math.max(5, ((weather.temperature - 15) / 35) * 100))}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>15°C (Cool)</span>
            <span>50°C (Extreme)</span>
          </div>
        </div>
      </div>

      {/* 3. Humidity Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider">Relative Humidity</span>
          <Droplets className="w-4 h-4 text-sky-400" />
        </div>

        <div className="my-1">
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold font-mono tabular-nums text-sky-400">
              {weather.humidity}
            </span>
            <span className="text-sm font-mono text-slate-400 uppercase ml-2">
              % RH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dew point: <span className="text-slate-200 font-mono">{weather.dewPoint}°C</span>
          </p>
        </div>

        {/* Moisture progress bar */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-sky-500 transition-all duration-300"
              style={{ width: `${Math.max(2, Math.min(100, weather.humidity))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>0% (Dry)</span>
            <span className="text-sky-400/80">60%</span>
            <span>100% (Sat.)</span>
          </div>
        </div>
      </div>

      {/* 4. Apparent Heat Index & Wet-Bulb Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider">Apparent Thermal Load</span>
          <Flame className="w-4 h-4 text-amber-400" />
        </div>

        <div className="my-1">
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold font-mono tabular-nums text-amber-400">
              {displayHeatIndex}
            </span>
            <span className="text-sm font-mono text-slate-400 uppercase ml-2">
              °{unit} HI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            NOAA Rothfusz "Feels Like"
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Wet-Bulb (Twb):</span>
          <span className={`font-bold ${weather.wetBulb >= 30 ? 'text-rose-400' : 'text-slate-200'}`}>
            {displayWetBulb}°{unit}
          </span>
        </div>
      </div>
    </div>
  );
};
