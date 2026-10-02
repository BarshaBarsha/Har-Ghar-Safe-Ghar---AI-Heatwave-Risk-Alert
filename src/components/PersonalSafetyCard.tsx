import React from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  AlertTriangle,
  Smartphone,
  MapPin,
  History,
  Home,
  Bot,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types/auth';
import { usePersonalThreshold } from '../hooks/usePersonalThreshold';

interface PersonalSafetyCardProps {
  currentUser: UserProfile;
  currentTempC: number;
  humidity?: number;
  locationName?: string;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const PersonalSafetyCard: React.FC<PersonalSafetyCardProps> = ({
  currentUser,
  currentTempC,
  humidity = 68,
  locationName = 'Jatani',
  onUpdateUser,
}) => {
  const {
    finalLimit,
    explanation,
    roomStatusText,
    estimatedRoomTemp,
    remainingDelta,
    isSafe,
    batteryTemp,
    isSaved,
    isSaving,
    saveLimit,
    detection,
  } = usePersonalThreshold({
    currentUser,
    currentTemp: currentTempC,
    humidity,
    locationName,
    onUpdateUser,
  });

  return (
    <div className="bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 border-2 border-purple-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Radiant atmospheric background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-600/20 via-pink-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-purple-800/40">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/80 border border-purple-500/80 text-purple-200 text-xs font-mono font-bold shadow-sm">
            <Bot className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span>AI Autonomous Health Protection</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Zero Input Required</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-purple-300">
          <span>User: <strong>{currentUser.name}</strong></span>
        </div>
      </div>

      {/* Main Auto-Detection Section */}
      <div className="pt-4 space-y-4">
        {/* MANDATED UI LINE 1: "🤖 Auto-Detected: Aapka Limit 35.2°C hai" */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-950/40 border border-purple-700/60 rounded-2xl p-4 sm:p-5">
          <div className="space-y-1">
            <div className="text-lg sm:text-xl font-black text-white flex items-center gap-2 flex-wrap">
              <span>🤖 Auto-Detected:</span>
              <span className="text-purple-300 bg-purple-900/90 px-3 py-0.5 rounded-xl border border-purple-400 font-mono shadow-md">
                Aapka Limit {finalLimit.toFixed(1)}°C hai
              </span>
            </div>
            <p className="text-xs text-purple-200/80 font-medium">
              Calculated automatically using Live Hotspot data, phone battery heat sensors &amp; past alert memory.
            </p>
          </div>

          <div className="shrink-0 text-right font-mono">
            <span className="text-[11px] text-slate-400 block uppercase">Personal Threshold</span>
            <span className="text-3xl font-black text-purple-300 tracking-tight">
              {finalLimit.toFixed(1)}°C
            </span>
          </div>
        </div>

        {/* MANDATED UI LINE 2: "Kaise pata chala? Aap Jatani (42.5°C hotspot) me rehte ho + Aapka phone garam hai (38°C battery) + Pichhli baar 36°C pe aapne alert dekha tha" */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Reasoning &amp; Sensor Telemetry:</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
            &ldquo;{explanation}&rdquo;
          </p>

          {/* Micro Telemetry Pills for Transparency */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Zone</span>
                <span className="text-white font-bold truncate block">{locationName} ({currentTempC}°C)</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Phone Battery</span>
                <span className="text-amber-300 font-bold block">{batteryTemp}°C (Warming)</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Past Alert Temp</span>
                <span className="text-sky-300 font-bold block">{detection.lastAlertTemp || 36}°C Logged</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">Room Temp</span>
                <span className="text-emerald-300 font-bold block">{estimatedRoomTemp}°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* MANDATED UI LINE 3: "Current Room 33.5°C = Aap SAFE ho, bas 1.7°C bacha hai" */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isSafe
              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
              : 'bg-rose-950/50 border-rose-600 text-rose-200 animate-pulse'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isSafe ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="text-xs sm:text-sm font-bold font-mono">
                {roomStatusText}
              </div>
              <p className="text-[11px] text-slate-300/90 mt-0.5">
                {isSafe
                  ? `Indoor condition is comfortable. When room reaches ${finalLimit.toFixed(1)}°C, push alert will trigger.`
                  : `Thermal threshold exceeded! Drink electrolytes and turn on fans or AC immediately.`}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[10px] uppercase font-mono block text-slate-400">Safety Buffer</span>
            <span className={`text-xl font-mono font-black ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isSafe ? `+${remainingDelta}°C` : `-${remainingDelta}°C`}
            </span>
          </div>
        </div>

        {/* MANDATED BUTTON: "OK, 35.2°C Save Karo" */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-400 italic">
            ⚡ Fully automatic — adapts in real-time as temperature, location, and device heat fluctuate.
          </span>

          <button
            type="button"
            onClick={() => saveLimit()}
            disabled={isSaving}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg active:scale-95 whitespace-nowrap ${
              isSaved
                ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-300/40'
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 hover:from-purple-400 hover:to-amber-300 text-slate-950 shadow-purple-600/30'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Limit Saved Successfully! ({finalLimit.toFixed(1)}°C)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>OK, {finalLimit.toFixed(1)}°C Save Karo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
