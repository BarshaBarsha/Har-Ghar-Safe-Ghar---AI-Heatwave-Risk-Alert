import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  Droplets,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { TemperatureUnit, TestCasePreset } from '../types';
import { BENCHMARK_TEST_CASES } from '../services/mlClassifier';
import { PRESET_LOCATIONS } from '../services/weatherService';
import { celsiusToFahrenheit, fahrenheitToCelsius, validateWeatherInputs } from '../services/heatIndexCalculator';

interface WeatherInputSectionProps {
  temperatureC: number;
  humidity: number;
  unit: TemperatureUnit;
  locationName: string;
  isEvaluating: boolean;
  onUpdateWeather: (tempC: number, rh: number, location: string, isLive?: boolean) => void;
  onRequestGeolocation: () => void;
  isGeoLoading: boolean;
}

export const WeatherInputSection: React.FC<WeatherInputSectionProps> = ({
  temperatureC,
  humidity,
  unit,
  locationName,
  isEvaluating,
  onUpdateWeather,
  onRequestGeolocation,
  isGeoLoading,
}) => {
  // Local input states for fine-grained editing
  const displayTemp = unit === 'C' ? temperatureC : Math.round(celsiusToFahrenheit(temperatureC) * 10) / 10;
  const [tempInput, setTempInput] = useState<string>(displayTemp.toString());
  const [humidityInput, setHumidityInput] = useState<string>(humidity.toString());
  const [activeTestCaseId, setActiveTestCaseId] = useState<string | null>(null);
  const [justCalculated, setJustCalculated] = useState<boolean>(false);

  // Sync state when props change externally (e.g. from preset or live GPS)
  React.useEffect(() => {
    const val = unit === 'C' ? temperatureC : Math.round(celsiusToFahrenheit(temperatureC) * 10) / 10;
    setTempInput(val.toString());
    setHumidityInput(humidity.toString());
  }, [temperatureC, humidity, unit]);

  // Validation
  const validation = validateWeatherInputs(tempInput, humidityInput, unit);

  const handleApply = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const currentValidation = validateWeatherInputs(tempInput, humidityInput, unit);
    if (!currentValidation.isValid) return;

    onUpdateWeather(
      currentValidation.sanitizedTempC,
      currentValidation.sanitizedHumidity,
      locationName || 'Manual Observation Area',
      false
    );

    setJustCalculated(true);
    setTimeout(() => setJustCalculated(false), 1200);

    // Smooth scroll down to assessment if on smaller screen
    const riskEl = document.getElementById('risk-assessment');
    if (riskEl && window.innerWidth < 1024) {
      riskEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleSliderTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    setTempInput(num.toString());
    setActiveTestCaseId(null);
  };

  const handleSliderHumidityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    setHumidityInput(num.toString());
    setActiveTestCaseId(null);
  };

  const handleSelectTestCase = (preset: TestCasePreset) => {
    setActiveTestCaseId(preset.id);
    const dispT = unit === 'C' ? preset.tempC : Math.round(celsiusToFahrenheit(preset.tempC) * 10) / 10;
    setTempInput(dispT.toString());
    setHumidityInput(preset.humidity.toString());
    onUpdateWeather(
      preset.tempC,
      preset.humidity,
      `Benchmark: ${preset.label}`,
      false
    );
    setJustCalculated(true);
    setTimeout(() => setJustCalculated(false), 1200);
  };

  const handleSelectLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = PRESET_LOCATIONS.find((l) => l.name === e.target.value);
    if (loc) {
      setActiveTestCaseId(null);
      const dispT = unit === 'C' ? loc.defaultTempC : Math.round(celsiusToFahrenheit(loc.defaultTempC) * 10) / 10;
      setTempInput(dispT.toString());
      setHumidityInput(loc.defaultHumidity.toString());
      onUpdateWeather(loc.defaultTempC, loc.defaultHumidity, `${loc.name}, ${loc.region}`, false);
      setJustCalculated(true);
      setTimeout(() => setJustCalculated(false), 1200);
    }
  };

  const handleReset = () => {
    setActiveTestCaseId(null);
    const defaultC = 35;
    const defaultRh = 60;
    const dispT = unit === 'C' ? defaultC : Math.round(celsiusToFahrenheit(defaultC) * 10) / 10;
    setTempInput(dispT.toString());
    setHumidityInput(defaultRh.toString());
    onUpdateWeather(defaultC, defaultRh, 'Local Observation Quad', false);
    setJustCalculated(true);
    setTimeout(() => setJustCalculated(false), 1200);
  };

  const currentSliderTemp = !isNaN(parseFloat(tempInput))
    ? parseFloat(tempInput)
    : unit === 'C'
    ? 30
    : 86;

  const currentSliderRh = !isNaN(parseFloat(humidityInput))
    ? parseFloat(humidityInput)
    : 50;

  return (
    <section id="input-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Weather Data &amp; Simulation Controls
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enter ambient conditions or pick a preset, then click <strong className="text-amber-400">Check Heat Risk</strong> to immediately run AI prediction
          </p>
        </div>

        {/* Global Presets / Geolocation selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            onChange={handleSelectLocation}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            defaultValue=""
          >
            <option value="" disabled>Select Predefined City...</option>
            {PRESET_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name} ({loc.defaultTempC}°C, {loc.defaultHumidity}%)
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onRequestGeolocation}
            disabled={isGeoLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
            title="Fetch real-time weather from your current coordinates"
          >
            {isGeoLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Compass className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span>Live Location</span>
          </button>
        </div>
      </div>

      {/* Benchmark Test Cases - Prominently Displayed */}
      <div className="py-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Mandated Benchmark Test Cases
          </span>
          <span className="text-[11px] text-slate-500">1-Click Run &amp; Verify</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {BENCHMARK_TEST_CASES.map((tc) => {
            const isSelected = activeTestCaseId === tc.id;
            const badgeColor =
              tc.expectedRisk === 'LOW'
                ? 'text-emerald-400 border-emerald-800/50 bg-emerald-950/30'
                : tc.expectedRisk === 'MODERATE'
                ? 'text-amber-400 border-amber-800/50 bg-amber-950/30'
                : tc.expectedRisk === 'HIGH'
                ? 'text-orange-400 border-orange-800/50 bg-orange-950/30'
                : 'text-rose-400 border-rose-800/50 bg-rose-950/30';

            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => handleSelectTestCase(tc)}
                className={`text-left p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-slate-800/90 shadow-sm ring-1 ring-amber-400/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">{tc.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeColor}`}>
                    {tc.expectedRisk}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 tabular-nums">
                  {tc.tempC}°C · {tc.humidity}% RH
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {tc.scenario}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Input Form */}
      <form onSubmit={handleApply} className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Temperature Slider & Input */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="temp-input" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>Ambient Temperature</span>
              </label>
              <div className="flex items-center gap-1 font-mono text-xs">
                <input
                  id="temp-input"
                  type="number"
                  step="0.1"
                  value={tempInput}
                  onChange={(e) => {
                    setTempInput(e.target.value);
                    setActiveTestCaseId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApply(e);
                  }}
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-right font-bold text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <span className="text-slate-400">°{unit}</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={unit === 'C' ? -10 : 14}
              max={unit === 'C' ? 55 : 131}
              step="0.5"
              value={currentSliderTemp}
              onChange={handleSliderTempChange}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1.5">
              <span>{unit === 'C' ? '-10°C' : '14°F'}</span>
              <span className="text-amber-400/80">Active: {currentSliderTemp}°{unit}</span>
              <span>{unit === 'C' ? '55°C' : '131°F'}</span>
            </div>
          </div>

          {/* Humidity Slider & Input */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="rh-input" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Relative Humidity</span>
              </label>
              <div className="flex items-center gap-1 font-mono text-xs">
                <input
                  id="rh-input"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={humidityInput}
                  onChange={(e) => {
                    setHumidityInput(e.target.value);
                    setActiveTestCaseId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApply(e);
                  }}
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-right font-bold text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={currentSliderRh}
              onChange={handleSliderHumidityChange}
              className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1.5">
              <span>0% (Arid)</span>
              <span className="text-sky-400/80">Active: {currentSliderRh}%</span>
              <span>100% (Saturated)</span>
            </div>
          </div>
        </div>

        {/* Validation Errors & Warnings */}
        {(!validation.isValid || validation.warnings.length > 0) && (
          <div className="space-y-1.5 text-xs">
            {validation.issues.map((err, i) => (
              <div key={i} className="flex items-center gap-2 text-rose-400 bg-rose-950/40 border border-rose-800/60 rounded-lg px-3 py-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{err}</span>
              </div>
            ))}
            {validation.warnings.map((warn, i) => (
              <div key={i} className="flex items-center gap-2 text-amber-400 bg-amber-950/40 border border-amber-800/60 rounded-lg px-3 py-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button Bar */}
        <div className="flex items-center justify-between pt-1 gap-3 flex-wrap">
          <div className="text-xs text-slate-400">
            Observation Area:{' '}
            <span className="text-slate-200 font-medium">{locationName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              id="check-risk-btn"
              onClick={handleApply}
              disabled={!validation.isValid}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                justCalculated
                  ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300 shadow-emerald-500/20'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:shadow-amber-500/20'
              }`}
              title="Click to calculate heat risk and update risk assessment, alerts, and health advisory"
            >
              {justCalculated ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                  <span>Risk Evaluated!</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Check Heat Risk</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
