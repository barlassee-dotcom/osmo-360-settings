
export enum DeviceType {
  OSMO_360 = 'DJI Osmo 360'
}

export enum LocationType {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR'
}

export enum ShootingActivity {
  // Outdoor
  STATIC_LANDSCAPE = 'STATIC_LANDSCAPE',
  WALKING = 'WALKING',
  RUNNING = 'RUNNING',
  CYCLING = 'CYCLING',
  MOTORCYCLING = 'MOTORCYCLING',
  DRIVING = 'DRIVING',
  VLOGGING = 'VLOGGING',
  ACTION = 'ACTION',
  // Indoor
  PARTY = 'PARTY',
  MUSEUM = 'MUSEUM',
  CONCERT = 'CONCERT',
  STUDIO = 'STUDIO',
  SPORT_HALL = 'SPORT_HALL',
  REAL_ESTATE = 'REAL_ESTATE',
  CAFE_RESTAURANT = 'CAFE_RESTAURANT',
  WORKSHOP = 'WORKSHOP',
  OFFICE = 'OFFICE'
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
  weather?: WeatherType;
  time: string; // HH:mm format
  locationContext?: string; // "Orman", "Şehir Merkezi" vb.
  description?: string;
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

export type AppLang = 'TR' | 'EN';
