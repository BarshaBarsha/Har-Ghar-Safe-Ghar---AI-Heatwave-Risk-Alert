import { UserProfile, StoredUserRecord } from '../types/auth';

const AUTH_STORAGE_KEY = 'heatwave_current_user_v1';
export const USERS_STORAGE_KEY = 'heatwave_users';
const ADMIN_SESSION_KEY = 'heatwave_admin_auth_v1';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user_sahil',
  name: 'Sahil Kumar',
  email: 'sahil@heatwave.ai',
  phone: '+91 94370 12345',
  location: 'Bada Raghunathpur, Bhubaneswar',
  personalThresholdTempC: 39,
  createdAt: new Date().toISOString(),
  loginTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  deviceInfo: typeof navigator !== 'undefined' ? getClientDeviceInfo() : 'Desktop Chrome 122 / Windows',
};

const SEED_USERS: StoredUserRecord[] = [
  {
    id: 'user_sahil',
    name: 'Sahil Kumar',
    email: 'sahil@heatwave.ai',
    phone: '+91 94370 12345',
    location: 'Bada Raghunathpur, Bhubaneswar',
    personalThresholdTempC: 39,
    loginTime: new Date(Date.now() - 1000 * 60 * 12).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    deviceInfo: 'Chrome 124 / Android Mobile (Active PWA)',
  },
  {
    id: 'user_amit',
    name: 'Amit Mohanty',
    email: 'amit.m@odisha-heat.gov.in',
    phone: '+91 98610 54321',
    location: 'Jatani, Khurda',
    personalThresholdTempC: 41,
    loginTime: new Date(Date.now() - 1000 * 60 * 45).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    deviceInfo: 'Edge 123 / Windows 11 Desktop',
  },
  {
    id: 'user_priya',
    name: 'Priya Das',
    email: 'priya.das@community-ngo.org',
    phone: '+91 94399 87654',
    location: 'Bhanjanagar, Ganjam',
    personalThresholdTempC: 38,
    loginTime: new Date(Date.now() - 1000 * 60 * 95).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    deviceInfo: 'Safari 17 / iPhone 15 Pro (iOS 17)',
  },
];

export function getClientDeviceInfo(): string {
  if (typeof navigator === 'undefined') return 'Unknown Device';
  const ua = navigator.userAgent;
  let browser = 'Browser';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome')) browser = 'Google Chrome';
  else if (ua.includes('Safari')) browser = 'Apple Safari';

  let os = 'OS';
  if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
}

export function getAllRegisteredUsers(): StoredUserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse heatwave_users from localStorage:', err);
  }

  // Seed default demonstration users into localStorage
  saveAllRegisteredUsers(SEED_USERS);
  return SEED_USERS;
}

export function saveAllRegisteredUsers(users: StoredUserRecord[]): void {
  try {
    // Explicitly uses localStorage.setItem('heatwave_users', JSON.stringify(users))
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('Failed to save heatwave_users to localStorage:', err);
  }
}

export function clearAllRegisteredUsers(): void {
  try {
    localStorage.removeItem(USERS_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear heatwave_users from localStorage:', err);
  }
}

export function getCurrentUser(): UserProfile {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to read current user from localStorage:', err);
  }
  // Auto-initialize default profile so dashboard loads immediately on first visit
  saveCurrentUser(DEFAULT_USER_PROFILE);
  return DEFAULT_USER_PROFILE;
}

export function saveCurrentUser(user: UserProfile): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Failed to save current user to localStorage:', err);
  }

  // Also sync to heatwave_users list
  try {
    const allUsers = getAllRegisteredUsers();
    const existingIndex = allUsers.findIndex((u) => u.email === user.email || u.id === user.id);
    const record: StoredUserRecord = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      personalThresholdTempC: user.personalThresholdTempC,
      loginTime: user.loginTime || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      deviceInfo: user.deviceInfo || getClientDeviceInfo(),
    };

    if (existingIndex >= 0) {
      allUsers[existingIndex] = record;
    } else {
      allUsers.unshift(record);
    }
    saveAllRegisteredUsers(allUsers);
  } catch (err) {
    console.warn('Failed to update heatwave_users registry:', err);
  }
}

export function updatePersonalThreshold(thresholdTempC: number): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;
  const updated: UserProfile = {
    ...current,
    personalThresholdTempC: thresholdTempC,
  };
  saveCurrentUser(updated);
  return updated;
}

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear user from localStorage:', err);
  }
}

export function loginOrRegisterMock(
  name: string,
  email: string,
  phone?: string,
  location?: string,
  thresholdC: number = 39
): UserProfile {
  const user: UserProfile = {
    id: `user_${Date.now()}`,
    name: name.trim() || 'Demo User',
    email: email.trim() || 'demo@heatwave.ai',
    phone: phone?.trim() || '',
    location: location?.trim() || 'Bada Raghunathpur, Bhubaneswar',
    personalThresholdTempC: thresholdC,
    createdAt: new Date().toISOString(),
    loginTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    deviceInfo: getClientDeviceInfo(),
  };
  saveCurrentUser(user);
  return user;
}

// Admin Authentication logic
export function checkAdminCredentials(username: string, password: string): boolean {
  return username.trim() === 'admin' && password.trim() === 'admin123';
}

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(auth: boolean): void {
  try {
    if (auth) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (err) {
    console.warn('Session storage error:', err);
  }
}

export function exportUsersCSV(users: StoredUserRecord[]): void {
  const headers = ['Sl No', 'Name', 'Email', 'Phone', 'Location', 'Personal Limit (C)', 'Login Time', 'Device Info'];
  const rows = users.map((u, i) => [
    i + 1,
    `"${u.name.replace(/"/g, '""')}"`,
    `"${u.email.replace(/"/g, '""')}"`,
    `"${(u.phone || '').replace(/"/g, '""')}"`,
    `"${u.location.replace(/"/g, '""')}"`,
    u.personalThresholdTempC,
    `"${u.loginTime.replace(/"/g, '""')}"`,
    `"${u.deviceInfo.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `heatwave_users_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
