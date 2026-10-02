/**
 * Meteorological formulas and unit conversions for heat stress calculation.
 * Complies with NOAA National Weather Service Rothfusz regression & Stull equations.
 */

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

/**
 * Calculates NOAA Heat Index in Celsius
 * @param tempC Ambient temperature in Celsius
 * @param rh Relative humidity in percent (0 - 100)
 */
export function calculateHeatIndex(tempC: number, rh: number): number {
  const tF = celsiusToFahrenheit(tempC);

  // For low temperatures, Heat Index equals ambient temperature
  if (tF < 75) {
    return tempC;
  }

  // Simple preliminary equation
  const simpleHI = 0.5 * (tF + 61.0 + (tF - 68.0) * 1.2 + rh * 0.094);

  if (simpleHI < 80) {
    return Math.round(fahrenheitToCelsius(simpleHI) * 10) / 10;
  }

  // Full Rothfusz regression equation
  let hi =
    -42.379 +
    2.04901523 * tF +
    10.14333127 * rh -
    0.22475541 * tF * rh -
    0.00683783 * tF * tF -
    0.05481717 * rh * rh +
    0.00122874 * tF * tF * rh +
    0.00085282 * tF * rh * rh -
    0.00000199 * tF * tF * rh * rh;

  // NOAA Adjustments
  if (rh < 13 && tF >= 80 && tF <= 112) {
    const adj = ((13 - rh) / 4) * Math.sqrt(Math.max(0, (17 - Math.abs(tF - 95)) / 17));
    hi -= adj;
  } else if (rh > 85 && tF >= 80 && tF <= 87) {
    const adj = ((rh - 85) / 10) * ((87 - tF) / 5);
    hi += adj;
  }

  const resultC = fahrenheitToCelsius(hi);
  return Math.round(resultC * 10) / 10;
}

/**
 * Approximates Wet-Bulb Temperature (Twb) using Stull (2011) equation.
 * Critical for assessing physiological thermoregulation limit (Twb > 35°C is fatal).
 */
export function calculateWetBulb(tempC: number, rh: number): number {
  const t = Math.max(-20, Math.min(60, tempC));
  const r = Math.max(1, Math.min(100, rh));

  const twb =
    t * Math.atan(0.151977 * Math.sqrt(r + 8.313659)) +
    Math.atan(t + r) -
    Math.atan(r - 1.676331) +
    0.00391838 * Math.pow(r, 1.5) * Math.atan(0.023101 * r) -
    4.686035;

  return Math.round(twb * 10) / 10;
}

/**
 * Calculates Dew Point using Magnus-Tetens approximation.
 */
export function calculateDewPoint(tempC: number, rh: number): number {
  const a = 17.27;
  const b = 237.7;
  const clampedRh = Math.max(0.1, Math.min(100, rh));
  const alpha = (a * tempC) / (b + tempC) + Math.log(clampedRh / 100);
  const dp = (b * alpha) / (a - alpha);
  return Math.round(dp * 10) / 10;
}

/**
 * Calculates Canadian Humidex rating.
 */
export function calculateHumidex(tempC: number, dewPointC: number): number {
  const e = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (273.15 + dewPointC)));
  const h = tempC + (5 / 9) * (e - 10);
  return Math.round(h * 10) / 10;
}

/**
 * Input sanitization and validation
 */
export interface ValidationResult {
  isValid: boolean;
  sanitizedTempC: number;
  sanitizedHumidity: number;
  issues: string[];
  warnings: string[];
}

export function validateWeatherInputs(
  tempInput: number | string,
  rhInput: number | string,
  unit: 'C' | 'F' = 'C'
): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  const rawTemp = typeof tempInput === 'string' ? parseFloat(tempInput.trim()) : tempInput;
  const rawRh = typeof rhInput === 'string' ? parseFloat(rhInput.trim()) : rhInput;

  if (isNaN(rawTemp)) {
    issues.push('Temperature must be a valid numerical value.');
  }
  if (isNaN(rawRh)) {
    issues.push('Relative humidity must be a valid numerical value.');
  }

  let tempC = rawTemp;
  if (!isNaN(rawTemp) && unit === 'F') {
    tempC = fahrenheitToCelsius(rawTemp);
  }

  // Realistic bounds on Earth
  if (!isNaN(tempC)) {
    if (tempC < -20 || tempC > 65) {
      issues.push(
        unit === 'C'
          ? 'Temperature must be between -20°C and 65°C.'
          : 'Temperature must be between -4°F and 149°F.'
      );
    } else if (tempC > 50) {
      warnings.push('Temperature exceeds 50°C (122°F): Extreme heat anomaly.');
    }
  }

  if (!isNaN(rawRh)) {
    if (rawRh < 0 || rawRh > 100) {
      issues.push('Relative humidity must be between 0% and 100%.');
    }
  }

  const isValid = issues.length === 0;

  return {
    isValid,
    sanitizedTempC: isNaN(tempC) ? 30 : Math.round(tempC * 10) / 10,
    sanitizedHumidity: isNaN(rawRh) ? 50 : Math.max(0, Math.min(100, Math.round(rawRh))),
    issues,
    warnings,
  };
}
