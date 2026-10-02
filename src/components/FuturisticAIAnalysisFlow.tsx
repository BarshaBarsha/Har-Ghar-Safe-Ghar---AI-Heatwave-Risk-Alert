import React from 'react';
import { Cpu, ArrowRight, Zap, Database, GitBranch, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { RiskLevel, TemperatureUnit } from '../types';

interface FuturisticAIAnalysisFlowProps {
  temperatureC: number;
  humidity: number;
  unit: TemperatureUnit;
  riskLevel: RiskLevel;
  confidence: number;
  latencyMs: number;
}

export const FuturisticAIAnalysisFlow: React.FC<FuturisticAIAnalysisFlowProps> = ({
  temperatureC,
  humidity,
  unit,
  riskLevel,
  confidence,
  latencyMs,
}) => {
  // Theme palette based on current risk
  const riskTheme = {
    LOW: {
      accent: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bgGlow: 'rgba(16, 185, 129, 0.2)',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60',
      conduit: 'from-emerald-500/60 to-emerald-400',
      ruleActive: 'rule-low',
    },
    MODERATE: {
      accent: 'text-amber-400',
      border: 'border-amber-500/40',
      bgGlow: 'rgba(245, 158, 11, 0.25)',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-500/60',
      conduit: 'from-amber-500/60 to-amber-400',
      ruleActive: 'rule-mod',
    },
    HIGH: {
      accent: 'text-orange-400',
      border: 'border-orange-500/50',
      bgGlow: 'rgba(234, 88, 12, 0.35)',
      badge: 'bg-orange-950/80 text-orange-300 border-orange-500/60',
      conduit: 'from-orange-500/60 to-orange-400',
      ruleActive: 'rule-high',
    },
    SEVERE: {
      accent: 'text-rose-400',
      border: 'border-rose-500/60',
      bgGlow: 'rgba(225, 29, 72, 0.45)',
      badge: 'bg-rose-950/80 text-rose-300 border-rose-500/70 shadow-lg shadow-rose-500/30',
      conduit: 'from-rose-500/70 to-rose-400',
      ruleActive: 'rule-sev',
    },
  }[riskLevel];

  // Matched deterministic rule text
  const matchedRule =
    temperatureC >= 42
      ? { title: 'IF temp >= 42°C', label: 'Critical Hyperthermic Trigger' }
      : temperatureC >= 38 && humidity >= 60
      ? { title: 'IF temp >= 38°C & rh >= 60%', label: 'Thermal Humidity Amplification' }
      : temperatureC >= 35
      ? { title: 'IF temp >= 35°C', label: 'Moderate Heat Advisory Range' }
      : { title: 'ELSE (temp < 35°C)', label: 'Normal Baseline Zone' };

  return (
    <div
      className={`relative overflow-hidden bg-slate-900/90 border ${riskTheme.border} rounded-2xl p-5 sm:p-6 shadow-2xl transition-all duration-500`}
      style={{
        boxShadow: `0 15px 40px -15px ${riskTheme.bgGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {/* Background cyber grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Top Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              Futuristic AI/ML Analysis Pipeline
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                Live Flow
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive 3D telemetry streaming: Temperature + Humidity → AI/ML Decision Engine → Heat Risk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Inference:</span>
          <span className="text-slate-200 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
            {latencyMs}ms
          </span>
        </div>
      </div>

      {/* 3-Stage Pipeline Architecture */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-11 gap-4 items-center pt-5">
        {/* STAGE 1: Temperature & Humidity Ingestion (Col 1-3) */}
        <div className="lg:col-span-3 bg-slate-950/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between h-full relative overflow-hidden group">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800/80 mb-3">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              1. Weather Inputs
            </span>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          </div>

          <div className="space-y-2.5 my-1">
            {/* Temp Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Ambient Temp</span>
                <span className="text-lg font-black font-mono text-rose-400">{temperatureC}°C</span>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-400">
                Input Feature <br />
                <strong className="text-slate-200">X₁</strong>
              </div>
            </div>

            {/* Humidity Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Relative Humidity</span>
                <span className="text-lg font-black font-mono text-sky-400">{humidity}%</span>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-400">
                Input Feature <br />
                <strong className="text-slate-200">X₂</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] font-mono text-slate-500 text-center">
            Vector: [{temperatureC}°C, {humidity}%]
          </div>
        </div>

        {/* Conduit 1: Stage 1 -> Stage 2 (Col 4) */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
          <div className="w-full hidden lg:flex items-center justify-center relative">
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full animate-conduit-packet"
                style={{ animation: 'conduit-packet 2s infinite linear' }}
              />
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 ml-1" />
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-400 lg:hidden transform rotate-90 my-1" />
        </div>

        {/* STAGE 2: Central AI/ML Analysis & Rule Matcher (Col 5-7) */}
        <div className="lg:col-span-3 bg-slate-950/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between h-full relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800/80 mb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              2. AI/ML Analysis
            </span>
            <span className="text-[10px] text-amber-400 font-mono">Gini Model</span>
          </div>

          {/* Active Decision Node Box */}
          <div className="bg-slate-900 border border-indigo-900/40 rounded-lg p-2.5 my-1">
            <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-indigo-400" />
              <span>Active Rule Match</span>
            </div>
            <div className="text-xs font-mono font-bold text-amber-300 break-words">
              {matchedRule.title}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
              {matchedRule.label}
            </p>
          </div>

          {/* 3D Neural Nodes representation */}
          <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center pt-1">
            <div className={`p-1 rounded ${riskLevel === 'LOW' ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 text-slate-600'}`}>
              LOW
            </div>
            <div className={`p-1 rounded ${riskLevel === 'MODERATE' ? 'bg-amber-950 border border-amber-500 text-amber-300 font-bold' : 'bg-slate-900/60 text-slate-600'}`}>
              MOD
            </div>
            <div className={`p-1 rounded ${riskLevel === 'HIGH' ? 'bg-orange-950 border border-orange-500 text-orange-300 font-bold' : 'bg-slate-900/60 text-slate-600'}`}>
              HIGH
            </div>
            <div className={`p-1 rounded ${riskLevel === 'SEVERE' ? 'bg-rose-950 border border-rose-500 text-rose-300 font-bold' : 'bg-slate-900/60 text-slate-600'}`}>
              SEV
            </div>
          </div>
        </div>

        {/* Conduit 2: Stage 2 -> Stage 3 (Col 8) */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
          <div className="w-full hidden lg:flex items-center justify-center relative">
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full"
                style={{ animation: 'conduit-packet 1.8s infinite linear 0.4s' }}
              />
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 lg:hidden transform rotate-90 my-1" />
        </div>

        {/* STAGE 3: Final Heat Risk Output (Col 9-11) */}
        <div
          className={`lg:col-span-3 bg-slate-950/90 border ${riskTheme.border} rounded-xl p-4 shadow-xl flex flex-col justify-between h-full relative overflow-hidden transition-all duration-500`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800/80 mb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <ShieldAlert className={`w-3.5 h-3.5 ${riskTheme.accent}`} />
              3. Heat Risk
            </span>
            <span className="text-[10px] font-mono text-slate-400">Confidence: {confidence}%</span>
          </div>

          {/* Large Floating 3D Outcome Crystal */}
          <div className="py-2 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">
              Assessed Health Risk Tier
            </span>
            <div className={`text-2xl sm:text-3xl font-black tracking-tight ${riskTheme.accent} drop-shadow-md`}>
              {riskLevel}
            </div>
          </div>

          <div className={`p-1.5 rounded-lg border text-center text-[10px] font-mono ${riskTheme.badge}`}>
            ✓ Public Alert Dispatched
          </div>
        </div>
      </div>
    </div>
  );
};
