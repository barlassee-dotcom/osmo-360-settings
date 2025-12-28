
export enum DeviceType {
  OSMO_360 = 'DJI Osmo 360'
}

export enum EnvironmentType {
  BRIGHT_DAY = 'Bright Daylight',
  GOLDEN_HOUR = 'Golden Hour',
  LOW_LIGHT = 'Low Light / Night',
  INDOOR = 'Indoor / Studio',
  ACTION_SPORTS = 'High-Speed Action',
  UNDERWATER = 'Underwater'
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
  environment: EnvironmentType | string;
  image?: string; // base64
}
