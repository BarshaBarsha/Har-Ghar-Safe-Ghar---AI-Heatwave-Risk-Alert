/**
 * AI-Based Heatwave Health Risk & Local Alert
 * Upgraded with:
 * - Auto-show Current Location Temp & Humidity on page load (Open-Meteo + GPS, Khorda default)
 * - Top Hero Card: "📍 Live - Khorda: 34°C | 65% RH | Risk: MODERATE"
 * - Small "Refreshing every 30 sec..." Animation
 * - Automatic Decision Tree prediction on load (no click needed)
 * - Manual Entry + 4 Benchmark Test Cases intact
 * - LocalStorage Mock Authentication (Login / Sign Up)
 * - Personal Danger Threshold Settings & Smart Alert Logic
 * - Mobile Push Alerts & Extreme Heat Modal
 * - What To Do Diagnostics (Tabs: Live Status, What Is Happening, What To Do)
 * - Pet & Stray Animal Care NGO Support Module
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { PipelineRibbon } from './components/PipelineRibbon';
import { LiveLocationHeroCard } from './components/LiveLocationHeroCard';
import { WeatherInputSection } from './components/WeatherInputSection';
import { MetricsCards } from './components/MetricsCards';
import { RiskLevelCard } from './components/RiskLevelCard';
import { RiskMatrix2D } from './components/RiskMatrix2D';
import { LocalAlertCard } from './components/LocalAlertCard';
import { HealthAdvisoryCard } from './components/HealthAdvisoryCard';
import { MLArchitectureModal } from './components/MLArchitectureModal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { VisualAtmosphere } from './components/VisualAtmosphere';
import { ThreeDGaugesPanel } from './components/ThreeDGaugesPanel';
import { FuturisticAIAnalysisFlow } from './components/FuturisticAIAnalysisFlow';
import { ExtremeHeatAlertModal } from './components/ExtremeHeatAlertModal';
import { AlertSettingsSection } from './components/AlertSettingsSection';
import { WhatToDoSection } from './components/WhatToDoSection';
import { PetAnimalSafetyModule } from './components/PetAnimalSafetyModule';
import { LoginPage } from './components/LoginPage';
import { PersonalSafetyCard } from './components/PersonalSafetyCard';
import { PersonalAlertModal } from './components/PersonalAlertModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { HeatHeroGame } from './components/HeatHeroGame';
import { WeatherData, PredictionResult, TemperatureUnit, RiskLevel } from './types';
import { UserProfile } from './types/auth';
import {
  getCurrentUser,
  logout,
  isAdminAuthenticated,
  setAdminAuthenticated,
} from './services/authService';
import {
  buildWeatherData,
  fetchAutoLiveWeather,
  fetchLiveWeatherByCoordinates,
} from './services/weatherService';
import { classifyHeatRisk } from './services/mlClassifier';
import {
  loadAlertSettings,
  sendMobileAlertNotification,
  sendPersonalAlertNotification,
} from './services/notificationService';

export default function App() {
  // Auth state: check localStorage on startup
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());

  // Navigation view: 'human-risk' | 'pet-animal-care' | 'game' | 'admin'
  const [currentView, setCurrentView] = useState<'human-risk' | 'pet-animal-care' | 'game' | 'admin'>('human-risk');

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => isAdminAuthenticated());
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Unit toggle: 'C' | 'F'
  const [unit, setUnit] = useState<TemperatureUnit>('C');

  // Execution mode: in-browser Decision Tree vs Python backend API simulation
  const [executionMode, setExecutionMode] = useState<
    'in-browser-decision-tree' | 'python-backend-api'
  >('in-browser-decision-tree');

  // Initial location (Bada Raghunathpur, Bhubaneswar by default as requested)
  const initialLocation = 'Bada Raghunathpur, Bhubaneswar';

  // Weather state (Default: 36°C, 72% RH -> Evaluates to HIGH baseline)
  const [weather, setWeather] = useState<WeatherData>(() =>
    buildWeatherData(36, 72, initialLocation, true)
  );

  // Prediction result (Default: automatically evaluated as HIGH on load)
  const [prediction, setPrediction] = useState<PredictionResult>(() =>
    classifyHeatRisk(36, 72, 'in-browser-decision-tree')
  );

  // 30-sec automatic live telemetry refresh countdown
  const [secondsUntilNextRefresh, setSecondsUntilNextRefresh] = useState<number>(30);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [deviceCoords, setDeviceCoords] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);

  // Modal alert states
  const [isSevereModalOpen, setIsSevereModalOpen] = useState<boolean>(false);
  const [isPersonalAlertOpen, setIsPersonalAlertOpen] = useState<boolean>(false);
  const [lastAutoAlertedRisk, setLastAutoAlertedRisk] = useState<RiskLevel | null>(null);

  // Loading states
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isGeoLoading, setIsGeoLoading] = useState<boolean>(false);
  const [isMLModalOpen, setIsMLModalOpen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [evaluationCounter, setEvaluationCounter] = useState<number>(1);
  const [lastEvaluatedAt, setLastEvaluatedAt] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // Function to sync live telemetry from Open-Meteo / GPS
  const syncLiveTelemetry = useCallback(
    async (overrideCoords?: { latitude: number; longitude: number }, forceResume: boolean = false) => {
      setIsRefreshing(true);
      try {
        const coords = overrideCoords || deviceCoords;
        const liveData = await fetchAutoLiveWeather(coords);
        const pred = classifyHeatRisk(liveData.temperature, liveData.humidity, executionMode);

        setWeather(liveData);
        setPrediction(pred);
        setLastEvaluatedAt(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
        setEvaluationCounter((c) => c + 1);

        if (forceResume) {
          setIsSimulationMode(false);
        }
        if (overrideCoords) {
          setIsGpsActive(true);
        }

        // Smart Alert Checks:
        if (forceResume && currentUser && liveData.temperature >= currentUser.personalThresholdTempC) {
          setIsPersonalAlertOpen(true);
          sendPersonalAlertNotification(
            currentUser.name,
            currentUser.personalThresholdTempC,
            liveData.temperature
          );
        }
        if (forceResume && (pred.riskLevel === 'HIGH' || pred.riskLevel === 'SEVERE')) {
          setIsSevereModalOpen(true);
        }
      } catch (err) {
        console.warn('Live sync fallback:', err);
      } finally {
        setIsRefreshing(false);
        setSecondsUntilNextRefresh(30);
      }
    },
    [deviceCoords, executionMode, currentUser]
  );

  // ON APP LOAD: Auto-fetch live weather & auto-request navigator.geolocation
  useEffect(() => {
    // 1. Immediate live sync on load
    syncLiveTelemetry();

    // 2. Automatically invoke navigator.geolocation to detect user's lat/long
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setDeviceCoords(coords);
          setIsGpsActive(true);
          syncLiveTelemetry(coords);
        },
        (err) => {
          console.info('Geolocation notice: Defaulting to Khorda, Odisha station.', err.message);
        },
        { timeout: 7000 }
      );
    }
  }, []);

  // AUTOMATIC 30-SECOND REFRESH INTERVAL WITH VISUAL COUNTDOWN
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilNextRefresh((prev) => {
        if (prev <= 1) {
          // Re-fetch live telemetry automatically every 30 seconds
          if (!isSimulationMode) {
            syncLiveTelemetry();
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [syncLiveTelemetry, isSimulationMode]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setIsPersonalAlertOpen(false);
    setIsSevereModalOpen(false);
  };

  // Login handler
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  // Core Risk & Personal Threshold Evaluation
  const evaluateRisk = useCallback(
    (tempC: number, rh: number, locName: string, isLive: boolean = false, mode = executionMode) => {
      const updatedWeather = buildWeatherData(tempC, rh, locName, isLive);
      const pred = classifyHeatRisk(tempC, rh, mode);

      setWeather(updatedWeather);
      setPrediction(pred);
      setLastEvaluatedAt(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setEvaluationCounter((c) => c + 1);
      setIsEvaluating(false);

      // Check Smart Alert Logic:
      // a) User's Personal Threshold
      if (currentUser && tempC >= currentUser.personalThresholdTempC) {
        setIsPersonalAlertOpen(true);
        sendPersonalAlertNotification(currentUser.name, currentUser.personalThresholdTempC, tempC);
      } else {
        setIsPersonalAlertOpen(false);
      }

      // b) AI Model Severe / High Alert
      if (pred.riskLevel === 'HIGH' || pred.riskLevel === 'SEVERE') {
        setIsSevereModalOpen(true);
        const settings = loadAlertSettings();
        if (settings.pushEnabled && tempC >= settings.thresholdTempC) {
          sendMobileAlertNotification({
            title: `🚨 ${pred.riskLevel} Heatwave Alert in ${locName}!`,
            body: `${pred.riskLevel} Heatwave Alert! ${tempC}°C detected in ${locName}. Stay indoors and hydrate!`,
            temperatureC: tempC,
            riskLevel: pred.riskLevel,
            locationName: locName,
          });
        }
      } else {
        setIsSevereModalOpen(false);
      }
    },
    [executionMode, currentUser]
  );

  // Request browser geolocation on button click
  const handleRequestGeolocation = async () => {
    if (!navigator.geolocation) {
      setStatusMessage('Geolocation is not supported by your browser.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    setIsGeoLoading(true);
    setStatusMessage('Acquiring device GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setDeviceCoords({ latitude, longitude });
          setIsGpsActive(true);
          await syncLiveTelemetry({ latitude, longitude }, true);
          setStatusMessage('Live weather telemetry synced from device GPS.');
        } catch (err: any) {
          console.error(err);
          setStatusMessage('Failed to fetch live weather. Reverting to preset values.');
        } finally {
          setIsGeoLoading(false);
          setTimeout(() => setStatusMessage(null), 3000);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setIsGeoLoading(false);
        setStatusMessage('Location permission declined or unavailable.');
        setTimeout(() => setStatusMessage(null), 3000);
      },
      { timeout: 8000 }
    );
  };

  // Weather update handler for manual sliders and presets
  const handleUpdateWeather = (tempC: number, rh: number, location: string, isLive: boolean = false) => {
    setIsSimulationMode(true);
    evaluateRisk(tempC, rh, location, isLive);
  };

  const handleToggleExecutionMode = (newMode?: 'in-browser-decision-tree' | 'python-backend-api') => {
    const nextMode =
      newMode || (executionMode === 'in-browser-decision-tree' ? 'python-backend-api' : 'in-browser-decision-tree');
    setExecutionMode(nextMode);
    evaluateRisk(weather.temperature, weather.humidity, weather.locationName, weather.isLive, nextMode);
  };

  const handleScrollToWhatToDo = () => {
    setCurrentView('human-risk');
    setTimeout(() => {
      const el = document.getElementById('what-to-do-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleScrollToAlertSettings = () => {
    setCurrentView('human-risk');
    setTimeout(() => {
      const el = document.getElementById('alert-settings');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Mobile Bottom Navigation Tab state & handler
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'live-map' | 'pets' | 'game'>('home');

  const handleSelectBottomTab = (tab: 'home' | 'live-map' | 'pets' | 'game') => {
    setActiveBottomTab(tab);
    if (tab === 'home') {
      setCurrentView('human-risk');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'live-map') {
      setCurrentView('human-risk');
      setTimeout(() => {
        const el = document.getElementById('risk-matrix-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (tab === 'pets') {
      setCurrentView('pet-animal-care');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'game') {
      setCurrentView('game');
    }
  };

  // Route listener for hidden route /admin or #/admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const isPathAdmin =
        window.location.pathname === '/admin' ||
        window.location.hash === '#/admin' ||
        window.location.hash === '#admin';
      if (isPathAdmin) {
        if (isAdminAuthenticated()) {
          setCurrentView('admin');
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };
    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);
    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  const handleAdminLoginSuccess = () => {
    setAdminAuthenticated(true);
    setIsAdminLoggedIn(true);
    setIsAdminLoginModalOpen(false);
    setCurrentView('admin');
    window.location.hash = '/admin';
    setStatusMessage('Authenticated as Admin successfully.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setIsAdminLoggedIn(false);
    setCurrentView('human-risk');
    window.location.hash = '';
    setStatusMessage('Admin session terminated.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCloseAdminModal = () => {
    setIsAdminLoginModalOpen(false);
    if (currentView === 'admin' && !isAdminLoggedIn) {
      setCurrentView('human-risk');
      window.location.hash = '';
      setStatusMessage('Admin Access Only - Redirected to Home');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // If not logged in, show the Login / Signup Page as First Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-amber-500/30 selection:text-amber-200">
        <VisualAtmosphere riskLevel={prediction.riskLevel} temperature={weather.temperature} />
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        />
        <AdminLoginModal
          isOpen={isAdminLoginModalOpen}
          onClose={handleCloseAdminModal}
          onLoginSuccess={handleAdminLoginSuccess}
        />
      </div>
    );
  }

  const isAiRiskSevere = prediction.riskLevel === 'HIGH' || prediction.riskLevel === 'SEVERE';

  // Dedicated Full-Page View for Heat Hero Educational Game
  if (currentView === 'game') {
    return (
      <HeatHeroGame
        onBackToApp={() => {
          setCurrentView('human-risk');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // Dedicated Full-Page View for Admin Dashboard
  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-amber-500/30 selection:text-amber-200">
        <VisualAtmosphere riskLevel="MODERATE" temperature={32} />
        <div className="relative z-10">
          <AdminDashboard
            onBackToApp={() => {
              setCurrentView('human-risk');
              window.location.hash = '';
            }}
            onAdminLogout={handleAdminLogout}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3D Visual Atmosphere: Background Animated Sun & Convection Waves */}
      <VisualAtmosphere riskLevel={prediction.riskLevel} temperature={weather.temperature} />

      {/* 1. Header with Module Switcher, User Profile Avatar, & Logout */}
      <Header
        unit={unit}
        onToggleUnit={setUnit}
        onOpenMLModal={() => setIsMLModalOpen(true)}
        executionMode={executionMode}
        onToggleExecutionMode={handleToggleExecutionMode}
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenAlertSettings={handleScrollToAlertSettings}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. End-to-End Pipeline Ribbon (Active on Human Risk view) */}
      {currentView === 'human-risk' && (
        <PipelineRibbon currentRisk={prediction.riskLevel} />
      )}

      {/* Ephemeral status toast */}
      {statusMessage && (
        <div className="bg-amber-500 text-slate-950 font-semibold text-xs py-2 px-4 text-center transition-all z-20">
          {statusMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7 relative z-10 pb-28 md:pb-8">
        <div id="home-top" />

        {/* VIEW 1: HUMAN HEAT RISK & LOCAL ALERT DASHBOARD */}
        {currentView === 'human-risk' && (
          <>
            {/* MANDATED FEATURE: Top Live Location Hero Card with 30-sec Refresh Animation */}
            <LiveLocationHeroCard
              weather={weather}
              prediction={prediction}
              unit={unit}
              secondsUntilNextRefresh={secondsUntilNextRefresh}
              isRefreshing={isRefreshing}
              onRefreshNow={() => syncLiveTelemetry(deviceCoords, true)}
              isGpsActive={isGpsActive}
              onSelectLocation={(tempC, rh, locName) => handleUpdateWeather(tempC, rh, locName, true)}
            />

            {/* Simulation mode notice banner (if manual sliders or test cases active) */}
            {isSimulationMode && (
              <div className="p-3 bg-slate-900/90 border border-amber-500/40 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <span className="text-amber-300">
                  ⚙️ <strong>Manual Simulation Active</strong> — Viewing custom test inputs. Auto-refresh is paused.
                </span>
                <button
                  type="button"
                  onClick={() => syncLiveTelemetry(deviceCoords, true)}
                  className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shrink-0 text-xs"
                >
                  Resume Live Telemetry
                </button>
              </div>
            )}

            {/* Hero Kicker & Editorial Title with Personalized Greeting */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono flex-wrap">
                <span className="text-amber-400 font-bold">Welcome, {currentUser.name}!</span>
                <span aria-hidden="true">·</span>
                <span>User Zone: {currentUser.location}</span>
                <span aria-hidden="true">·</span>
                <span className="text-purple-300 font-bold">
                  Personal Limit: &gt;{currentUser.personalThresholdTempC}°C
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">Pet &amp; Stray Care Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                AI-Based Heatwave Health Risk &amp; Local Alert
              </h1>
              <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                Autonomous heatwave health estimation for students, outdoor workers, community residents, and domestic pets. Calibrated machine learning decision tree with dual-tier AI risk and personalized danger threshold alerts.
              </p>
            </div>

            {/* Core Feature: Personal Danger Threshold Settings Card */}
            <div id="personal-safety-section">
              <PersonalSafetyCard
                currentUser={currentUser}
                currentTempC={weather.temperature}
                humidity={weather.humidity}
                locationName={weather.locationName}
                onUpdateUser={setCurrentUser}
              />
            </div>

            {/* Har Ghar Safe - Heat Hero Game Invitation Banner */}
            <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border-2 border-amber-500/50 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden group">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-2xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                  🎮
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">
                      Har Ghar Safe — Heat Hero Game
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-mono font-black uppercase">
                      Educational Game
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Save Jatani village from the 42.5°C angry sun! Drag water bowls to dogs 🐕 and hats to farmers 👨‍🌾 before timer expires.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('game')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0 active:scale-95"
              >
                <span>Play Game Now</span>
                <span className="text-sm font-bold">→</span>
              </button>
            </div>

            {/* Input & Simulation Section (Includes Check Heat Risk button & 4 Mandated Benchmark Test Cases) */}
            <WeatherInputSection
              temperatureC={weather.temperature}
              humidity={weather.humidity}
              unit={unit}
              locationName={weather.locationName}
              isEvaluating={isEvaluating}
              onUpdateWeather={handleUpdateWeather}
              onRequestGeolocation={handleRequestGeolocation}
              isGeoLoading={isGeoLoading}
            />

            {/* 3D Visual Gauges Console: Temperature & Humidity Meters */}
            <ThreeDGaugesPanel
              temperatureC={weather.temperature}
              humidity={weather.humidity}
              unit={unit}
              riskLevel={prediction.riskLevel}
              heatIndex={weather.heatIndex}
              wetBulb={weather.wetBulb}
            />

            {/* Central Futuristic AI/ML Analysis Visualization Flow */}
            <FuturisticAIAnalysisFlow
              temperatureC={weather.temperature}
              humidity={weather.humidity}
              unit={unit}
              riskLevel={prediction.riskLevel}
              confidence={prediction.confidence}
              latencyMs={prediction.latencyMs}
            />

            {/* Real-time Weather & Thermal Metrics Cards */}
            <MetricsCards weather={weather} unit={unit} />

            {/* Two-column Core Analysis Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Large Risk Level Card */}
              <RiskLevelCard
                prediction={prediction}
                onOpenModelModal={() => setIsMLModalOpen(true)}
                lastEvaluatedAt={lastEvaluatedAt}
                evaluationCounter={evaluationCounter}
              />

              {/* Right Column: Local Heat Alert Broadcast with Mobile Alert Push Trigger */}
              <LocalAlertCard
                prediction={prediction}
                weather={weather}
                unit={unit}
                onOpenWhatToDo={handleScrollToWhatToDo}
                onOpenPetCare={() => setCurrentView('pet-animal-care')}
                onOpenAlertModal={() => setIsSevereModalOpen(true)}
              />
            </div>

            {/* 2D Heat Risk Matrix Visualizer */}
            <div id="risk-matrix-section">
              <RiskMatrix2D
                currentTempC={weather.temperature}
                currentHumidity={weather.humidity}
                currentRisk={prediction.riskLevel}
              />
            </div>

            {/* Automated Alert Settings Section */}
            <AlertSettingsSection
              currentTempC={weather.temperature}
              currentHumidity={weather.humidity}
              currentCityName={weather.locationName}
              unit={unit}
            />

            {/* What To Do Section (Tab 1: Live Status, Tab 2: What Is Happening, Tab 3: What To Do) */}
            <WhatToDoSection
              prediction={prediction}
              weather={weather}
              unit={unit}
            />

            {/* Health Advisory & Hydration Calculator (Detailed Breakdown) */}
            <HealthAdvisoryCard prediction={prediction} />

            {/* Pet Care Quick-Access Teaser Banner */}
            <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                  Animal Welfare Mission
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Pets &amp; Stray Animals cannot sweat in heatwaves
                </h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Asphalt exceeds 60°C in high heat, burning paws in 60s. Access our dedicated Animal Heat Risk Meter, Odisha NGO contacts, and report strays in distress.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('pet-animal-care')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold transition-all shadow-md shrink-0 active:scale-95"
              >
                Open Pet &amp; Stray Animal Hub →
              </button>
            </div>

            {/* Disclaimer Banner */}
            <DisclaimerBanner />
          </>
        )}

        {/* VIEW 2: NGO & PET ANIMAL SAFETY MODULE */}
        {currentView === 'pet-animal-care' && (
          <PetAnimalSafetyModule
            currentTempC={weather.temperature}
            currentHumidity={weather.humidity}
            currentLocationName={weather.locationName}
            unit={unit}
            onBackToHumanRisk={() => setCurrentView('human-risk')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            AI-Based Heatwave Health Risk &amp; Local Alert · Logged in as{' '}
            <strong className="text-slate-300">{currentUser.name}</strong> ({currentUser.location})
          </p>
          <div className="flex items-center gap-4 text-slate-400 flex-wrap">
            <button
              onClick={() => setIsMLModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              ML Model Code (Python)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentView('game')}
              className="hover:text-amber-300 text-amber-400 font-bold transition-colors flex items-center gap-1"
            >
              <span>🎮</span>
              <span>Heat Hero Game</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentView(currentView === 'human-risk' ? 'pet-animal-care' : 'human-risk')}
              className="hover:text-amber-400 transition-colors"
            >
              {currentView === 'human-risk' ? 'Switch to Pet & NGO Care' : 'Switch to Human Risk'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setCurrentView('admin');
                  window.location.hash = '/admin';
                } else {
                  setIsAdminLoginModalOpen(true);
                }
              }}
              className="hover:text-amber-400 text-slate-400 hover:underline transition-colors flex items-center gap-1 font-mono text-[11px]"
              title="Admin User Data Storage Monitor (For Judges)"
            >
              <span>🔐</span>
              <span>Admin Login</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleLogout}
              className="hover:text-rose-400 text-rose-500/80 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar: Home | Live Map | Pets | Profile */}
      <MobileBottomNav
        currentView={currentView}
        activeTab={activeBottomTab}
        onSelectTab={handleSelectBottomTab}
      />

      {/* Admin Login Modal (Demo credentials: admin / admin123) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={handleCloseAdminModal}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Core Feature: Personal Danger Alert Modal (Purple Glowing) */}
      <PersonalAlertModal
        isOpen={isPersonalAlertOpen}
        onClose={() => setIsPersonalAlertOpen(false)}
        currentUser={currentUser}
        currentTempC={weather.temperature}
        locationName={weather.locationName}
        onOpenWhatToDo={handleScrollToWhatToDo}
        onOpenSevereModal={() => {
          setIsPersonalAlertOpen(false);
          setIsSevereModalOpen(true);
        }}
        isAiRiskSevere={isAiRiskSevere}
      />

      {/* Big Animated Extreme Heat Alert Popup (When AI Risk is HIGH or SEVERE - Red/Orange) */}
      <ExtremeHeatAlertModal
        isOpen={isSevereModalOpen && !isPersonalAlertOpen}
        onClose={() => setIsSevereModalOpen(false)}
        prediction={prediction}
        weather={weather}
        unit={unit}
        onOpenWhatToDo={handleScrollToWhatToDo}
        onOpenPetCare={() => setCurrentView('pet-animal-care')}
      />

      {/* ML Architecture & Python Backend Modal */}
      <MLArchitectureModal
        isOpen={isMLModalOpen}
        onClose={() => setIsMLModalOpen(false)}
        prediction={prediction}
        weather={weather}
        executionMode={executionMode}
        onToggleExecutionMode={handleToggleExecutionMode}
      />
    </div>
  );
}
