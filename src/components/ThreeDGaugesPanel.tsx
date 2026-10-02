import React from 'react';
import { Thermometer, Droplets, Flame, Wind, Activity } from 'lucide-react';
import { RiskLevel, TemperatureUnit } from '../types';
import { celsiusToFahrenheit } from '../services/heatIndexCalculator';

interface ThreeDGaugesPanelProps {
  temperatureC: number;
  humidity: number;
  unit: TemperatureUnit;
  riskLevel: RiskLevel;
  heatIndex: number;
  wetBulb: number;
}

export const ThreeDGaugesPanel: React.FC<ThreeDGaugesPanelProps> = ({
  temperatureC,
  humidity,
  unit,
  riskLevel,
  heatIndex,
  wetBulb,
}) => {
  const displayTemp =
    unit === 'C'
      ? temperatureC
      : Math.round(celsiusToFahrenheit(temperatureC) * 10) / 10;

  const displayHI =
    unit === 'C'
      ? heatIndex
      : Math.round(celsiusToFahrenheit(heatIndex) * 10) / 10;

  // Temperature gauge range: -10°C to 50°C
  const minTemp = -10;
  const maxTemp = 50;
  const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temperatureC));
  const tempPercent = Math.round(((clampedTemp - minTemp) / (maxTemp - minTemp)) * 100);

  // Clamped humidity 0-100%
  const clampedHumidity = Math.max(0, Math.min(100, humidity));

  // Risk-based thermal palette
  const thermalColor =
    riskLevel === 'SEVERE'
      ? {
          glow: 'rgba(244, 63, 94, 0.45)',
          barGrad: 'from-amber-500 via-orange-500 to-rose-600',
          accent: 'text-rose-400',
          border: 'border-rose-500/40',
          bg: 'bg-rose-950/20',
        }
      : riskLevel === 'HIGH'
      ? {
          glow: 'rgba(249, 115, 22, 0.35)',
          barGrad: 'from-amber-400 via-orange-500 to-orange-600',
          accent: 'text-orange-400',
          border: 'border-orange-500/40',
          bg: 'bg-orange-950/20',
        }
      : riskLevel === 'MODERATE'
      ? {
          glow: 'rgba(251, 191, 36, 0.3)',
          barGrad: 'from-emerald-400 via-amber-400 to-amber-500',
          accent: 'text-amber-400',
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
        }
      : {
          glow: 'rgba(16, 185, 129, 0.25)',
          barGrad: 'from-sky-400 via-teal-400 to-emerald-500',
          accent: 'text-emerald-400',
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/20',
        };

  return (
    <div id="gauges-section" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. 3D Temperature Column Gauge */}
      <div
        className={`relative overflow-hidden bg-slate-900/90 border ${thermalColor.border} rounded-2xl p-5 shadow-xl transition-all duration-500`}
        style={{
          boxShadow: `0 10px 30px -10px ${thermalColor.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Thermometer className={`w-4 h-4 ${thermalColor.accent}`} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                3D Thermal Column Gauge
              </span>
              <p className="text-[11px] text-slate-500">Live Temperature Visualizer</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black font-mono tabular-nums ${thermalColor.accent}`}>
              {displayTemp}°{unit}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">
              HI: {displayHI}°{unit}
            </span>
          </div>
        </div>

        {/* 3D Thermometer Chamber */}
        <div className="flex items-center gap-5 pt-1">
          {/* Vertical 3D Thermometer Body */}
          <div className="relative flex flex-col items-center shrink-0">
            {/* Upper Glass Tube */}
            <div className="relative w-8 h-40 bg-slate-950 rounded-t-full border border-slate-700/80 overflow-hidden shadow-inner flex flex-col justify-end p-1">
              {/* Internal scale ruler ticks */}
              <div className="absolute inset-y-2 left-1.5 flex flex-col justify-between text-[8px] font-mono text-slate-600 pointer-events-none select-none z-20">
                <span>50°</span>
                <span>42°</span>
                <span>38°</span>
                <span>35°</span>
                <span>30°</span>
                <span>0°</span>
              </div>

              {/* Glowing Liquid Mercury Column */}
              <div
                className={`w-full rounded-t-full bg-gradient-to-t ${thermalColor.barGrad} transition-all duration-700 ease-out relative`}
                style={{
                  height: `${tempPercent}%`,
                  boxShadow: `0 0 16px ${thermalColor.glow}`,
                }}
              >
                {/* 3D Glass Cylindrical Specular Glare */}
                <div className="absolute inset-y-0 left-1 w-1 bg-white/40 rounded-full blur-[0.5px]" />
                <div className="absolute top-0 inset-x-0 h-1.5 bg-white/60 rounded-full" />
              </div>

              {/* Glass surface reflection sheen */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/30 pointer-events-none z-10" />
            </div>

            {/* Bottom 3D Liquid Reservoir Bulb with Metallic Rim */}
            <div className="relative -mt-2 w-12 h-12 rounded-full bg-slate-950 border-2 border-slate-700 shadow-xl flex items-center justify-center z-10">
              {/* Fluid fill inside bulb */}
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${thermalColor.barGrad} shadow-lg relative flex items-center justify-center`}
                style={{ boxShadow: `0 0 20px ${thermalColor.glow}` }}
              >
                {/* Specular 3D Reflection */}
                <div className="absolute top-1.5 left-2 w-3 h-2 rounded-full bg-white/60 blur-[0.5px] transform -rotate-30" />
                <span className="text-[9px] font-black text-slate-950 font-mono">
                  {Math.round(clampedTemp)}°
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Threshold Visual Reference */}
          <div className="flex-1 space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Deterministic Threshold Level:</span>
                <span className={`font-mono font-bold ${thermalColor.accent}`}>{riskLevel}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${thermalColor.barGrad} transition-all duration-700`}
                  style={{ width: `${tempPercent}%` }}
                />
              </div>
            </div>

            {/* Threshold Milestones */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono pt-1">
              <div className={`p-1.5 rounded-lg border ${temperatureC < 35 ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950/50 text-slate-500'}`}>
                &lt; 35°C: LOW
              </div>
              <div className={`p-1.5 rounded-lg border ${temperatureC >= 35 && (temperatureC < 38 || humidity < 60) && temperatureC < 42 ? 'border-amber-500/50 bg-amber-950/40 text-amber-300' : 'border-slate-800 bg-slate-950/50 text-slate-500'}`}>
                ≥ 35°C: MODERATE
              </div>
              <div className={`p-1.5 rounded-lg border ${temperatureC >= 38 && humidity >= 60 && temperatureC < 42 ? 'border-orange-500/50 bg-orange-950/40 text-orange-300' : 'border-slate-800 bg-slate-950/50 text-slate-500'}`}>
                ≥ 38°C + 60%: HIGH
              </div>
              <div className={`p-1.5 rounded-lg border ${temperatureC >= 42 ? 'border-rose-500/60 bg-rose-950/50 text-rose-300 animate-pulse' : 'border-slate-800 bg-slate-950/50 text-slate-500'}`}>
                ≥ 42°C: SEVERE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3D Moisture Chamber & Humidity Gauge */}
      <div
        className="relative overflow-hidden bg-slate-900/90 border border-sky-500/30 rounded-2xl p-5 shadow-xl transition-all duration-500"
        style={{
          boxShadow: '0 10px 30px -10px rgba(14, 165, 233, 0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                3D Moisture Chamber
              </span>
              <p className="text-[11px] text-slate-500">Relative Humidity &amp; Vapor Meter</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono tabular-nums text-sky-400">
              {humidity}%
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">
              RH Level
            </span>
          </div>
        </div>

        {/* 3D Liquid Chamber Visualization */}
        <div className="flex items-center gap-5 pt-1">
          {/* Spherical / Cylindrical 3D Moisture Vessel */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-950 border-2 border-slate-700/80 overflow-hidden shadow-2xl flex flex-col justify-end p-0.5 shrink-0">
            {/* Concentric Gauge Ring Grid */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-24 h-24 rounded-full border border-sky-400" />
              <div className="absolute w-16 h-16 rounded-full border border-sky-400" />
            </div>

            {/* Rising Fluid Chamber with animated wave */}
            <div
              className="w-full bg-gradient-to-t from-sky-600 via-sky-500 to-cyan-400 transition-all duration-700 ease-out relative"
              style={{
                height: `${clampedHumidity}%`,
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)',
              }}
            >
              {/* Wave undulating surface */}
              <div className="absolute -top-2 inset-x-0 h-4 bg-cyan-300/40 rounded-full blur-[1px] animate-fluid-wave" />
              {/* Floating micro vapor bubbles */}
              <div className="absolute bottom-2 left-4 w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
              <div className="absolute bottom-5 right-5 w-1 h-1 rounded-full bg-white/60 animate-pulse" />
            </div>

            {/* Glossy 3D Glass Specular Reflection Dome */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-10" />
            <div className="absolute top-2 left-2 w-10 h-4 bg-white/20 rounded-full blur-[1px] transform -rotate-15 pointer-events-none z-10" />

            {/* Digital Percentage overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span className="text-xl font-black font-mono text-white drop-shadow-md">
                {humidity}%
              </span>
            </div>
          </div>

          {/* Right Side: Humidity Telemetry Breakdowns */}
          <div className="flex-1 space-y-2.5 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Saturation Spectrum:</span>
                <span className="font-mono text-sky-300">
                  {humidity < 40 ? 'Dry Air' : humidity <= 60 ? 'Optimal Moisture' : 'High Vapor Density'}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 transition-all duration-700"
                  style={{ width: `${clampedHumidity}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono">
                <span className="text-slate-400">Wet-Bulb (Twb):</span>
                <span className={`font-bold ${wetBulb >= 30 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {wetBulb}°C
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono">
                <span className="text-slate-400">Threshold Trigger (≥60%):</span>
                <span className={`font-bold ${humidity >= 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {humidity >= 60 ? 'ACTIVE (≥ 60%)' : 'NORMAL (< 60%)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
