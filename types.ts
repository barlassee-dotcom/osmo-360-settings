
export enum DeviceType {
  OSMO_360 = 'DJI Osmo 360'
}

export enum LocationType {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR'
}

export enum ShootingActivity {
  STATIC = 'STATIC',
  WALKING = 'WALKING',
  RUNNING = 'RUNNING',
  CYCLING = 'CYCLING',
  MOTORCYCLING = 'MOTORCYCLING',
  DRIVING = 'DRIVING',
  VLOGGING = 'VLOGGING',
  ACTION = 'ACTION',
  PARTY = 'PARTY',
  MUSEUM = 'MUSEUM',
  CONCERT = 'CONCERT',
  STUDIO = 'STUDIO',
  SPORT_HALL = 'SPORT_HALL'
}

export enum WeatherType {
  SUNNY = 'SUNNY',
  CLOUDY = 'CLOUDY',
  OVERCAST = 'OVERCAST',
  RAINY = 'RAINY',
  FOGGY = 'FOGGY',
  SNOWY = 'SNOWY'
}

export interface EnvironmentData {
  type: LocationType;
  activity: ShootingActivity;
  country?: string;
  city?: string;
  date?: string;
  time?: string;
  weather?: string;
  temp?: string;
  description?: string;
  isAuto?: boolean;
}

export interface ProSettings {
  resolution: string;
  fps: string;
  shutterSpeed: string;
  iso: string;
  ev: string;
  whiteBalance: string;
  colorProfile: string;
  ndFilter: string;
  explanation: string;
  proTips: string[];
}

export interface RecommendationRequest {
  device: DeviceType;
  envData: EnvironmentData;
  image?: string;
  lang: 'TR' | 'EN';
}

export type AppLang = 'TR' | 'EN';
