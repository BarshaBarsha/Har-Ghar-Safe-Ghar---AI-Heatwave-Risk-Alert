import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  Award,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Heart,
  Sun,
  Flame,
  Droplets,
  HelpCircle,
  Sparkles,
  QrCode,
  Share2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../services/soundEffects';

interface Character {
  id: string;
  type: 'dog' | 'farmer' | 'elder';
  name: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  heatLevel: number; // 0 (cool) to 100 (heatstroke)
  maxHeatTime: number; // seconds before heatstroke
  status: 'thirsty' | 'saved' | 'heatstroke';
  neededItem: 'water' | 'hat' | 'ors';
  speech: string;
}

interface ItemTool {
  id: 'water' | 'hat' | 'ors';
  name: string;
  targetType: 'dog' | 'farmer' | 'elder';
  icon: string;
  label: string;
  sub: string;
  color: string;
}

interface HeatHeroGameProps {
  onBackToApp: () => void;
}

export const HeatHeroGame: React.FC<HeatHeroGameProps> = ({ onBackToApp }) => {
  // Game states
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLevelCleared, setIsLevelCleared] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [bgmActive, setBgmActive] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<'water' | 'hat' | 'ors' | null>('water');
  const [floatingTexts, setFloatingTexts] = useState<Array<{ id: number; text: string; x: number; y: number; color: string }>>([]);

  // Sun horizontal animation position (0 to 100%)
  const [sunPos, setSunPos] = useState<number>(10);

  // Level configurations
  const levelConfigs = {
    1: {
      temp: 33.5,
      risk: 'LOW' as const,
      color: 'emerald',
      timer: 45,
      sunClass: 'from-amber-400 to-yellow-300',
      title: 'Level 1: Morning Heat (33.5°C - LOW Risk)',
      description: 'Morning temperature is rising. Deliver water bowls to thirsty street dogs and hats to early farmers!',
      targetSaved: 4,
    },
    2: {
      temp: 38.0,
      risk: 'HIGH' as const,
      color: 'orange',
      timer: 35,
      sunClass: 'from-orange-500 to-amber-500',
      title: 'Level 2: Afternoon Surge (38.0°C - HIGH Risk)',
      description: 'Sun is burning hot! The stray dogs are panting and farmers need hats and ORS quickly!',
      targetSaved: 5,
    },
    3: {
      temp: 42.5,
      risk: 'SEVERE' as const,
      color: 'rose',
      timer: 30,
      sunClass: 'from-rose-600 via-red-500 to-amber-500',
      title: 'Level 3: Jatani Peak Hotspot (42.5°C - SEVERE Heatwave)',
      description: 'RED ALERT! The angry sun is blazing over Jatani village. Rapid heatstrokes imminent — save everyone!',
      targetSaved: 6,
    },
  };

  const currentConfig = levelConfigs[level];

  // Characters in current level
  const [characters, setCharacters] = useState<Character[]>([]);

  // Spawn characters based on level
  const spawnCharactersForLevel = useCallback((lvl: 1 | 2 | 3): Character[] => {
    if (lvl === 1) {
      return [
        { id: 'c1', type: 'dog', name: 'Sheru', x: 22, y: 62, heatLevel: 25, maxHeatTime: 16, status: 'thirsty', neededItem: 'water', speech: 'Bhau! Water please...' },
        { id: 'c2', type: 'farmer', name: 'Ramesh', x: 48, y: 46, heatLevel: 20, maxHeatTime: 18, status: 'thirsty', neededItem: 'hat', speech: 'Dhoop bohot tez hai!' },
        { id: 'c3', type: 'dog', name: 'Tommy', x: 74, y: 68, heatLevel: 30, maxHeatTime: 14, status: 'thirsty', neededItem: 'water', speech: 'Panting heavily...' },
        { id: 'c4', type: 'elder', name: 'Dadi', x: 34, y: 76, heatLevel: 15, maxHeatTime: 20, status: 'thirsty', neededItem: 'ors', speech: 'Chakkar aa rahe hain...' },
      ];
    } else if (lvl === 2) {
      return [
        { id: 'c1', type: 'dog', name: 'Sheru', x: 18, y: 60, heatLevel: 35, maxHeatTime: 13, status: 'thirsty', neededItem: 'water', speech: 'So hot... need bowl!' },
        { id: 'c2', type: 'farmer', name: 'Ramesh', x: 42, y: 42, heatLevel: 40, maxHeatTime: 12, status: 'thirsty', neededItem: 'hat', speech: 'Need hat immediately!' },
        { id: 'c3', type: 'elder', name: 'Kaka', x: 65, y: 55, heatLevel: 45, maxHeatTime: 11, status: 'thirsty', neededItem: 'ors', speech: 'Dehydration ho raha hai!' },
        { id: 'c4', type: 'dog', name: 'Bruno', x: 82, y: 66, heatLevel: 40, maxHeatTime: 12, status: 'thirsty', neededItem: 'water', speech: 'Whining under sun...' },
        { id: 'c5', type: 'farmer', name: 'Balaram', x: 30, y: 78, heatLevel: 30, maxHeatTime: 14, status: 'thirsty', neededItem: 'hat', speech: 'No shade in field!' },
      ];
    } else {
      // Level 3 - 42.5°C Severe
      return [
        { id: 'c1', type: 'dog', name: 'Sheru', x: 15, y: 64, heatLevel: 50, maxHeatTime: 9, status: 'thirsty', neededItem: 'water', speech: 'Severe panting!' },
        { id: 'c2', type: 'farmer', name: 'Ramesh', x: 38, y: 44, heatLevel: 55, maxHeatTime: 9, status: 'thirsty', neededItem: 'hat', speech: 'Head is spinning 42.5°C!' },
        { id: 'c3', type: 'elder', name: 'Dadi', x: 58, y: 52, heatLevel: 60, maxHeatTime: 8, status: 'thirsty', neededItem: 'ors', speech: 'Emergency ORS please!' },
        { id: 'c4', type: 'dog', name: 'Tommy', x: 78, y: 62, heatLevel: 55, maxHeatTime: 8, status: 'thirsty', neededItem: 'water', speech: 'Tongue dry... need bowl!' },
        { id: 'c5', type: 'farmer', name: 'Sunita', x: 26, y: 76, heatLevel: 45, maxHeatTime: 10, status: 'thirsty', neededItem: 'hat', speech: 'Direct sun burns skin!' },
        { id: 'c6', type: 'dog', name: 'Puppy Golu', x: 88, y: 75, heatLevel: 65, maxHeatTime: 7, status: 'thirsty', neededItem: 'water', speech: 'Help little puppy!' },
      ];
    }
  }, []);

  // Initialize level
  const startLevel = useCallback((lvl: 1 | 2 | 3) => {
    setLevel(lvl);
    setTimeLeft(levelConfigs[lvl].timer);
    setCharacters(spawnCharactersForLevel(lvl));
    setIsGameOver(false);
    setIsLevelCleared(false);
    setIsPlaying(true);
    setSunPos(10);
  }, [spawnCharactersForLevel]);

  // Initial mount
  useEffect(() => {
    startLevel(1);
    return () => {
      sound.stopBGM();
    };
  }, [startLevel]);

  // Main game tick (1 second loop)
  useEffect(() => {
    if (!isPlaying || isGameOver || isLevelCleared) return;

    const interval = window.setInterval(() => {
      // Advance sun across sky
      setSunPos((prev) => (prev >= 90 ? 10 : prev + 2.5));

      // Decrement timer
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Timer ended
          evaluateLevelEnd();
          return 0;
        }
        return prevTime - 1;
      });

      // Increase character heat levels
      setCharacters((prevChars) => {
        return prevChars.map((char) => {
          if (char.status === 'saved' || char.status === 'heatstroke') return char;

          // Heat rises faster in higher levels
          const increment = level === 1 ? 5 : level === 2 ? 7 : 10;
          const nextHeat = char.heatLevel + increment;

          if (nextHeat >= 100) {
            // Character succumbed to heatstroke
            sound.playHeatstrokeWarning();
            setScore((s) => Math.max(0, s - 5));
            addFloatingText('-5 Heatstroke!', char.x, char.y - 8, '#f43f5e');
            return {
              ...char,
              heatLevel: 100,
              status: 'heatstroke',
              speech: 'Fainted due to heatstroke! Needs ice immediately.',
            };
          }

          return {
            ...char,
            heatLevel: nextHeat,
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, isLevelCleared, level]);

  // Check if all characters are resolved
  useEffect(() => {
    if (!isPlaying || isGameOver || isLevelCleared) return;

    const allResolved = characters.every((c) => c.status === 'saved' || c.status === 'heatstroke');
    if (allResolved && characters.length > 0) {
      evaluateLevelEnd();
    }
  }, [characters, isPlaying, isGameOver, isLevelCleared]);

  const evaluateLevelEnd = () => {
    const savedCount = characters.filter((c) => c.status === 'saved').length;
    const required = currentConfig.targetSaved;

    if (savedCount >= required - 1) {
      // Cleared!
      sound.playVictoryFanfare();
      triggerConfetti();

      if (level === 3) {
        setIsGameWon(true);
        setIsLevelCleared(true);
        setIsPlaying(false);
      } else {
        setIsLevelCleared(true);
        setIsPlaying(false);
      }
    } else {
      // Failed level
      sound.playHeatstrokeWarning();
      setIsGameOver(true);
      setIsPlaying(false);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Action: Deliver item to character
  const handleRescueCharacter = (character: Character) => {
    if (!isPlaying || character.status !== 'thirsty') return;

    const item = selectedItem;
    if (!item) return;

    // Check item match
    if (item === character.neededItem) {
      sound.playRescueSound();
      setScore((s) => s + 10);
      addFloatingText('+10 Saved!', character.x, character.y - 10, '#10b981');

      setCharacters((prev) =>
        prev.map((c) =>
          c.id === character.id
            ? {
                ...c,
                status: 'saved',
                heatLevel: 0,
                speech:
                  character.type === 'dog'
                    ? 'Slurp! Tail wagging! Thank you Heat Hero!'
                    : 'Aah, relief! Blessed water & shade!',
              }
            : c
        )
      );
    } else {
      // Wrong item
      sound.playHeatstrokeWarning();
      const hint =
        character.neededItem === 'water'
          ? 'Needs Water Bowl 🥣'
          : character.neededItem === 'hat'
          ? 'Needs Farmer Hat 🧢'
          : 'Needs ORS Electrolyte 🧃';
      addFloatingText(`Wrong item! ${hint}`, character.x, character.y - 10, '#f59e0b');
    }
  };

  // Drag and Drop support
  const handleDragStart = (e: React.DragEvent, itemId: 'water' | 'hat' | 'ors') => {
    e.dataTransfer.setData('text/plain', itemId);
    setSelectedItem(itemId);
    sound.playPickupSound();
  };

  const handleDrop = (e: React.DragEvent, character: Character) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') as 'water' | 'hat' | 'ors';
    if (itemId) {
      setSelectedItem(itemId);
      handleRescueCharacter(character);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Sound BGM Toggle
  const handleToggleBgm = () => {
    const isNowPlaying = sound.toggleBGM();
    setBgmActive(isNowPlaying);
  };

  const items: ItemTool[] = [
    {
      id: 'water',
      name: 'Water Bowl',
      targetType: 'dog',
      icon: '🥣',
      label: 'Cold Water Bowl',
      sub: 'Drag to Dogs 🐕',
      color: 'border-sky-500 bg-sky-950/80 text-sky-300',
    },
    {
      id: 'hat',
      name: 'Farmer Hat',
      targetType: 'farmer',
      icon: '🧢',
      label: 'Protective Hat',
      sub: 'Drag to Farmers 👨‍🌾',
      color: 'border-amber-500 bg-amber-950/80 text-amber-300',
    },
    {
      id: 'ors',
      name: 'ORS Electrolyte',
      targetType: 'elder',
      icon: '🧃',
      label: 'Cool ORS Drink',
      sub: 'Drag to Elders/Kids 👵',
      color: 'border-emerald-500 bg-emerald-950/80 text-emerald-300',
    },
  ];

  const savedCount = characters.filter((c) => c.status === 'saved').length;
  const heatstrokeCount = characters.filter((c) => c.status === 'heatstroke').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative overflow-hidden">
      {/* Top Header & Telemetry Bar */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Exit */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToApp}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
              title="Return to Main Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Back to App</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">☀️</span>
              <div>
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                  <span>Har Ghar Safe</span>
                  <span className="text-amber-400 font-mono text-xs uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    Heat Hero Game
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Educational Heat Action Game · Save Jatani Village from Extreme Heatwave
                </p>
              </div>
            </div>
          </div>

          {/* Real-Time Telemetry Bar (Temp, Risk, Score, Timer) */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* LIVE Temp Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[10px]">LIVE TEMP:</span>
              <strong
                className={`text-sm ${
                  currentConfig.risk === 'LOW'
                    ? 'text-emerald-400'
                    : currentConfig.risk === 'HIGH'
                    ? 'text-orange-400'
                    : 'text-rose-400 animate-pulse'
                }`}
              >
                {currentConfig.temp}°C
              </strong>
            </div>

            {/* Risk Badge */}
            <div
              className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono font-black uppercase flex items-center gap-1 ${
                currentConfig.risk === 'LOW'
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : currentConfig.risk === 'HIGH'
                  ? 'bg-orange-950/80 border-orange-600 text-orange-300'
                  : 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Risk {currentConfig.risk}</span>
            </div>

            {/* Score */}
            <div className="px-3 py-1 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-mono">
              <span className="text-amber-300 font-bold">Score: </span>
              <strong className="text-amber-400 text-sm">{score}</strong>
            </div>

            {/* Timer */}
            <div
              className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold flex items-center gap-1 ${
                timeLeft <= 10
                  ? 'bg-rose-950 border-rose-500 text-rose-300 animate-bounce'
                  : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            >
              <span>⏱️</span>
              <span>{timeLeft}s</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleBgm}
              className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1 ${
                bgmActive
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Background 8-Bit Hero Music"
            >
              {bgmActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline font-mono text-[10px]">
                {bgmActive ? 'BGM ON' : 'BGM OFF'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-3 relative z-10">
        {/* Level Banner & Objective Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/80 border border-slate-800/90 rounded-2xl px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/30">
              LEVEL {level} / 3
            </span>
            <span className="font-semibold text-slate-200">{currentConfig.title}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <span className="text-emerald-400 font-bold">Saved:</span>
              <span className="text-white font-black">{savedCount}</span> / {currentConfig.targetSaved}
            </span>
            {heatstrokeCount > 0 && (
              <span className="flex items-center gap-1 text-rose-400">
                <span>Heatstrokes:</span>
                <span className="font-black">{heatstrokeCount}</span>
              </span>
            )}
          </div>
        </div>

        {/* INTERACTIVE GAME CANVAS / MAP ARENA */}
        <div className="flex-1 min-h-[420px] sm:min-h-[480px] rounded-3xl border-2 border-slate-800 bg-gradient-to-b from-sky-950/40 via-amber-950/20 to-slate-950 relative overflow-hidden shadow-2xl flex flex-col">
          {/* Dynamic Sky Background with Moving Sun */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Moving Hot Sun */}
            <div
              className="absolute top-4 transition-all duration-1000 ease-linear pointer-events-none z-10 flex flex-col items-center"
              style={{ left: `${sunPos}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr ${currentConfig.sunClass} shadow-2xl flex items-center justify-center animate-spin-slow relative`}
                style={{
                  boxShadow:
                    level === 3
                      ? '0 0 60px rgba(239, 68, 68, 0.9), 0 0 100px rgba(245, 158, 11, 0.6)'
                      : level === 2
                      ? '0 0 45px rgba(245, 158, 11, 0.8)'
                      : '0 0 30px rgba(251, 191, 36, 0.6)',
                }}
              >
                {/* Angry Sun Face */}
                <div className="text-2xl sm:text-3xl select-none">
                  {level === 3 ? '😡' : level === 2 ? '🥵' : '😎'}
                </div>
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-950/90 border border-amber-500/50 text-[10px] font-mono font-bold text-amber-300 whitespace-nowrap shadow-md">
                {level === 3 ? '🔥 42.5°C SEVERE SUN' : level === 2 ? '☀️ 38.0°C HIGH' : '🌤️ 33.5°C'}
              </span>
            </div>

            {/* Animated Heat Shimmer Waves */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-rose-500/5 to-transparent pointer-events-none animate-pulse" />

            {/* Jatani Village Landscape Elements */}
            {/* Distant Hills & Temple Silhouette */}
            <div className="absolute bottom-24 left-0 right-0 h-40 opacity-20 pointer-events-none flex items-end justify-between px-8 text-6xl">
              <span>🌾</span>
              <span>🛕</span>
              <span>🌳</span>
              <span>🌾</span>
              <span>🏡</span>
              <span>🌾</span>
            </div>

            {/* Village Ground: Bada Raghunathpur, Jatani */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-amber-950/60 to-transparent border-t border-amber-900/30" />
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-500">
              📍 Jatani Village Zone · Agricultural Lands &amp; Community Colony
            </div>
          </div>

          {/* Floating score / feedback notifications */}
          {floatingTexts.map((ft) => (
            <div
              key={ft.id}
              className="absolute z-30 font-black text-sm sm:text-base pointer-events-none animate-bounce font-mono drop-shadow-md"
              style={{
                left: `${ft.x}%`,
                top: `${ft.y}%`,
                color: ft.color,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {ft.text}
            </div>
          ))}

          {/* Interactive Characters on Map */}
          <div className="relative z-20 flex-1 w-full h-full p-4">
            {characters.map((char) => {
              const isSaved = char.status === 'saved';
              const isFainted = char.status === 'heatstroke';
              const isThirsty = char.status === 'thirsty';

              return (
                <div
                  key={char.id}
                  onDrop={(e) => handleDrop(e, char)}
                  onDragOver={handleDragOver}
                  onClick={() => handleRescueCharacter(char)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 p-2 rounded-2xl flex flex-col items-center group ${
                    isSaved
                      ? 'scale-105'
                      : isFainted
                      ? 'opacity-70 grayscale'
                      : 'hover:scale-110 active:scale-95'
                  }`}
                  style={{ left: `${char.x}%`, top: `${char.y}%` }}
                >
                  {/* Speech Bubble */}
                  <div
                    className={`mb-1 px-2.5 py-1 rounded-xl text-[10px] font-sans font-bold shadow-lg text-center max-w-[140px] whitespace-normal transition-all ${
                      isSaved
                        ? 'bg-emerald-900 text-emerald-200 border border-emerald-500'
                        : isFainted
                        ? 'bg-rose-950 text-rose-300 border border-rose-600'
                        : char.heatLevel > 60
                        ? 'bg-rose-900 text-white border border-rose-500 animate-pulse'
                        : 'bg-slate-900 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isSaved ? '❤️ Saved!' : isFainted ? '⚠️ Heatstroke!' : char.speech}
                  </div>

                  {/* Character Avatar & Heat Bar */}
                  <div className="relative">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-all ${
                        isSaved
                          ? 'bg-emerald-950/80 border-2 border-emerald-400 ring-4 ring-emerald-500/20'
                          : isFainted
                          ? 'bg-rose-950/90 border-2 border-rose-600'
                          : 'bg-slate-900/90 border-2 border-slate-700 hover:border-amber-400'
                      }`}
                    >
                      {isSaved ? (
                        char.type === 'dog' ? '🐶' : '😊'
                      ) : isFainted ? (
                        '😵'
                      ) : char.type === 'dog' ? (
                        '🐕'
                      ) : char.type === 'farmer' ? (
                        '👨‍🌾'
                      ) : (
                        '👵'
                      )}
                    </div>

                    {/* Needed Item Indicator Badge */}
                    {isThirsty && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-xs shadow-md animate-bounce">
                        {char.neededItem === 'water'
                          ? '🥣'
                          : char.neededItem === 'hat'
                          ? '🧢'
                          : '🧃'}
                      </div>
                    )}
                  </div>

                  {/* Character Name & Status */}
                  <span className="mt-1 font-bold text-xs text-white drop-shadow">
                    {char.name}
                  </span>

                  {/* Heat Timer Progress Bar */}
                  {isThirsty && (
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700">
                      <div
                        className={`h-full transition-all duration-500 ${
                          char.heatLevel > 70
                            ? 'bg-rose-500 animate-pulse'
                            : char.heatLevel > 40
                            ? 'bg-amber-500'
                            : 'bg-sky-400'
                        }`}
                        style={{ width: `${char.heatLevel}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Help Overlay inside Canvas */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-xl p-2.5 text-[11px] max-w-xs pointer-events-none hidden sm:block">
            <span className="text-amber-400 font-bold block">💡 How to Play:</span>
            <span className="text-slate-300">
              Drag tools from bottom onto thirsty dogs and farmers, or <strong>tap a tool</strong> then <strong>tap the character</strong>!
            </span>
          </div>
        </div>

        {/* BOTTOM DRAGGABLE TOOLBAR / INVENTORY */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>Heat Protection Inventory (Drag or Tap to Select):</span>
            </span>
            <span className="text-[11px] text-amber-400/90 font-mono">
              +10 for each rescue · -5 for heatstroke
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {items.map((item) => {
              const isSelected = selectedItem === item.id;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onClick={() => {
                    setSelectedItem(item.id);
                    sound.playPickupSound();
                  }}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left ${
                    isSelected
                      ? `${item.color} ring-4 ring-amber-400/30 scale-[1.02] shadow-lg`
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{item.icon}</span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-white">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                      {item.sub}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="hidden sm:inline-block ml-auto text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* MODAL 1: LEVEL CLEARED / NEXT LEVEL */}
      {isLevelCleared && !isGameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center text-3xl">
              🎉
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Level {level} Completed!</h2>
              <p className="text-xs text-slate-400 mt-1">
                You saved {savedCount} lives in Jatani village before the heat took over!
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-amber-300">
              Total Score: <strong>{score} pts</strong>
            </div>

            <button
              onClick={() => startLevel((level + 1) as 2 | 3)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Advance to Level {level + 1}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: GAME OVER / FAILED LEVEL (With Heatstroke Tips & App QR Code) */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-rose-800/80 p-6 space-y-5 shadow-2xl relative my-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center text-3xl">
                ⚠️
              </div>
              <h2 className="text-xl font-black text-white">Heat Wave Alert — Game Over</h2>
              <p className="text-xs text-rose-300 font-medium">
                The sun at {currentConfig.temp}°C was too intense. But real lives can still be protected!
              </p>
            </div>

            {/* MANDATED REQUIREMENT: Heat Safety Tips */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 font-mono text-xs uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Life-Saving Heatwave Advisories:</span>
              </span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px] leading-relaxed">
                <li>
                  <strong>Drink water frequently</strong>, even if you are not thirsty.
                </li>
                <li>
                  <strong>Stay indoors</strong> during peak afternoon heat (11:00 AM - 3:30 PM).
                </li>
                <li>
                  <strong>Keep water bowls outside</strong> in shaded spots for street dogs and birds.
                </li>
                <li>
                  <strong>Carry ORS / electrolytes</strong> and wear loose, light cotton clothes with a wide hat.
                </li>
              </ul>
            </div>

            {/* MANDATED REQUIREMENT: App QR Code & Link */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-sky-400" />
                  <span>HeatwaveRisk.AI Live Monitor</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Scan QR or use app to check real-time Jatani 42.5°C live alerts.
                </p>
                <div className="text-[10px] font-mono text-sky-300">
                  heat-waverisk-2026.app
                </div>
              </div>

              {/* High-Contrast SVG QR Code Representation */}
              <div className="w-20 h-20 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  {/* Top-left position block */}
                  <rect x="10" y="10" width="25" height="25" fill="#020617" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="19" y="19" width="7" height="7" fill="#020617" />
                  {/* Top-right position block */}
                  <rect x="65" y="10" width="25" height="25" fill="#020617" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="74" y="19" width="7" height="7" fill="#020617" />
                  {/* Bottom-left position block */}
                  <rect x="10" y="65" width="25" height="25" fill="#020617" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="19" y="74" width="7" height="7" fill="#020617" />
                  {/* Mock pattern dots */}
                  <rect x="42" y="15" width="6" height="6" fill="#020617" />
                  <rect x="52" y="25" width="6" height="6" fill="#020617" />
                  <rect x="42" y="45" width="16" height="16" fill="#020617" />
                  <rect x="65" y="45" width="8" height="8" fill="#020617" />
                  <rect x="75" y="65" width="8" height="8" fill="#020617" />
                  <rect x="45" y="75" width="12" height="12" fill="#020617" />
                  <rect x="65" y="78" width="10" height="10" fill="#020617" />
                </svg>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => startLevel(level)}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Level {level}</span>
              </button>
              <button
                onClick={onBackToApp}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FINAL VICTORY (Winner Confetti + Award) */}
      {isGameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-amber-500/60 p-6 text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-bl-full pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30">
              🏆
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Champion of Jatani Village
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Param Heat Hero Award!
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                You saved community dogs, farmers, and elders from lethal 42.5°C heatstroke!
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Final Score</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{score} pts</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Lives Protected</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">100% Safe</span>
              </div>
            </div>

            {/* Heat Safety Tips */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-700/60 rounded-xl text-left text-xs text-emerald-200">
              <strong>Heat Hero Golden Rule:</strong> Always keep a bowl of clean water in shaded corners outside your home for stray animals during summers!
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setScore(0);
                  startLevel(1);
                  setIsGameWon(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase"
              >
                Play Again
              </button>
              <button
                onClick={onBackToApp}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs uppercase shadow-lg shadow-amber-500/20"
              >
                Open Main App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
