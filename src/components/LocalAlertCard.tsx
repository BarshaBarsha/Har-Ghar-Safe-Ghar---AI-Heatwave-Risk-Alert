import React, { useState } from 'react';
import {
  BellRing,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Radio,
  Share2,
  AlertTriangle,
  Megaphone,
  Smartphone,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { PredictionResult, WeatherData, TemperatureUnit } from '../types';
import { celsiusToFahrenheit } from '../services/heatIndexCalculator';
import { sendMobileAlertNotification, playEmergencyAlertSound } from '../services/notificationService';

interface LocalAlertCardProps {
  prediction: PredictionResult;
  weather: WeatherData;
  unit: TemperatureUnit;
  onOpenWhatToDo?: () => void;
  onOpenPetCare?: () => void;
  onOpenAlertModal?: () => void;
}

export const LocalAlertCard: React.FC<LocalAlertCardProps> = ({
  prediction,
  weather,
  unit,
  onOpenWhatToDo,
  onOpenPetCare,
  onOpenAlertModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mobileNotifSent, setMobileNotifSent] = useState(false);
  const [notifFeedback, setNotifFeedback] = useState<string | null>(null);

  const { riskLevel, alertHeadline, alertStatement } = prediction;

  const displayTemp =
    unit === 'C'
      ? weather.temperature
      : Math.round(celsiusToFahrenheit(weather.temperature) * 10) / 10;

  const playAlertTone = () => {
    playEmergencyAlertSound();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playAlertTone();
    }
  };

  const handleTriggerMobileAlert = async () => {
    playEmergencyAlertSound();
    const res = await sendMobileAlertNotification(
      {
        title: `🚨 ${riskLevel} Heatwave Alert in ${weather.locationName}!`,
        body: `${riskLevel} Heatwave Alert in your area! ${weather.temperature}°C detected. Stay indoors & hydrate!`,
        temperatureC: weather.temperature,
        riskLevel,
        locationName: weather.locationName,
      },
      true
    );
    setMobileNotifSent(true);
    setNotifFeedback(res.message);
    setTimeout(() => setNotifFeedback(null), 3500);
  };

  const copyAlertBulletin = () => {
    const text = `[LOCAL HEAT ALERT: ${riskLevel}]\nLocation: ${weather.locationName}\nCondition: ${weather.temperature}°C, ${weather.humidity}% RH (HI: ${weather.heatIndex}°C)\nAlert: ${alertStatement}\nIssued: ${weather.timestamp}\nProtect children, elderly and keep water bowls for stray animals!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const severityStyle = {
    LOW: {
      border: 'border-emerald-800/80',
      bg: 'bg-emerald-950/20',
      indicator: 'bg-emerald-400',
      badge: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
    },
    MODERATE: {
      border: 'border-amber-800/80',
      bg: 'bg-amber-950/20',
      indicator: 'bg-amber-400',
      badge: 'text-amber-400 border-amber-800 bg-amber-950/60',
    },
    HIGH: {
      border: 'border-orange-800/80',
      bg: 'bg-orange-950/25',
      indicator: 'bg-orange-500',
      badge: 'text-orange-400 border-orange-800 bg-orange-950/60',
    },
    SEVERE: {
      border: 'border-rose-800/90',
      bg: 'bg-rose-950/35',
      indicator: 'bg-rose-500 animate-pulse',
      badge: 'text-rose-400 border-rose-800 bg-rose-950/70',
    },
  }[riskLevel];

  return (
    <div
      className={`border ${severityStyle.border} ${severityStyle.bg} bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-md transition-colors`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
            <Megaphone className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">
                Official Local Heat Alert Broadcast
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${severityStyle.badge}`}>
                {riskLevel} ALERT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Zone: <span className="text-slate-200 font-medium">{weather.locationName}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              soundEnabled
                ? 'border-amber-500/80 bg-amber-950/40 text-amber-300'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Mute alert chime' : 'Enable audio alert chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={copyAlertBulletin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            title="Copy bulletin for public noticeboard / chat groups"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Bulletin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Alert Statement */}
      <div className="py-4">
        <div className="flex items-start gap-3">
          <div className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 ${severityStyle.indicator}`} />
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-100">
              {alertHeadline}
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {alertStatement}
            </p>
          </div>
        </div>
      </div>

      {/* Telemetry Summary Banner */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-4">
        <div className="flex items-center gap-4 text-slate-300">
          <span>
            Temp: <strong className="text-slate-100">{displayTemp}°{unit}</strong>
          </span>
          <span className="text-slate-600">/</span>
          <span>
            Humidity: <strong className="text-slate-100">{weather.humidity}%</strong>
          </span>
          <span className="text-slate-600">/</span>
          <span>
            HI: <strong className="text-amber-400">{weather.heatIndex}°C</strong>
          </span>
        </div>

        <div className="text-[11px] text-slate-500">
          Dispatched at {weather.timestamp} · Autonomous System
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Send Mobile Alert button */}
          <button
            onClick={handleTriggerMobileAlert}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all active:scale-95"
            title="Dispatch browser notification to mobile device"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Send Mobile Push Alert</span>
          </button>

          {/* If High or Severe, button to reopen Big Alert Modal */}
          {(riskLevel === 'HIGH' || riskLevel === 'SEVERE') && onOpenAlertModal && (
            <button
              onClick={onOpenAlertModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 text-xs font-bold transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Show Alert Modal</span>
            </button>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2 text-xs">
          {onOpenWhatToDo && (
            <button
              onClick={onOpenWhatToDo}
              className="text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1"
            >
              <span>What To Do</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {onOpenPetCare && (
            <button
              onClick={onOpenPetCare}
              className="text-rose-400 hover:text-rose-300 underline font-medium flex items-center gap-1 ml-2"
            >
              <Heart className="w-3 h-3 fill-rose-400" />
              <span>Pet Care</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notifFeedback && (
        <div className="mt-3 p-2 rounded-xl bg-slate-950 border border-amber-500/60 text-xs text-amber-300 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{notifFeedback}</span>
        </div>
      )}
    </div>
  );
};
