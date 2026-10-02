import React from 'react';
import { ArrowRight, CloudSun, Cpu, AlertTriangle, BellRing, HeartPulse } from 'lucide-react';
import { RiskLevel } from '../types';

interface PipelineRibbonProps {
  currentRisk: RiskLevel;
}

export const PipelineRibbon: React.FC<PipelineRibbonProps> = ({ currentRisk }) => {
  const steps = [
    {
      id: 1,
      title: 'Weather Data',
      subtitle: 'Temp & Humidity',
      icon: CloudSun,
      accent: 'text-sky-400',
    },
    {
      id: 2,
      title: 'AI/ML Model',
      subtitle: 'Decision Tree Classifier',
      icon: Cpu,
      accent: 'text-indigo-400',
    },
    {
      id: 3,
      title: 'Heat Risk',
      subtitle: currentRisk,
      icon: AlertTriangle,
      accent:
        currentRisk === 'LOW'
          ? 'text-emerald-400'
          : currentRisk === 'MODERATE'
          ? 'text-amber-400'
          : currentRisk === 'HIGH'
          ? 'text-orange-400'
          : 'text-rose-400',
    },
    {
      id: 4,
      title: 'Local Alert',
      subtitle: 'Automated Broadcast',
      icon: BellRing,
      accent: 'text-amber-400',
    },
    {
      id: 5,
      title: 'Health Advisory',
      subtitle: 'Actionable Safety',
      icon: HeartPulse,
      accent: 'text-rose-400',
    },
  ];

  return (
    <section id="pipeline" className="w-full bg-slate-900/60 border-y border-slate-800/80 py-3.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4 text-xs">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;
          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Icon className={`w-3.5 h-3.5 ${step.accent}`} />
                </div>
                <div className="leading-tight">
                  <p className="font-semibold text-slate-200 whitespace-nowrap">{step.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{step.subtitle}</p>
                </div>
              </div>
              {!isLast && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
