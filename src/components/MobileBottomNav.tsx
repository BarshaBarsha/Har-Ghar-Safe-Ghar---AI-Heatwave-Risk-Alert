import React from 'react';
import { Home, Compass, Heart, Gamepad2 } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'human-risk' | 'pet-animal-care' | 'game' | 'admin';
  activeTab: 'home' | 'live-map' | 'pets' | 'game';
  onSelectTab: (tab: 'home' | 'live-map' | 'pets' | 'game') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  activeTab,
  onSelectTab,
}) => {
  if (currentView === 'admin' || currentView === 'game') return null;
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto px-2">
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentView === 'human-risk' && activeTab === 'home'
              ? 'text-sky-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentView === 'human-risk' && activeTab === 'home'
                ? 'bg-sky-500/20 shadow-sm shadow-sky-500/30'
                : ''
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Tab 2: Live Map */}
        <button
          onClick={() => onSelectTab('live-map')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentView === 'human-risk' && activeTab === 'live-map'
              ? 'text-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentView === 'human-risk' && activeTab === 'live-map'
                ? 'bg-amber-500/20 shadow-sm shadow-amber-500/30'
                : ''
            }`}
          >
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Live Map</span>
        </button>

        {/* Tab 3: Pets */}
        <button
          onClick={() => onSelectTab('pets')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentView === 'pet-animal-care'
              ? 'text-rose-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentView === 'pet-animal-care'
                ? 'bg-rose-500/20 shadow-sm shadow-rose-500/30'
                : ''
            }`}
          >
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Pets</span>
        </button>

        {/* Tab 4: Game */}
        <button
          onClick={() => onSelectTab('game')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'game'
              ? 'text-amber-400 font-extrabold'
              : 'text-amber-400/80 hover:text-amber-300'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'game'
                ? 'bg-amber-500/20 shadow-sm shadow-amber-500/30'
                : ''
            }`}
          >
            <Gamepad2 className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] tracking-tight font-bold">Game 🎮</span>
        </button>
      </div>
    </nav>
  );
};

