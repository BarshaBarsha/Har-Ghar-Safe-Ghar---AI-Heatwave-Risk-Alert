import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Smartphone,
  MapPin,
  Phone,
  Sliders,
  Check,
  ShieldCheck,
  AlertCircle,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  UserAlertSettings,
  loadAlertSettings,
  saveAlertSettings,
  sendMobileAlertNotification,
  requestNotificationPermission,
  getNotificationPermissionStatus,
  playEmergencyAlertSound,
} from '../services/notificationService';
import { TemperatureUnit } from '../types';

interface AlertSettingsSectionProps {
  currentTempC: number;
  currentHumidity: number;
  currentCityName: string;
  unit: TemperatureUnit;
}

export const AlertSettingsSection: React.FC<AlertSettingsSectionProps> = ({
  currentTempC,
  currentHumidity,
  currentCityName,
  unit,
}) => {
  const [settings, setSettings] = useState<UserAlertSettings>(() => loadAlertSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');

  useEffect(() => {
    setPermissionStatus(getNotificationPermissionStatus());
  }, []);

  const handleCityChange = (cityName: string) => {
    const updated = { ...settings, cityName };
    setSettings(updated);
    saveAlertSettings(updated);
    triggerSavedFeedback();
  };

  const handlePhoneChange = (phoneNumber: string) => {
    const updated = { ...settings, phoneNumber };
    setSettings(updated);
    saveAlertSettings(updated);
    triggerSavedFeedback();
  };

  const handleThresholdChange = (thresholdTempC: number) => {
    const updated = { ...settings, thresholdTempC };
    setSettings(updated);
    saveAlertSettings(updated);
    triggerSavedFeedback();
  };

  const handleTogglePush = async () => {
    const nextState = !settings.pushEnabled;
    if (nextState) {
      const perm = await requestNotificationPermission();
      setPermissionStatus(perm);
      if (perm === 'granted') {
        const updated = { ...settings, pushEnabled: true };
        setSettings(updated);
        saveAlertSettings(updated);
        triggerSavedFeedback();
        setTestStatus('Mobile push alert privileges granted!');
        setTimeout(() => setTestStatus(null), 3500);
      } else {
        setTestStatus('Notification permission was denied in your browser settings.');
        setTimeout(() => setTestStatus(null), 4000);
        return;
      }
    } else {
      const updated = { ...settings, pushEnabled: false };
      setSettings(updated);
      saveAlertSettings(updated);
      triggerSavedFeedback();
    }
  };

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    const updated = { ...settings, soundEnabled: next };
    setSettings(updated);
    saveAlertSettings(updated);
    if (next) playEmergencyAlertSound();
    triggerSavedFeedback();
  };

  const triggerSavedFeedback = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  const handleSendTestNotification = async () => {
    setIsTesting(true);
    setTestStatus('Sending mobile notification...');

    const res = await sendMobileAlertNotification(
      {
        title: `🚨 SEVERE Heatwave Alert in ${settings.cityName}!`,
        body: `42°C detected in ${settings.cityName}. Extreme Heat Risk! Stay indoors, drink ORS & protect pets.`,
        temperatureC: 42,
        riskLevel: 'SEVERE',
        locationName: settings.cityName,
      },
      true // force send
    );

    setTestStatus(res.message);
    setPermissionStatus(getNotificationPermissionStatus());
    setIsTesting(false);
    setTimeout(() => setTestStatus(null), 4500);
  };

  const isTriggeredByCurrentTemp = currentTempC >= settings.thresholdTempC;

  return (
    <section
      id="alert-settings"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden"
    >
      {/* Decorative gradient corner accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/10 via-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header with Live Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BellRing className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              My Alert Settings
            </h2>
            {isSaved && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" /> Auto-saved
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Configure automated mobile push and local broadcast thresholds for extreme heatwave warnings.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2.5">
          {settings.pushEnabled ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-600/60 shadow-sm shadow-emerald-500/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-300">
                Alert Active - You will be notified
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-xs font-medium">Alerts Paused</span>
            </div>
          )}
        </div>
      </div>

      {/* Ephemeral Feedback Toast */}
      {testStatus && (
        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-amber-500/50 text-xs text-amber-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{testStatus}</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
        {/* Field 1: City Name */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              City Name / Watch Zone
            </span>
            <button
              type="button"
              onClick={() => handleCityChange(currentCityName)}
              className="text-[10px] text-amber-400/80 hover:text-amber-300 underline"
            >
              Use Current
            </button>
          </label>
          <input
            type="text"
            value={settings.cityName}
            onChange={(e) => handleCityChange(e.target.value)}
            placeholder="e.g. Bhubaneswar, Odisha"
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          />
          <div className="flex gap-1.5 flex-wrap pt-0.5">
            {['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Delhi'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCityChange(`${c}, India`)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Field 2: Phone Number (Optional for SMS dispatch simulation) */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Phone Number <span className="text-[10px] text-slate-500 font-normal">(Optional SMS)</span>
            </span>
          </label>
          <input
            type="tel"
            value={settings.phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          />
          <p className="text-[11px] text-slate-500">
            Emergency alert dispatch logs will record this contact.
          </p>
        </div>

        {/* Field 3: Threshold Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              Threshold Temperature
            </span>
            <span className="font-mono font-bold text-rose-400 text-xs">
              &gt; {settings.thresholdTempC}°C
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <input
              type="range"
              min="35"
              max="48"
              step="1"
              value={settings.thresholdTempC}
              onChange={(e) => handleThresholdChange(parseInt(e.target.value, 10))}
              className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>35°C (Warm)</span>
              <span className="text-amber-400 font-bold">Trigger at {settings.thresholdTempC}°C</span>
              <span>48°C (Extreme)</span>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex gap-1.5 pt-0.5">
            {[38, 40, 42, 44].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleThresholdChange(t)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-colors ${
                  settings.thresholdTempC === t
                    ? 'bg-rose-950/70 border-rose-600 text-rose-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                &gt;{t}°C
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Action Strip */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Toggles */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Push alert toggle */}
          <button
            type="button"
            onClick={handleTogglePush}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              settings.pushEnabled
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {settings.pushEnabled ? <BellRing className="w-3.5 h-3.5 stroke-[2.5]" /> : <Bell className="w-3.5 h-3.5" />}
            <span>{settings.pushEnabled ? 'Push Alerts: ON' : 'Push Alerts: OFF'}</span>
          </button>

          {/* Audio Chime toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              settings.soundEnabled
                ? 'bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
            title="Play siren chime on alerts"
          >
            {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{settings.soundEnabled ? 'Siren Audio: On' : 'Siren Audio: Muted'}</span>
          </button>
        </div>

        {/* Right: Test button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSendTestNotification}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTesting ? 'Sending Alert...' : 'Send Test Mobile Push Alert'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
