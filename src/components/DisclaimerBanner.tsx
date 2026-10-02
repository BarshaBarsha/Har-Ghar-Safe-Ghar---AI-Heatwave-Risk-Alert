import React from 'react';
import { Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside
      role="note"
      aria-label="Medical and certification disclaimer"
      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs text-slate-300"
    >
      <div className="flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-200">
            Educational &amp; Hackathon Prototype Notice
          </p>
          <p className="text-slate-400 leading-relaxed">
            This system is an AI/ML prototype designed for educational demonstration and local risk estimation.
            It is <span className="text-slate-200 font-medium">not certified as a clinical medical device</span> and does not provide diagnostic or therapeutic medical decisions. In the event of severe symptoms (confusion, rapid pulse, lack of sweat, fainting) or official government extreme heat warnings, follow your municipal disaster management and emergency medical services immediately.
          </p>
        </div>
      </div>
    </aside>
  );
};
