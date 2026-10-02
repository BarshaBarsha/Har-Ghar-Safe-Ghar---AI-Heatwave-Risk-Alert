import React, { useState } from 'react';
import {
  HeartPulse,
  X,
  BellRing,
  Check,
  ShieldCheck,
  ArrowRight,
  Thermometer,
  Sparkles,
  User,
} from 'lucide-react';
import { UserProfile } from '../types/auth';
import {
  sendPersonalAlertNotification,
  playEmergencyAlertSound,
} from '../services/notificationService';

interface PersonalAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  currentTempC: number;
  locationName: string;
  onOpenWhatToDo: () => void;
  onOpenSevereModal?: () => void;
  isAiRiskSevere?: boolean;
}

export const PersonalAlertModal: React.FC<PersonalAlertModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentTempC,
  locationName,
  onOpenWhatToDo,
  onOpenSevereModal,
  isAiRiskSevere = false,
}) => {
  const [notificationSent, setNotificationSent] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerPush = async () => {
    playEmergencyAlertSound();
    const res = await sendPersonalAlertNotification(
      currentUser.name,
      currentUser.personalThresholdTempC,
      currentTempC
    );
    setNotificationSent(true);
    setStatusMsg(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Purple Glowing Modal Container */}
      <div className="w-full max-w-lg rounded-3xl border-2 border-purple-500 bg-gradient-to-b from-purple-950/90 via-slate-900 to-slate-950 shadow-2xl shadow-purple-950/80 ring-4 ring-purple-500/25 p-6 sm:p-7 relative overflow-hidden">
        {/* Purple Ambient Beam */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/35 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white p-1.5 rounded-full hover:bg-purple-900/40 transition-colors z-10"
          aria-label="Close personal alert"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Alert Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
            <HeartPulse className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider border border-purple-400 text-purple-300 bg-purple-950/60">
                PERSONALIZED DANGER ALERT
              </span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              Personal Heat Limit Exceeded!
            </h2>
          </div>
        </div>

        {/* Highlighted Message as requested */}
        <div className="bg-purple-950/60 border border-purple-700/60 rounded-2xl p-4 mb-4 space-y-2">
          <p className="text-sm sm:text-base font-bold text-purple-100 leading-snug">
            Hey <span className="text-amber-300 font-extrabold">{currentUser.name}</span>! Your personal danger limit is <span className="text-purple-300 font-mono font-black">{currentUser.personalThresholdTempC}°C</span>. Current temp is <span className="text-rose-400 font-mono font-black">{currentTempC}°C</span>. Please take precautions!
          </p>
          <div className="flex items-center gap-2 text-xs text-purple-300/80 pt-1 font-mono">
            <span>Location: {locationName}</span>
            <span aria-hidden="true">·</span>
            <span>Target: &lt;{currentUser.personalThresholdTempC}°C</span>
          </div>
        </div>

        {/* Metrics readout */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-slate-950/80 border border-purple-900/50 rounded-xl">
            <span className="text-[10px] font-mono text-purple-400 block uppercase">
              Your Safe Threshold
            </span>
            <span className="text-2xl font-black font-mono text-purple-300">
              {currentUser.personalThresholdTempC}°C
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Saved in your profile
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-purple-900/50 rounded-xl">
            <span className="text-[10px] font-mono text-rose-400 block uppercase">
              Current Ambient Temp
            </span>
            <span className="text-2xl font-black font-mono text-rose-400">
              {currentTempC}°C
            </span>
            <span className="text-[10px] text-rose-300/80 block mt-0.5 font-bold">
              +{Math.max(0, currentTempC - currentUser.personalThresholdTempC)}°C above your limit!
            </span>
          </div>
        </div>

        {/* Feedback toast */}
        {statusMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-purple-900/60 border border-purple-500/60 text-purple-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="space-y-2.5">
          {/* Send Browser Notification button */}
          <button
            onClick={handleTriggerPush}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <BellRing className="w-4 h-4" />
            <span>
              {notificationSent
                ? 'Personal Push Notification Dispatched!'
                : 'Send Personal Push Notification to Mobile'}
            </span>
          </button>

          {/* Secondary Action: Go to What To Do */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenWhatToDo();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Precautions (What To Do)</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {isAiRiskSevere && onOpenSevereModal ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenSevereModal();
                }}
                className="py-2.5 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>View AI Severe Heat Alert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Acknowledge Personal Limit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
