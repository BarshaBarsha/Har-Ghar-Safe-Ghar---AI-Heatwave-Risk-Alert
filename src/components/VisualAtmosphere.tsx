import React from 'react';
import { RiskLevel } from '../types';

interface VisualAtmosphereProps {
  riskLevel: RiskLevel;
  temperature: number;
}

export const VisualAtmosphere: React.FC<VisualAtmosphereProps> = ({ riskLevel, temperature }) => {
  // Theme palette mapping according to risk
  const theme = {
    LOW: {
      sunCore: '#fef08a', // pale gold
      sunCorona1: '#fde047',
      sunCorona2: '#10b981', // subtle cool emerald tint
      sunGlow: 'rgba(16, 185, 129, 0.18)',
      ambientSky: 'from-emerald-950/20 via-slate-950 to-slate-950',
      flareColor: 'rgba(52, 211, 153, 0.25)',
      waveSpeed: 'animate-heat-shimmer',
      waveOpacity: 'opacity-20',
      waveColor: 'stroke-emerald-400/30',
      sunScale: 'scale-90',
      sunStatus: 'Calm Thermal State',
    },
    MODERATE: {
      sunCore: '#ffffff',
      sunCorona1: '#fbbf24',
      sunCorona2: '#f59e0b',
      sunGlow: 'rgba(245, 158, 11, 0.28)',
      ambientSky: 'from-amber-950/25 via-slate-950 to-slate-950',
      flareColor: 'rgba(251, 191, 36, 0.35)',
      waveSpeed: 'animate-heat-shimmer',
      waveOpacity: 'opacity-40',
      waveColor: 'stroke-amber-400/40',
      sunScale: 'scale-100',
      sunStatus: 'Warm Solar Radiance',
    },
    HIGH: {
      sunCore: '#fff7ed',
      sunCorona1: '#f97316',
      sunCorona2: '#ea580c',
      sunGlow: 'rgba(234, 88, 12, 0.38)',
      ambientSky: 'from-orange-950/35 via-slate-950 to-slate-950',
      flareColor: 'rgba(249, 115, 22, 0.5)',
      waveSpeed: 'animate-severe-wave',
      waveOpacity: 'opacity-65',
      waveColor: 'stroke-orange-400/60',
      sunScale: 'scale-110',
      sunStatus: 'Intense Heat Radiation',
    },
    SEVERE: {
      sunCore: '#fff1f2',
      sunCorona1: '#f43f5e',
      sunCorona2: '#be123c',
      sunGlow: 'rgba(225, 29, 72, 0.5)',
      ambientSky: 'from-rose-950/45 via-slate-950 to-slate-950',
      flareColor: 'rgba(244, 63, 94, 0.65)',
      waveSpeed: 'animate-severe-wave',
      waveOpacity: 'opacity-85',
      waveColor: 'stroke-rose-400/75',
      sunScale: 'scale-125',
      sunStatus: 'Extreme Emergency Thermal Convection',
    },
  }[riskLevel];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-700 select-none"
    >
      {/* Dynamic Sky Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.ambientSky} transition-all duration-700`} />

      {/* 3D Animated Sun - Top Right Positioned with Depth */}
      <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 md:-top-24 md:-right-24 w-80 h-80 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px] transition-transform duration-700">
        {/* Deep ambient solar glow sphere */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${theme.sunScale}`}
          style={{ backgroundColor: theme.sunGlow }}
        />

        {/* Rotating 3D Corona Ray Spikes */}
        <div className="absolute inset-0 flex items-center justify-center animate-sun-spin">
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-70">
            <defs>
              <radialGradient id="rayGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={theme.sunCorona1} stopOpacity="0.8" />
                <stop offset="60%" stopColor={theme.sunCorona2} stopOpacity="0.4" />
                <stop offset="100%" stopColor={theme.sunCorona2} stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* 16 Solar Ray Petals around the perimeter */}
            {Array.from({ length: 16 }).map((_, i) => (
              <polygon
                key={i}
                points="100,20 106,85 100,90 94,85"
                fill="url(#rayGrad)"
                transform={`rotate(${i * 22.5} 100 100)`}
              />
            ))}
          </svg>
        </div>

        {/* Second counter-rotating ray disc */}
        <div
          className="absolute inset-4 flex items-center justify-center opacity-60"
          style={{ animation: 'sun-spin-slow 60s linear infinite reverse' }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={i}
                cx="100"
                cy="35"
                r="3.5"
                fill={theme.sunCorona1}
                opacity="0.6"
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}
          </svg>
        </div>

        {/* Pulsing Solar Core Sphere with 3D Spherical Shading */}
        <div className="absolute inset-16 sm:inset-20 flex items-center justify-center">
          <div
            className={`w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full animate-sun-pulse transition-all duration-700 shadow-2xl relative ${theme.sunScale}`}
            style={{
              background: `radial-gradient(circle at 35% 35%, ${theme.sunCore} 0%, ${theme.sunCorona1} 45%, ${theme.sunCorona2} 80%, rgba(0,0,0,0.4) 100%)`,
              boxShadow: `0 0 60px ${theme.flareColor}, inset -10px -10px 30px rgba(0,0,0,0.5)`,
            }}
          >
            {/* 3D Specular Highlight */}
            <div className="absolute top-4 left-6 w-12 h-6 rounded-full bg-white/60 blur-[3px] transform -rotate-25" />
            <div className="absolute top-8 left-10 w-4 h-2 rounded-full bg-white/80 blur-[1px]" />
          </div>
        </div>
      </div>

      {/* Subtle Animated Heat-Wave / Wavy Air Convection Effects */}
      <div className={`absolute inset-x-0 bottom-0 h-96 transition-opacity duration-700 ${theme.waveOpacity}`}>
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className={`w-full h-full ${theme.waveSpeed}`}
        >
          {/* Wave 1: Gentle bottom swell */}
          <path
            d="M0,192 C240,160 480,240 720,192 C960,144 1200,224 1440,192 L1440,320 L0,320 Z"
            fill="none"
            className={`${theme.waveColor}`}
            strokeWidth="1.5"
          />
          {/* Wave 2: Middle shimmering convection line */}
          <path
            d="M0,128 C300,160 600,96 900,144 C1200,192 1350,112 1440,128"
            fill="none"
            className={`${theme.waveColor}`}
            strokeWidth="1.2"
            strokeDasharray="8 6"
          />
          {/* Wave 3: Higher subtle thermal layer */}
          <path
            d="M0,64 C200,96 500,32 800,80 C1100,128 1300,48 1440,64"
            fill="none"
            className={`${theme.waveColor}`}
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* Extra Severe Warning Heat Flare for SEVERE tier */}
      {riskLevel === 'SEVERE' && (
        <div className="absolute inset-0 bg-rose-950/10 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
