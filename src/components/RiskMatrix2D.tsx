import React from 'react';
import { Target, Info } from 'lucide-react';
import { RiskLevel } from '../types';
import { BENCHMARK_TEST_CASES } from '../services/mlClassifier';

interface RiskMatrix2DProps {
  currentTempC: number;
  currentHumidity: number;
  currentRisk: RiskLevel;
}

export const RiskMatrix2D: React.FC<RiskMatrix2DProps> = ({
  currentTempC,
  currentHumidity,
  currentRisk,
}) => {
  // Chart bounds
  const minTemp = 20;
  const maxTemp = 46;
  const minRh = 10;
  const maxRh = 100;

  // Calculate relative position of current point
  const clampedT = Math.max(minTemp, Math.min(maxTemp, currentTempC));
  const clampedRh = Math.max(minRh, Math.min(maxRh, currentHumidity));

  const posX = ((clampedT - minTemp) / (maxTemp - minTemp)) * 100;
  // Invert Y so high humidity is at top
  const posY = 100 - ((clampedRh - minRh) / (maxRh - minRh)) * 100;

  return (
    <div id="heat-matrix" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-semibold text-slate-100">
              2D Thermal Decision Boundary Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing the bivariate Temperature × Relative Humidity classification space
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" />
            <span className="text-slate-300">LOW</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400/80" />
            <span className="text-slate-300">MOD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/80" />
            <span className="text-slate-300">HIGH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80" />
            <span className="text-slate-300">SEV</span>
          </div>
        </div>
      </div>

      {/* Matrix SVG/Canvas Canvas Area */}
      <div className="mt-5 relative">
        <div className="relative w-full h-72 sm:h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          {/* Background Risk Zone Gradients representing decision boundaries */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="heatGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.35" />
                <stop offset="35%" stopColor="#d97706" stopOpacity="0.4" />
                <stop offset="65%" stopColor="#ea580c" stopOpacity="0.45" />
                <stop offset="85%" stopColor="#e11d48" stopOpacity="0.55" />
              </linearGradient>

              {/* Grid pattern */}
              <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Base Fill with Gradient */}
            <rect width="100" height="100" fill="url(#heatGradient)" />
            <rect width="100" height="100" fill="url(#gridPattern)" />

            {/* Deterministic decision boundary lines */}
            {/* Moderate boundary: Temp = 35°C (x = 57.7%) */}
            <line
              x1="57.7"
              y1="0"
              x2="57.7"
              y2="100"
              stroke="#fbbf24"
              strokeWidth="0.8"
              strokeDasharray="2,2"
              opacity="0.8"
            />
            {/* High boundary: Temp >= 38°C (x = 69.2%) AND Humidity >= 60% (y = 44.4%) */}
            <path
              d="M 69.2 0 L 69.2 44.4 L 84.6 44.4"
              fill="none"
              stroke="#f97316"
              strokeWidth="0.9"
              strokeDasharray="2,2"
              opacity="0.85"
            />
            {/* Severe boundary: Temp >= 42°C (x = 84.6%) */}
            <line
              x1="84.6"
              y1="0"
              x2="84.6"
              y2="100"
              stroke="#f43f5e"
              strokeWidth="1.0"
              strokeDasharray="2,2"
              opacity="0.9"
            />
          </svg>

          {/* Benchmark Test Cases plotted as reference points */}
          {BENCHMARK_TEST_CASES.map((tc) => {
            const bx = ((tc.tempC - minTemp) / (maxTemp - minTemp)) * 100;
            const by = 100 - ((tc.humidity - minRh) / (maxRh - minRh)) * 100;
            return (
              <div
                key={tc.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${bx}%`, top: `${by}%` }}
              >
                <div className="w-3.5 h-3.5 rounded-full border border-white/60 bg-slate-900/90 flex items-center justify-center shadow">
                  <span className="text-[8px] font-mono font-bold text-slate-200">
                    T{tc.id.replace('test-', '')}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Live Position Marker */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300"
            style={{ left: `${posX}%`, top: `${posY}%` }}
          >
            {/* Pulse ripple */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-ping" />
              <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              </div>
            </div>

            {/* Tooltip callout */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-slate-950/95 border border-amber-500/80 rounded px-2 py-1 text-[10px] font-mono whitespace-nowrap shadow-xl text-slate-100 z-20 pointer-events-none">
              <span className="font-bold text-amber-400">{currentTempC}°C</span>, {currentHumidity}% RH
              <span className="text-slate-400"> → </span>
              <span className="font-bold">{currentRisk}</span>
            </div>
          </div>

          {/* Axis Labels inside the box */}
          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
            Temp Axis →
          </div>
          <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
            ↑ Humidity Axis
          </div>
        </div>

        {/* Outer Axis Dimensions */}
        <div className="flex justify-between text-xs font-mono text-slate-400 mt-2 px-1">
          <span>{minTemp}°C</span>
          <span className="text-slate-500">Dry-Bulb Ambient Temperature Range</span>
          <span>{maxTemp}°C</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Markers T1–T4 show the 4 standardized benchmark hackathon test cases</span>
        </span>
        <span className="font-mono text-slate-400 hidden sm:inline">
          Active Coordinate: ({currentTempC}°C, {currentHumidity}%)
        </span>
      </div>
    </div>
  );
};
