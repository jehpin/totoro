export interface WeatherCondition {
  temp: number;
  feelsLike: number;
  rainChance: number; // 0 - 100
  windSpeed: number; // km/h
  windLabel: string;
  humidity: number; // %
  humidityLabel: string;
  uvIndex: number;
  uvLabel: string;
  summary: string;
  singlishSummary: string;
  icon: 'sun' | 'cloud-sun' | 'cloud-rain' | 'cloud-lightning' | 'cloud-drizzle';
  rainfallMm: number;
}

export interface SingaporeLocation {
  id: string;
  name: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
  lat: number;
  lng: number;
  isPopular?: boolean;
  weather: WeatherCondition;
  hourlyForecast: HourlyForecastItem[];
}

export interface HourlyForecastItem {
  time: string;
  hour: number;
  rainChance: number;
  temp: number;
  condition: string;
  icon: 'sun' | 'cloud-sun' | 'cloud-rain' | 'cloud-lightning' | 'cloud-drizzle';
}

export interface UmbrellaStation {
  id: string;
  name: string;
  locationName: string;
  mrtStation: string;
  exit: string;
  available: number;
  totalCapacity: number;
  returnSlots: number;
  isShelteredToMrt: boolean;
  shelteredWalkwayDistanceM: number;
  distanceKm?: number;
  status: 'operational' | 'low_stock' | 'full';
}

export type SinglishLevel = 'standard' | 'mild' | 'hawker_uncle';

export interface VerdictConfig {
  location: SingaporeLocation;
  travelMode: 'walk' | 'public_transit' | 'car' | 'bicycle';
  durationMinutes: number;
  singlishLevel: SinglishLevel;
}

export interface VerdictOutput {
  decision: 'MUST_BRING' | 'BETTER_BRING' | 'OPTIONAL' | 'NO_NEED';
  headline: string;
  subtext: string;
  badgeColor: string;
  borderColor: string;
  advice: string[];
  singlishTip: string;
}

export interface RainfallSensor {
  id: string;
  stationId: string;
  name: string;
  lat: number;
  lng: number;
  value: number; // rainfall mm in past 5/15 min
}

export interface LiveAirQuality {
  psi: {
    overall: number;
    north: number;
    south: number;
    east: number;
    west: number;
    central: number;
    status: string;
  };
  pm25: {
    overall: number;
    north: number;
    south: number;
    east: number;
    west: number;
    central: number;
    status: string;
  };
  uv: {
    index: number;
    status: string;
    timestamp: string;
  };
}

export interface FourDayOutlookItem {
  day: string;
  date: string;
  forecast: string;
  tempLow: number;
  tempHigh: number;
  humidityLow: number;
  humidityHigh: number;
  windSpeed: string;
}

export interface LiveWeatherData {
  twentyFourHrGeneral?: string;
  regionForecasts?: Record<string, { forecast: string; tempLow: number; tempHigh: number }>;
  airQuality: LiveAirQuality;
  rainfallSensors: RainfallSensor[];
  fourDayOutlook: FourDayOutlookItem[];
  lastUpdated: string;
  isLive: boolean;
}

