import React, { useState } from 'react';
import {
  ShieldAlert,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Heart,
  Sliders,
} from 'lucide-react';
import { UserProfile } from '../types/auth';
import { loginOrRegisterMock } from '../services/authService';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onOpenAdminLogin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onOpenAdminLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(false); // default to Create Account or easy toggle
  const [name, setName] = useState<string>('Sahil Kumar');
  const [email, setEmail] = useState<string>('sahil@heatwave.ai');
  const [phone, setPhone] = useState<string>('+91 94370 12345');
  const [location, setLocation] = useState<string>('Bada Raghunathpur, Bhubaneswar');
  const [thresholdTempC, setThresholdTempC] = useState<number>(39);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginOrRegisterMock(
      name,
      email,
      phone,
      location,
      thresholdTempC
    );
    onLoginSuccess(user);
  };

  const handleQuickDemoLogin = () => {
    const demoUser = loginOrRegisterMock(
      'Sahil Kumar',
      'sahil@heatwave.ai',
      '+91 94370 12345',
      'Bada Raghunathpur, Bhubaneswar',
      39
    );
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-10">
      {/* Centered Glassmorphic Login Container */}
      <div className="w-full max-w-md relative">
        {/* Glow halo behind the card */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-100 transition duration-1000 animate-pulse pointer-events-none" />

        <div className="relative bg-slate-900/85 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-slate-950 shadow-lg shadow-amber-500/20 mb-1">
              <ShieldAlert className="w-8 h-8 text-slate-950" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>AI Heatwave Health Risk &amp; Local Alert</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome to HeatwaveRisk<span className="text-amber-400">.AI</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Real-time heatwave monitoring, AI/ML risk classification, personalized danger thresholds, and stray animal care.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isLoginMode
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isLoginMode
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sahil Kumar"
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
              />
            </div>

            {/* Phone Field (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phone Number</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Optional</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94370 12345"
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
              />
            </div>

            {/* Location Field (Default: Bhanjanagar, Odisha) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Location (Watch Zone)</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bhanjanagar, Odisha"
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
              />
              <div className="flex gap-1.5 pt-0.5">
                {['Bada Raghunathpur, Bhubaneswar', 'Bhanjanagar, Odisha', 'Cuttack, Odisha'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                  >
                    {loc.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Personal Threshold Temp (Default: 39°C) */}
            {!isLoginMode && (
              <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    Personal Danger Threshold:
                  </span>
                  <span className="font-mono font-bold text-purple-300 text-sm">
                    {thresholdTempC}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="45"
                  step="1"
                  value={thresholdTempC}
                  onChange={(e) => setThresholdTempC(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                />
                <p className="text-[11px] text-slate-400 leading-tight">
                  You will get an exclusive personalized alert whenever temperature crosses {thresholdTempC}°C.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoginMode ? 'Login to Dashboard' : 'Create Account & Enter'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Quick 1-Click Hackathon Demo Login */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ Fast Demo Login (Bhanjanagar, Odisha)</span>
            </button>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
              <span>Demo persists in browser localStorage.</span>
              {onOpenAdminLogin && (
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="font-mono text-amber-400/80 hover:text-amber-300 hover:underline flex items-center gap-1"
                >
                  <span>🔐 Admin Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
