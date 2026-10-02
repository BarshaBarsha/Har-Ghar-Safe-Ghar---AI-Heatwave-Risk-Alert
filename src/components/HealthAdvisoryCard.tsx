import React, { useState } from 'react';
import {
  HeartPulse,
  Droplet,
  Sun,
  Shirt,
  Users,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { PredictionResult, RiskLevel } from '../types';

interface HealthAdvisoryCardProps {
  prediction: PredictionResult;
}

export const HealthAdvisoryCard: React.FC<HealthAdvisoryCardProps> = ({
  prediction,
}) => {
  const { riskLevel, safetyRecommendations, vulnerableGroupsGuidance } = prediction;
  const [activityTier, setActivityTier] = useState<'rest' | 'moderate' | 'heavy'>('moderate');

  // Multiplier for hydration intake
  const multiplier = activityTier === 'rest' ? 0.75 : activityTier === 'moderate' ? 1.0 : 1.4;
  const estimatedHydration = Math.round(prediction.recommendedWaterIntakePerHourMl * multiplier);

  return (
    <section id="health-advisory" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Community Health &amp; Heat Safety Guidance
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard public health protective protocols calibrated for current thermal stress
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Advisory Level:{' '}
          <span
            className={`font-bold ${
              riskLevel === 'LOW'
                ? 'text-emerald-400'
                : riskLevel === 'MODERATE'
                ? 'text-amber-400'
                : riskLevel === 'HIGH'
                ? 'text-orange-400'
                : 'text-rose-400'
            }`}
          >
            {riskLevel}
          </span>
        </div>
      </div>

      {/* Interactive Hydration Calculator for Students & Residents */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Recommended Hydration Rate
            </h4>
          </div>

          {/* Activity selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActivityTier('rest')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activityTier === 'rest' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Resting / Indoors
            </button>
            <button
              onClick={() => setActivityTier('moderate')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activityTier === 'moderate' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Walking / Commute
            </button>
            <button
              onClick={() => setActivityTier('heavy')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activityTier === 'heavy' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Campus Sports / Manual Work
            </button>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-sky-400 tabular-nums">
            {estimatedHydration}
          </span>
          <span className="text-xs font-mono text-slate-400 uppercase">
            mL / hour (~{Math.round((estimatedHydration / 250) * 10) / 10} cups)
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Drink small amounts frequently rather than large volumes all at once. Avoid high-sugar energy drinks or excessive caffeine.
        </p>
      </div>

      {/* Core Safety Guidelines Checklist */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>General Population Safety Protocols</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {safetyRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerable Groups Guidance */}
      <div className="pt-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Vulnerable Populations &amp; Campus Protection</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vulnerableGroupsGuidance.map((guidance, idx) => (
            <div
              key={idx}
              className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5"
            >
              <span className="text-amber-400 font-bold">•</span>
              <span>{guidance}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heat Illness Quick-Reference Matrix */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Emergency Health Recognition Guide
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Heat Exhaustion */}
          <div className="bg-slate-900 border border-amber-900/40 rounded-lg p-3">
            <div className="font-bold text-amber-400 mb-1 flex items-center justify-between">
              <span>HEAT EXHAUSTION</span>
              <span className="text-[10px] font-mono font-normal text-slate-400">Moderate / Severe</span>
            </div>
            <p className="text-slate-300 text-[11px] mb-2">
              <strong>Symptoms:</strong> Heavy sweating, pale/clammy skin, dizziness, fast weak pulse, nausea, muscle cramps.
            </p>
            <p className="text-emerald-400 text-[11px]">
              <strong>First Response:</strong> Move immediately to cool shade, loosen clothing, sip cool water, apply wet cloths to neck.
            </p>
          </div>

          {/* Heat Stroke */}
          <div className="bg-slate-900 border border-rose-900/60 rounded-lg p-3">
            <div className="font-bold text-rose-400 mb-1 flex items-center justify-between">
              <span>HEAT STROKE</span>
              <span className="text-[10px] font-mono font-bold text-rose-400">CRITICAL EMERGENCY</span>
            </div>
            <p className="text-slate-300 text-[11px] mb-2">
              <strong>Symptoms:</strong> High body temp (&gt;39.5°C), hot red dry or damp skin, confusion, fainting, vomiting, loss of consciousness.
            </p>
            <p className="text-rose-300 text-[11px]">
              <strong>First Response:</strong> Call emergency medical services (911/local emergency) immediately. Immerse or douse with cold water until help arrives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
