export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export type TemperatureUnit = 'C' | 'F';

export interface WeatherData {
  temperature: number; // in Celsius internally
  humidity: number; // percentage 0 - 100
  heatIndex: number; // in Celsius
  wetBulb: number; // in Celsius
  dewPoint: number; // in Celsius
  humidex: number;
  locationName: string;
  isLive: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  sourceDescription: string;
}

export interface PredictionResult {
  riskLevel: RiskLevel;
  confidence: number; // 0 - 100
  classProbabilities: {
    LOW: number;
    MODERATE: number;
    HIGH: number;
    SEVERE: number;
  };
  alertHeadline: string;
  alertStatement: string;
  explanation: string;
  physiologicalImpact: string;
  safetyRecommendations: string[];
  vulnerableGroupsGuidance: string[];
  recommendedWaterIntakePerHourMl: number;
  decisionTreePath: string[];
  featureWeights: {
    name: string;
    value: string;
    importancePercentage: number;
  }[];
  modelVersion: string;
  executionMode: 'in-browser-decision-tree' | 'python-backend-api';
  latencyMs: number;
}

export interface TestCasePreset {
  id: string;
  label: string;
  tempC: number;
  humidity: number;
  expectedRisk: RiskLevel;
  scenario: string;
}

export interface ValidationIssue {
  field: 'temperature' | 'humidity' | 'general';
  level: 'warning' | 'error';
  message: string;
}
