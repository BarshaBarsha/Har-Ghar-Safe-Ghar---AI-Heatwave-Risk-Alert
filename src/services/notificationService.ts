/**
 * Browser Notification Service for Heatwave Alerts
 * Handles Notification API permissions, system push notifications,
 * vibration haptic patterns, and fallback in-app alert banners.
 */

export interface AlertNotificationPayload {
  title: string;
  body: string;
  temperatureC: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  locationName: string;
}

export interface UserAlertSettings {
  cityName: string;
  phoneNumber: string;
  thresholdTempC: number;
  pushEnabled: boolean;
  soundEnabled: boolean;
}

const STORAGE_KEY = 'heatwave_alert_settings_v1';
const LAST_ALERT_KEY = 'heatwave_last_notified_timestamp';

export const DEFAULT_ALERT_SETTINGS: UserAlertSettings = {
  cityName: 'Bhubaneswar, Odisha',
  phoneNumber: '',
  thresholdTempC: 40,
  pushEnabled: true,
  soundEnabled: true,
};

export function loadAlertSettings(): UserAlertSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_ALERT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Failed to load alert settings from localStorage:', err);
  }
  return DEFAULT_ALERT_SETTINGS;
}

export function saveAlertSettings(settings: UserAlertSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save alert settings to localStorage:', err);
  }
}

export async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return 'denied';
  }
}

export function getNotificationPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function triggerHapticFeedback(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      // SOS / urgent alert buzz pattern
      navigator.vibrate([250, 100, 250, 100, 400]);
    } catch {
      // Ignore haptic errors on desktop
    }
  }
}

export function playEmergencyAlertSound(): void {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    // Two-tone warning siren frequency
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(587, audioCtx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch {
    // Audio context may be restricted until user interaction
  }
}

export async function sendMobileAlertNotification(
  payload: AlertNotificationPayload,
  force: boolean = false
): Promise<{ success: boolean; message: string }> {
  // Cooldown check: don't spam if notified within last 3 minutes unless forced
  const now = Date.now();
  const lastNotified = parseInt(localStorage.getItem(LAST_ALERT_KEY) || '0', 10);
  if (!force && now - lastNotified < 180000) {
    return { success: false, message: 'Notification rate-limited (cooldown active)' };
  }

  // Trigger vibration & audio
  triggerHapticFeedback();
  playEmergencyAlertSound();

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      success: false,
      message: 'Browser Notifications not supported on this device. In-app alerts are active.',
    };
  }

  let permission: string = Notification.permission;
  if (permission === 'default') {
    permission = await requestNotificationPermission();
  }

  if (permission !== 'granted') {
    return {
      success: false,
      message: 'Notification permission not granted. Please allow notifications in browser settings.',
    };
  }

  try {
    const title = payload.title || `🚨 ${payload.riskLevel} Heatwave Alert!`;
    const body =
      payload.body ||
      `${payload.riskLevel} Heatwave Alert in your area! ${payload.temperatureC}°C detected in ${payload.locationName}. Stay indoors and stay hydrated!`;

    // Try service worker registration first if available (required for some mobile PWAs)
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            body,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: 'heatwave-alert',
            renotify: true,
            vibrate: [250, 100, 250, 100, 400],
            data: { url: window.location.href },
          } as any);
          localStorage.setItem(LAST_ALERT_KEY, now.toString());
          return { success: true, message: 'Push notification dispatched via Service Worker!' };
        }
      } catch (swErr) {
        console.warn('Service worker notification failed, falling back to Notification constructor', swErr);
      }
    }

    // Direct Notification constructor
    const notif = new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'heatwave-alert',
      requireInteraction: payload.riskLevel === 'SEVERE',
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    localStorage.setItem(LAST_ALERT_KEY, now.toString());
    return { success: true, message: 'Push notification sent to your device!' };
  } catch (err: any) {
    console.error('Error creating Notification:', err);
    return {
      success: false,
      message: `Failed to trigger push: ${err.message || 'Unknown error'}`,
    };
  }
}

export async function sendPersonalAlertNotification(
  userName: string,
  thresholdC: number,
  currentTempC: number
): Promise<{ success: boolean; message: string }> {
  triggerHapticFeedback();
  playEmergencyAlertSound();

  const title = `⚠️ Personal Heat Alert for ${userName}!`;
  const body = `Personal Heat Alert for ${userName}: Temperature crossed your set limit of ${thresholdC}°C (Current: ${currentTempC}°C). Please take precautions!`;

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { success: false, message: 'Notifications not supported' };
  }

  let permission: string = Notification.permission;
  if (permission === 'default') {
    permission = await requestNotificationPermission();
  }

  if (permission !== 'granted') {
    return { success: false, message: 'Notification permission not granted' };
  }

  try {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            body,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: 'personal-heat-alert',
            renotify: true,
            vibrate: [200, 100, 200],
          } as any);
          return { success: true, message: 'Personal alert push notification dispatched!' };
        }
      } catch (swErr) {
        console.warn('SW notification fallback to Notification', swErr);
      }
    }

    const notif = new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'personal-heat-alert',
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return { success: true, message: 'Personal alert notification sent!' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

