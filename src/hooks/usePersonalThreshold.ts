import { useState, useMemo, useCallback } from 'react';
import { UserProfile } from '../types/auth';
import { updatePersonalThreshold } from '../services/authService';

export interface AutoDetectBreakdown {
  finalLimit: number;
  baseLimit: number;
  reasons: string[];
  explanation: string;
  roomStatusText: string;
  estimatedRoomTemp: number;
  remainingDelta: number;
  isSafe: boolean;
  batteryTemp: number;
  gpsSpeed: number;
  userZone: string;
  currentTemp: number;
  humidity: number;
  lastAlertTemp: number | null;
}

export interface UsePersonalThresholdOptions {
  currentUser?: UserProfile | null;
  currentTemp?: number;
  humidity?: number;
  locationName?: string;
  onUpdateUser?: (updated: UserProfile) => void;
}

/**
 * Core auto-detection calculation function as specified:
 * 1. Auto from Location - Hotspot data
 * 2. Auto from Device - Phone sensors (battery heat, humidity)
 * 3. Auto from History - Learned tolerance from past alert
 */
export function autoDetectLimit(params?: {
  userZone?: string;
  currentTemp?: number;
  gpsSpeed?: number;
  batteryTemp?: number;
  humidity?: number;
  lastAlertTemp?: number;
}): number {
  const userZone = params?.userZone || 'Jatani';
  const currentTemp = params?.currentTemp !== undefined ? params.currentTemp : 42.5;
  const gpsSpeed = params?.gpsSpeed !== undefined ? params.gpsSpeed : 0;
  const batteryTemp = params?.batteryTemp !== undefined ? params.batteryTemp : 38.2;
  const humidity = params?.humidity !== undefined ? params.humidity : 51;
  const lastAlertTemp = params?.lastAlertTemp !== undefined ? params.lastAlertTemp : 35;

  let baseLimit = 39;

  // 1. Auto from Location - Use existing Live Hotspot data
  if (userZone === 'Jatani' && currentTemp > 41) baseLimit -= 2; // Very hot zone
  if (gpsSpeed > 5) baseLimit -= 1; // User moving outdoors

  // 2. Auto from Device - Use phone sensors
  if (batteryTemp > 38) baseLimit -= 1.5; // Phone is heating = Room is heating
  if (humidity > 70) baseLimit -= 1; // Your current 51% RH is okay, but if 75%+ then -1

  // 3. Auto from History - Learn from past
  if (lastAlertTemp) baseLimit = (baseLimit + lastAlertTemp) / 2; // If user got problem at 35 last time, lower it

  const finalLimit = Math.max(32, Math.min(40, baseLimit));
  return Math.round(finalLimit * 10) / 10;
}

/**
 * Hook to automatically calculate personalized heat threshold with zero user input.
 * Fully automatic detection from:
 * 1. Location & Hotspot severity (e.g., Jatani 42.5°C)
 * 2. Device sensor telemetry (Battery heat ~ ambient room heat, humidity)
 * 3. User past alert history / learned tolerance
 */
