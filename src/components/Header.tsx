import React from 'react';
import { ShieldAlert, Cpu, Heart, BellRing, Sparkles, LogOut, User, MapPin, Gamepad2 } from 'lucide-react';
import { TemperatureUnit } from '../types';
import { UserProfile } from '../types/auth';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  onOpenMLModal: () => void;
  executionMode: 'in-browser-decision-tree' | 'python-backend-api';
  onToggleExecutionMode: () => void;
  currentView: 'human-risk' | 'pet-animal-care' | 'game' | 'admin';
  onSelectView: (view: 'human-risk' | 'pet-animal-care' | 'game' | 'admin') => void;
  onOpenAlertSettings?: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onOpenMLModal,
  executionMode,
  onToggleExecutionMode,
  currentView,
  onSelectView,
  onOpenAlertSettings,
  currentUser,
  onLogout,
}) => {
  // Get initials for avatar
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 shadow-sm shrink-0">
            <ShieldAlert className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectView('human-risk');
                }}
                className="text-base sm:text-lg font-black tracking-tight text-white hover:text-amber-400 transition-colors"
              >
                HeatwaveRisk<span className="text-amber-400">.AI</span>
              </a>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
                2026
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] font-mono text-slate-400">
              heat-waverisk-2026 · Mobile Alerts &amp; Pet NGO Support
            </span>
          </div>
        </div>

        {/* Zone 2: Primary Module Mode Switcher Tabs (Desktop/Tablet) */}
        <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => onSelectView('human-risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'human-risk'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Human Heat Risk</span>
            <span className="md:hidden">Human</span>
          </button>

          <button
            onClick={() => onSelectView('pet-animal-care')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'pet-animal-care'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">PET &amp; STRAY CARE</span>
            <span className="md:hidden">Pets</span>
          </button>

          <button
            onClick={() => onSelectView('game')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'game'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black shadow-md'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Heat Hero Game</span>
            <span className="text-[9px] px-1 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">GAME</span>
          </button>
        </div>

        {/* Zone 3: User Profile, Actions (PWA install, Unit, ML, Logout) */}
        <div className="flex items-center gap-2">
          {/* User Profile Avatar with Name */}
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-amber-500 text-white font-bold font-mono text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="text-left leading-tight hidden lg:block">
                <div className="text-xs font-bold text-slate-100 truncate max-w-[110px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-purple-300 font-mono">
                  Limit: {currentUser.personalThresholdTempC}°C
                </div>
              </div>
            </div>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Alert Settings Quick Jump */}
          {onOpenAlertSettings && (
            <button
              onClick={onOpenAlertSettings}
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-amber-300 font-medium transition-colors"
              title="Configure mobile alert settings"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span>Alerts</span>
            </button>
          )}

          {/* Unit Toggle Button */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onToggleUnit('C')}
              className={`px-2 py-1 rounded transition-colors ${
                unit === 'C'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Celsius"
            >
              °C
            </button>
            <button
              onClick={() => onToggleUnit('F')}
              className={`px-2 py-1 rounded transition-colors ${
                unit === 'F'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Fahrenheit"
            >
              °F
            </button>
          </div>

          {/* Model Backend Bridge Button */}
          <button
            onClick={onOpenMLModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            title="Inspect Machine Learning Model"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>ML</span>
          </button>

          {/* Logout Button */}
          {currentUser && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-medium transition-colors"
              title="Logout from account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
