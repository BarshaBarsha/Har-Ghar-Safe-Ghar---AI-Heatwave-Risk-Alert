import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  BellRing,
  X,
  Volume2,
  Check,
  ShieldAlert,
  ArrowRight,
  Thermometer,
  Droplets,
  HeartPulse,
} from 'lucide-react';
import { PredictionResult, WeatherData, TemperatureUnit } from '../types';
import {
  sendMobileAlertNotification,
  requestNotificationPermission,
  getNotificationPermissionStatus,
  playEmergencyAlertSound,
} from '../services/notificationService';
import { celsiusToFahrenheit } from '../services/heatIndexCalculator';

interface ExtremeHeatAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionResult;
  weather: WeatherData;
  unit: TemperatureUnit;
  onOpenWhatToDo: () => void;
  onOpenPetCare?: () => void;
}

export const ExtremeHeatAlertModal: React.FC<ExtremeHeatAlertModalProps> = ({
  isOpen,
  onClose,
  prediction,
  weather,
  unit,
  onOpenWhatToDo,
  onOpenPetCare,
}) => {
  const [notificationSent, setNotificationSent] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const isSevere = prediction.riskLevel === 'SEVERE';
  const displayTemp =
    unit === 'C'
      ? weather.temperature
      : Math.round(celsiusToFahrenheit(weather.temperature) * 10) / 10;

  const handleEnableMobileAlerts = async () => {
    setIsSending(true);
    playEmergencyAlertSound();

    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      const res = await sendMobileAlertNotification(
        {
          title: `🚨 ${prediction.riskLevel} HEATWAVE ALERT!`,
          body: `${prediction.riskLevel} Heatwave Alert in your area! ${weather.temperature}°C detected in ${weather.locationName}. Stay indoors!`,
          temperatureC: weather.temperature,
          riskLevel: prediction.riskLevel,
          locationName: weather.locationName,
        },
        true // force bypass cooldown for manual button click
      );
      setNotificationSent(true);
      setNotificationMessage(res.message);
    } else if (perm === 'denied') {
      setNotificationMessage('Notifications blocked by browser. Please enable permissions in site settings.');
    } else {
      setNotificationMessage('Mobile notifications enabled in your browser.');
    }
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Dialog Card */}
      <div
        className={`w-full max-w-lg rounded-3xl border-2 shadow-2xl p-6 sm:p-7 relative overflow-hidden transition-all ${
          isSevere
            ? 'border-rose-600 bg-gradient-to-b from-rose-950/90 via-slate-900 to-slate-950 shadow-rose-950/80 ring-4 ring-rose-500/30 animate-severe-shake'
            : 'border-orange-500 bg-gradient-to-b from-orange-950/80 via-slate-900 to-slate-950 shadow-orange-950/70 ring-4 ring-orange-500/20'
        }`}
      >
        {/* Ambient Top Light Beam */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl rounded-full pointer-events-none ${
            isSevere ? 'bg-rose-600/40' : 'bg-orange-500/30'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800/80 transition-colors z-10"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Alert Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
              isSevere
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-orange-500 text-slate-950'
            }`}
          >
            <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider border ${
                  isSevere
                    ? 'border-rose-400 text-rose-300 bg-rose-950/60'
                    : 'border-orange-400 text-orange-200 bg-orange-950/60'
                }`}
              >
                {prediction.riskLevel} CRITICAL ADVISORY
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              EXTREME HEAT ALERT!
            </h2>
          </div>
        </div>

        {/* Big Temperature & Location Display */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Detected Condition
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black text-rose-400 font-mono tracking-tight">
                {displayTemp}°{unit}
              </span>
              <span className="text-xs font-medium text-slate-300">
                · {weather.humidity}% RH
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>Zone:</span>
              <span className="text-slate-200 font-semibold truncate max-w-[200px]">
                {weather.locationName}
              </span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Apparent Heat Index
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
              {weather.heatIndex}°C
            </span>
            <span className="text-[10px] text-rose-400 font-semibold block">
              Danger to human life
            </span>
          </div>
        </div>

        {/* Warning Statement */}
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs sm:text-sm text-rose-100 leading-relaxed font-medium mb-5">
          <p>
            {prediction.alertStatement ||
              `Severe heatwave conditions detected. Prolonged outdoor exposure carries acute risk of heat exhaustion, dehydration, and life-threatening heat stroke.`}
          </p>
        </div>

        {/* Notification Status Message */}
        {notificationMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMessage}</span>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="space-y-2.5">
          {/* Main Action: Enable Mobile Alerts */}
          <button
            onClick={handleEnableMobileAlerts}
            disabled={isSending}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:from-amber-300 hover:to-rose-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <BellRing className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>
              {notificationSent
                ? 'Mobile Alert Dispatched · Push Active'
                : 'Enable Mobile Alerts (Push Notification)'}
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
              <span>View What To Do (Advisory)</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {onOpenPetCare && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPetCare();
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Protect Pets &amp; Strays</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
          >
            Acknowledge &amp; Dismiss Popup
          </button>
        </div>
      </div>
    </div>
  );
};