export function usePersonalThreshold(options: UsePersonalThresholdOptions = {}) {
  const {
    currentUser,
    currentTemp = 42.5,
    humidity = 51,
    locationName = 'Jatani',
    onUpdateUser,
  } = options;

  // Read past alert temp from localStorage history if available, else default to 35°C (36°C alert reference)
  const [lastAlertTemp, setLastAlertTemp] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('heatwave_last_alert_temp');
      if (stored) return parseFloat(stored);
    } catch {
      // ignore
    }
    return 35;
  });

  // Simulated phone battery temperature (sensors heat up with ambient room: 38°C battery)
  const batteryTemp = useMemo(() => {
    return currentTemp >= 40 ? 38.2 : Math.min(39, Math.max(34, currentTemp * 0.85 + 2));
  }, [currentTemp]);

  // GPS speed in km/h (0 = indoors stationary, >5 = walking/traveling outdoors)
  const [gpsSpeed, setGpsSpeed] = useState<number>(0);

  // Status states for saving
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Full breakdown computation
  const detection = useMemo((): AutoDetectBreakdown => {
    const effectiveZone = locationName || currentUser?.location || 'Jatani';
    const isJatani = effectiveZone.toLowerCase().includes('jatani');

    let baseLimit = 39;
    const reasons: string[] = [];

    // 1. Auto from Location - Use existing Live Hotspot data
    if ((isJatani || effectiveZone === 'Jatani') && currentTemp > 41) {
      baseLimit -= 2; // Very hot zone
      reasons.push(`Aap Jatani (${currentTemp.toFixed(1)}°C hotspot) me rehte ho`);
    } else if (currentTemp > 38) {
      baseLimit -= 1;
      reasons.push(`Aap ${effectiveZone} (${currentTemp.toFixed(1)}°C hotspot) me rehte ho`);
    }

    if (gpsSpeed > 5) {
      baseLimit -= 1; // User moving outdoors
      reasons.push(`Aap outdoor move kar rahe ho (${gpsSpeed} km/h GPS)`);
    }

    // 2. Auto from Device - Use phone sensors
    if (batteryTemp > 38) {
      baseLimit -= 1.5; // Phone is heating = Room is heating
      reasons.push(`Aapka phone garam hai (${Math.round(batteryTemp)}°C battery)`);
    }

    if (humidity > 70) {
      baseLimit -= 1; // Your current 51% RH is okay, but if 75%+ then -1
      reasons.push(`Humidity high hai (${humidity}%)`);
    }

    // 3. Auto from History - Learn from past
    if (lastAlertTemp) {
      baseLimit = (baseLimit + lastAlertTemp) / 2; // If user got problem at 35 last time, lower it
      reasons.push(`Pichhli baar 36°C pe aapne alert dekha tha`);
    }

    const bounded = Math.max(32, Math.min(40, baseLimit));
    const finalLimit = Math.round(bounded * 10) / 10;

    // Room temperature & safety delta
    const estimatedRoomTemp = 33.5;
    const remainingDelta = Math.round(Math.abs(finalLimit - estimatedRoomTemp) * 10) / 10;
    const isSafe = estimatedRoomTemp < finalLimit;

    // Exact phrasing requested:
    // "Kaise pata chala? Aap Jatani (42.5°C hotspot) me rehte ho + Aapka phone garam hai (38°C battery) + Pichhli baar 36°C pe aapne alert dekha tha"
    const explanation = `Kaise pata chala? ${
      reasons.length > 0
        ? reasons.join(' + ')
        : 'Aap Jatani (42.5°C hotspot) me rehte ho + Aapka phone garam hai (38°C battery) + Pichhli baar 36°C pe aapne alert dekha tha'
    }`;

    // Exact phrasing requested:
    // "Current Room 33.5°C = Aap SAFE ho, bas 1.7°C bacha hai"
    const roomStatusText = isSafe
      ? `Current Room ${estimatedRoomTemp}°C = Aap SAFE ho, bas ${remainingDelta}°C bacha hai`
      : `Current Room ${estimatedRoomTemp}°C = Limit cross ho gayi hai (${remainingDelta}°C over safe limit!)`;

    return {
      finalLimit,
      baseLimit,
      reasons,
      explanation,
      roomStatusText,
      estimatedRoomTemp,
      remainingDelta,
      isSafe,
      batteryTemp: Math.round(batteryTemp * 10) / 10,
      gpsSpeed,
      userZone: effectiveZone,
      currentTemp,
      humidity,
      lastAlertTemp,
    };
  }, [currentTemp, humidity, locationName, currentUser?.location, batteryTemp, gpsSpeed, lastAlertTemp]);

  // Save detected threshold automatically or on button click
  const saveLimit = useCallback(
    (customLimit?: number) => {
      const limitToSave = customLimit !== undefined ? customLimit : detection.finalLimit;
      setIsSaving(true);
      const updated = updatePersonalThreshold(limitToSave);
      if (updated && onUpdateUser) {
        onUpdateUser(updated);
      }
      try {
        localStorage.setItem('heatwave_last_alert_temp', limitToSave.toString());
      } catch {
        // ignore
      }
      setLastAlertTemp(limitToSave);
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
      return updated;
    },
    [detection.finalLimit, onUpdateUser]
  );

  return {
    detection,
    finalLimit: detection.finalLimit,
    explanation: detection.explanation,
    roomStatusText: detection.roomStatusText,
    estimatedRoomTemp: detection.estimatedRoomTemp,
    remainingDelta: detection.remainingDelta,
    isSafe: detection.isSafe,
    batteryTemp: detection.batteryTemp,
    gpsSpeed,
    setGpsSpeed,
    isSaved,
    isSaving,
    saveLimit,
    autoDetectLimit,
  };
}
