import React, { useState } from 'react';
import {
  Activity,
  HelpCircle,
  ShieldCheck,
  Droplets,
  Home,
  Sun,
  PhoneCall,
  Languages,
  AlertTriangle,
  HeartPulse,
  Thermometer,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { PredictionResult, WeatherData, TemperatureUnit } from '../types';
import { celsiusToFahrenheit } from '../services/heatIndexCalculator';

interface WhatToDoSectionProps {
  prediction: PredictionResult;
  weather: WeatherData;
  unit: TemperatureUnit;
  activeTab?: 'live-status' | 'what-is-happening' | 'what-to-do';
}

export const WhatToDoSection: React.FC<WhatToDoSectionProps> = ({
  prediction,
  weather,
  unit,
  activeTab: initialTab = 'live-status',
}) => {
  const [activeTab, setActiveTab] = useState<'live-status' | 'what-is-happening' | 'what-to-do'>(
    initialTab
  );
  const [languageMode, setLanguageMode] = useState<'both' | 'en' | 'hi'>('both');

  const displayTemp =
    unit === 'C'
      ? weather.temperature
      : Math.round(celsiusToFahrenheit(weather.temperature) * 10) / 10;

  // Calculate needle angle for gauge: -90deg (0°C) to 90deg (55°C)
  const clampedTemp = Math.max(15, Math.min(52, weather.temperature));
  const gaugePercent = (clampedTemp - 15) / (52 - 15);
  const needleRotation = -90 + gaugePercent * 180;

  const riskBadge = {
    LOW: { color: 'text-emerald-400 border-emerald-800 bg-emerald-950/60', label: 'LOW RISK' },
    MODERATE: { color: 'text-amber-400 border-amber-800 bg-amber-950/60', label: 'MODERATE RISK' },
    HIGH: { color: 'text-orange-400 border-orange-800 bg-orange-950/60', label: 'HIGH RISK' },
    SEVERE: { color: 'text-rose-400 border-rose-800 bg-rose-950/70 animate-pulse', label: 'SEVERE RISK' },
  }[prediction.riskLevel];

  return (
    <section
      id="what-to-do-section"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden"
    >
      {/* Section Header & Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Action Plan &amp; What To Do
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status diagnostics, bilingual scientific explanation, and emergency health protocols.
          </p>
        </div>

        {/* 3 Main Tabs Switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('live-status')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'live-status'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Tab 1: LIVE STATUS</span>
          </button>

          <button
            onClick={() => setActiveTab('what-is-happening')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'what-is-happening'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tab 2: WHAT IS HAPPENING</span>
          </button>

          <button
            onClick={() => setActiveTab('what-to-do')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'what-to-do'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tab 3: WHAT TO DO</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: LIVE STATUS ================= */}
      {activeTab === 'live-status' && (
        <div className="pt-6 space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Speedometer Gauge Visualizer */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800/90 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                Dynamic Heat Risk Speedometer
              </span>

              {/* Gauge Arc SVG */}
              <div className="relative w-64 h-36 flex items-center justify-center">
                <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                  {/* Arc Background Tracks */}
                  {/* Green - Low (15 - 30) */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 65 35"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                  {/* Amber - Moderate (30 - 38) */}
                  <path
                    d="M 65 35 A 80 80 0 0 1 100 20"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="14"
                    className="opacity-75"
                  />
                  {/* Orange - High (38 - 43) */}
                  <path
                    d="M 100 20 A 80 80 0 0 1 135 35"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="14"
                    className="opacity-75"
                  />
                  {/* Rose - Severe (43 - 52) */}
                  <path
                    d="M 135 35 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="14"
                    strokeLinecap="round"
                    className="opacity-75"
                  />

                  {/* Needle */}
                  <g
                    transform={`rotate(${needleRotation}, 100, 100)`}
                    className="transition-transform duration-700 ease-out"
                  >
                    <line
                      x1="100"
                      y1="100"
                      x2="100"
                      y2="28"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="100" cy="100" r="7" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
                  </g>
                </svg>

                {/* Central Readout */}
                <div className="absolute bottom-0 text-center">
                  <div className="text-3xl font-black font-mono text-white tracking-tight">
                    {displayTemp}°{unit}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Ambient Temperature
                  </div>
                </div>
              </div>

              {/* Gauge Scale Labels */}
              <div className="w-full flex justify-between px-3 text-[10px] font-mono text-slate-500 mt-2">
                <span className="text-emerald-400">Low (Safe)</span>
                <span className="text-amber-400">Moderate</span>
                <span className="text-orange-400">High</span>
                <span className="text-rose-400 font-bold">Severe (&gt;42°C)</span>
              </div>
            </div>

            {/* Live Metrics Matrix */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {/* Card 1: Risk Level */}
              <div className="col-span-2 sm:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    AI Classified Risk
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {prediction.riskLevel} HEALTH THREAT
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Confidence: <span className="text-amber-400 font-mono font-bold">{prediction.confidence}%</span> · Decision Tree Verification Passed
                  </p>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black border ${riskBadge.color}`}>
                  {prediction.riskLevel}
                </span>
              </div>

              {/* Card 2: Heat Index */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Heat Index</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-100">
                  {weather.heatIndex}°C
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Apparent human skin sensation
                </p>
              </div>

              {/* Card 3: Relative Humidity */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Humidity</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-100">
                  {weather.humidity}%
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {weather.humidity > 60 ? 'Sweat cannot evaporate' : 'Dry thermal convection'}
                </p>
              </div>

              {/* Card 4: Wet Bulb Temp */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-1">
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Wet Bulb</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-100">
                  {weather.wetBulb}°C
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Limit of human survivability: 35°C
                </p>
              </div>
            </div>
          </div>

          {/* Physiological Threat Analysis */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block mb-0.5">Clinical Heat Strain Assessment:</strong>
              {prediction.physiologicalImpact ||
                `Under current ambient conditions of ${weather.temperature}°C with ${weather.humidity}% relative humidity, heat index reaches ${weather.heatIndex}°C. Thermoregulatory peripheral vasodilation is heavily strained. Core body temperature can elevate within 30 minutes of outdoor exertion.`}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: WHAT IS HAPPENING (BILINGUAL) ================= */}
      {activeTab === 'what-is-happening' && (
        <div className="pt-6 space-y-6 animate-in fade-in duration-300">
          {/* Language Selector */}
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Languages className="w-4 h-4 text-amber-400" />
              <span>Explanation Language / भाषा चुनें:</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setLanguageMode('both')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  languageMode === 'both' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bilingual (English + हिंदी)
              </button>
              <button
                onClick={() => setLanguageMode('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  languageMode === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                English Only
              </button>
              <button
                onClick={() => setLanguageMode('hi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  languageMode === 'hi' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                केवल हिंदी
              </button>
            </div>
          </div>

          {/* 3 Core Questions Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Question 1: Why is it so hot? */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                1. Why is it so hot?
              </h3>
              <p className="text-xs font-semibold text-amber-400">
                इतनी अत्यधिक गर्मी क्यों पड़ रही है?
              </p>

              {(languageMode === 'both' || languageMode === 'en') && (
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong>Atmospheric Heat Dome:</strong> A high-pressure ridge in the upper atmosphere traps hot air over the landmass like a pressure cooker lid.
                  </p>
                  <p>
                    <strong>Dry Westerly Winds (&apos;Loo&apos;):</strong> Scorching dry continental winds blowing from the arid deserts prevent cloud formation and superheat the lower boundary layer.
                  </p>
                </div>
              )}

              {(languageMode === 'both' || languageMode === 'hi') && (
                <div className="text-xs text-amber-200/90 bg-amber-950/20 p-3 rounded-xl border border-amber-900/40 space-y-2 leading-relaxed">
                  <p>
                    <strong>हीट डोम (वायुमंडलीय दबाव):</strong> वातावरण में उच्च दबाव का घेरा गर्म हवा को जमीन के पास दबा कर रख देता है, जिससे हवा बाहर नहीं निकल पाती।
                  </p>
                  <p>
                    <strong>लू (गर्म पछुआ हवाएं):</strong> रेगिस्तानी क्षेत्रों से आने वाली शुष्क, तेज गर्म हवाएं तापमान को 42°C-45°C के खतरनाक स्तर तक पहुंचा देती हैं।
                  </p>
                </div>
              )}
            </div>

            {/* Question 2: What is Heat Index? */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                2. What is Heat Index?
              </h3>
              <p className="text-xs font-semibold text-sky-400">
                हीट इंडेक्स (आभासी तापमान) क्या है?
              </p>

              {(languageMode === 'both' || languageMode === 'en') && (
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong>Feels Like Temperature:</strong> Heat index combines ambient air temperature with relative humidity to calculate how hot the human body actually experiences it.
                  </p>
                  <p>
                    <strong>Sweat Evaporation Failure:</strong> When air is humid, sweat cannot evaporate. The body loses its natural cooling mechanism, causing rapid internal organ overheating.
                  </p>
                </div>
              )}

              {(languageMode === 'both' || languageMode === 'hi') && (
                <div className="text-xs text-sky-200/90 bg-sky-950/20 p-3 rounded-xl border border-sky-900/40 space-y-2 leading-relaxed">
                  <p>
                    <strong>शरीर को महसूस होने वाली गर्मी:</strong> जब नमी (ह्यूमिडिटी) अधिक होती है, तो पसीना नहीं सूखता। इसलिए 38°C का तापमान भी शरीर को 50°C जैसा लगता है।
                  </p>
                  <p>
                    <strong>प्राकृतिक कूलिंग बंद:</strong> पसीना न सूखने से शरीर का आंतरिक तापमान तेजी से बढ़कर 104°F से ऊपर चला जाता है, जो ब्रेन और दिल के लिए बेहद खतरनाक है।
                  </p>
                </div>
              )}
            </div>

            {/* Question 3: How long will it last? */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                3. How long will it last?
              </h3>
              <p className="text-xs font-semibold text-rose-400">
                यह भीषण लू कब तक जारी रहेगी?
              </p>

              {(languageMode === 'both' || languageMode === 'en') && (
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong>Diurnal Peak (12 PM - 4:30 PM):</strong> Solar radiation intensity peaks daily between noon and 4 PM. Evenings remain warm due to concrete heat release.
                  </p>
                  <p>
                    <strong>Synoptic Cycle (3 - 7 Days):</strong> Severe spells typically persist until a Western Disturbance, Kalbaisakhi thunderstorm, or sea breeze breaks the anticyclone.
                  </p>
                </div>
              )}

              {(languageMode === 'both' || languageMode === 'hi') && (
                <div className="text-xs text-rose-200/90 bg-rose-950/20 p-3 rounded-xl border border-rose-900/40 space-y-2 leading-relaxed">
                  <p>
                    <strong>दिन का सबसे खतरनाक समय:</strong> दोपहर 12 बजे से शाम 4:30 बजे तक धूप में सबसे ज्यादा रेडिएशन होता है। इस दौरान बाहर निकलना सख्त मना है।
                  </p>
                  <p>
                    <strong>राहत कब मिलेगी:</strong> यह हीटवेव आमतौर पर 3 से 7 दिनों तक चलती है, जब तक कि काल बैसाखी की बारिश या तेज ठंडी हवाएं सिस्टम को तोड़ नहीं देतीं।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: WHAT TO DO (HEALTH ADVISORY) ================= */}
      {activeTab === 'what-to-do' && (
        <div className="pt-6 space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Directive 1: Stay Hydrated */}
            <div className="bg-slate-950 border border-emerald-800/60 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Droplets className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                      STEP 1
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Stay Hydrated
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-emerald-400">
                    खूब पानी और ओआरएस (ORS) पिएं
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 leading-relaxed list-disc list-inside">
                    <li>Drink water every 20-30 minutes even if you don&apos;t feel thirsty.</li>
                    <li>Consume ORS, coconut water (Nariyal Pani), lemon water, and lassi to restore vital electrolytes.</li>
                    <li>Avoid alcohol, carbonated sweet sodas, and heavy caffeine which dehydrate kidneys.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-emerald-300">
                Target: {prediction.recommendedWaterIntakePerHourMl || 750} ml fluids per hour in current heat
              </div>
            </div>

            {/* Directive 2: Stay in Cool Place */}
            <div className="bg-slate-950 border border-sky-800/60 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-700">
                      STEP 2
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Stay in Cool Place
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-sky-400">
                    ठंडी व छायादार जगह में रहें
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 leading-relaxed list-disc list-inside">
                    <li>Stay on lower floors; hot air rises and tin/concrete roofs heat the top floor intensely.</li>
                    <li>Use wet cotton curtains, window shades, fans, and coolers during dry afternoons.</li>
                    <li>Take cool baths or apply wet washcloths to back of neck and wrists.</li>
                    <li><strong className="text-rose-400">NEVER</strong> leave children or pets inside closed parked cars!</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-sky-300">
                Safe indoor ambient target: &lt;28°C with air circulation
              </div>
            </div>

            {/* Directive 3: Avoid Sunlight 12-4pm */}
            <div className="bg-slate-950 border border-orange-800/60 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                  <Sun className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-300 border border-orange-700">
                      STEP 3
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Avoid Sunlight 12-4 PM
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-orange-400">
                    दोपहर 12 से 4 बजे तक धूप में बाहर न निकलें
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 leading-relaxed list-disc list-inside">
                    <li>Reschedule strenuous outdoor labor, sports, and transit to early morning or after 6 PM.</li>
                    <li>If stepping outside is unavoidable, wear light-colored, loose cotton clothing and a wide-brim hat or Gamchha.</li>
                    <li>Always carry an umbrella and full 1-liter water bottle with you.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-orange-300">
                Peak UV Radiation &amp; Thermal Risk: 12:00 PM – 4:30 PM
              </div>
            </div>

            {/* Directive 4: Call 108 if Dizzy */}
            <div className="bg-slate-950 border border-rose-800/80 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 animate-pulse">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700">
                      EMERGENCY
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Call 108 if Dizzy / Fainting
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-rose-400">
                    चक्कर, घबराहट या उल्टी आने पर तुरंत 108 डायल करें
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 leading-relaxed list-disc list-inside">
                    <li>Heat Stroke Emergency Signs: High body temp (&gt;103°F/39.5°C), rapid pulse, lack of sweating, delirium, unconsciousness.</li>
                    <li>First Aid: Move patient immediately into shade, loosen tight clothes, sponge with cold water on armpits, neck, and groin.</li>
                  </ul>
                </div>
              </div>

              {/* Direct Dial Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <a
                  href="tel:108"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 108 Ambulance Now</span>
                </a>
                <span className="text-[11px] font-mono text-slate-400">
                  Toll-Free 24x7 Casualty
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
