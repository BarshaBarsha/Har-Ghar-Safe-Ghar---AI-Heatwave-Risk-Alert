export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  personalThresholdTempC: number;
  createdAt: string;
  loginTime?: string;
  deviceInfo?: string;
}

export interface StoredUserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  personalThresholdTempC: number;
  loginTime: string;
  deviceInfo: string;
}
