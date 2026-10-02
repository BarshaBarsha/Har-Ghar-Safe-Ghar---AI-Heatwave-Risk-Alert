import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Flame,
  HelpCircle,
  Cpu,
  TrendingUp,
} from 'lucide-react';
import { PredictionResult, RiskLevel } from '../types';

interface RiskLevelCardProps {
  prediction: PredictionResult;
  onOpenModelModal: () => void;
  lastEvaluatedAt?: string;
  evaluationCounter?: number;
}

export const RiskLevelCard: React.FC<RiskLevelCardProps> = ({
  prediction,
  onOpenModelModal,
  lastEvaluatedAt,
  evaluationCounter,
}) => {
  const { riskLevel, confidence, classProbabilities, explanation, physiologicalImpact, latencyMs } =
    prediction;

  // Visual styling according to risk level
  const config = {
    LOW: {
      badgeBg: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20 shadow-md',
      heroBg: 'from-emerald-500/15 via-slate-900/90 to-slate-950',
      border: 'border-emerald-500/50',
      meterColor: 'bg-emerald-400',
      textAccent: 'text-emerald-400',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      icon: CheckCircle2,
      tagline: 'Safe Thermal Operating Zone (Low Burden)',
    },
    MODERATE: {
      badgeBg: 'bg-amber-950/70 text-amber-400 border-amber-500/50 shadow-amber-500/20 shadow-md',
      heroBg: 'from-amber-500/15 via-slate-900/90 to-slate-950',
      border: 'border-amber-500/50',
      meterColor: 'bg-amber-400',
      textAccent: 'text-amber-400',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      icon: AlertTriangle,
      tagline: 'Elevated Caution Required (Moderate Burden)',
    },
    HIGH: {
      badgeBg: 'bg-orange-950/70 text-orange-400 border-orange-500/60 shadow-orange-500/30 shadow-lg',
      heroBg: 'from-orange-500/20 via-slate-900/90 to-slate-950',
      border: 'border-orange-500/60',
      meterColor: 'bg-orange-500',
      textAccent: 'text-orange-400',
      glowColor: 'rgba(249, 115, 22, 0.45)',
      icon: ShieldAlert,
      tagline: 'High Thermal Strain Advisory (Caution Advised)',
    },
    SEVERE: {
      badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-500/70 shadow-rose-500/40 shadow-xl',
      heroBg: 'from-rose-500/25 via-slate-900/90 to-slate-950',
      border: 'border-rose-500/70',
      meterColor: 'bg-rose-500',
      textAccent: 'text-rose-400',
      glowColor: 'rgba(225, 29, 72, 0.55)',
      icon: Flame,
      tagline: 'Critical Heat Emergency Danger (Immediate Safety Actions)',
    },
  }[riskLevel];

  const Icon = config.icon;

  const tiers: RiskLevel[] = ['LOW', 'MODERATE', 'HIGH', 'SEVERE'];

  return (
    <div
      id="risk-assessment"
      key={evaluationCounter}
      className={`relative overflow-hidden bg-gradient-to-b ${config.heroBg} border ${config.border} rounded-2xl p-6 sm:p-7 shadow-2xl transition-all duration-500 animate-float-depth`}
      style={{
        boxShadow: `0 25px 60px -15px ${config.glowColor}, inset 0 1px 0 rgba(255,255,255,0.12)`,
      }}
    >
      {/* 3D Glass Specular Bevel Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* Cyber Sweep Scanline Animation on click */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none opacity-0 animate-[scan-flash_1.2s_ease-out]" />
      {/* Top row: Title and execution metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ML Heat-Health Risk Prediction
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-mono">
            Confidence: <span className="text-slate-200 font-bold">{confidence}%</span>
          </span>
          {lastEvaluatedAt && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                Calculated: {lastEvaluatedAt}
              </span>
            </>
          )}
        </div>

        <button
          onClick={onOpenModelModal}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors w-fit"
          title="Inspect Decision Tree nodes"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px] underline underline-offset-2">
            {prediction.modelVersion} ({latencyMs}ms)
          </span>
        </button>
      </div>

      {/* Main Focus: Big Risk Classification */}
      <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${config.badgeBg}`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-mono text-slate-400">
                Classified Severity Tier
              </p>
              <h3 className={`text-4xl sm:text-5xl font-black tracking-tight ${config.textAccent}`}>
                {riskLevel}
              </h3>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-300">
            {config.tagline}
          </p>
        </div>

        {/* 4-Level Visual Meter */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 md:w-80 shrink-0">
          <div className="text-xs font-semibold uppercase text-slate-400 mb-2 flex justify-between">
            <span>Risk Continuum</span>
            <span className="font-mono text-slate-200">{riskLevel}</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 h-3 mb-2">
            {tiers.map((tier) => {
              const isActive = tier === riskLevel;
              const isPastOrActive = tiers.indexOf(tier) <= tiers.indexOf(riskLevel);

              const color =
                tier === 'LOW'
                  ? 'bg-emerald-500'
                  : tier === 'MODERATE'
                  ? 'bg-amber-400'
                  : tier === 'HIGH'
                  ? 'bg-orange-500'
                  : 'bg-rose-500';

              return (
                <div
                  key={tier}
                  className={`rounded-sm transition-all duration-300 ${
                    isActive
                      ? `${color} ring-2 ring-white/40 scale-y-125 shadow-sm`
                      : isPastOrActive
                      ? `${color}/60`
                      : 'bg-slate-800'
                  }`}
                  title={`${tier}: ${(classProbabilities[tier] * 100).toFixed(0)}% probability`}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-4 text-[10px] font-mono text-slate-400 text-center">
            <span>LOW</span>
            <span>MOD</span>
            <span>HIGH</span>
            <span>SEV</span>
          </div>
        </div>
      </div>

      {/* Probability Distribution Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 mb-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium">Model Probability Distribution:</span>
          <span className="text-[11px] font-mono text-slate-500">Softmax Leaf Weights</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          {tiers.map((t) => {
            const prob = Math.round(classProbabilities[t] * 100);
            return (
              <div key={t} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5">
                <div className="text-[10px] text-slate-400">{t}</div>
                <div className="text-sm font-bold text-slate-200 tabular-nums">{prob}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation & Physiological Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>AI Risk Explanation</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {explanation}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1.5 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Physiological Impact</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {physiologicalImpact}
          </p>
        </div>
      </div>
    </div>
  );
};
