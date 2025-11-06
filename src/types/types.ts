export type SensorData = {
  datetime: string;
  unixtime: number;
  temperature: string;
  humidity: string;
};
export const initialSensorData: SensorData = {
  datetime: "-",
  unixtime: 0,
  temperature: "-",
  humidity: "-",
};

export type WeatherData = {
  locationNumber: string;
  dateTime: string;
  prefecture: string;
  location: string;
  precipitation: number;
  maxPrecipitationToday: number;
  recordPrecipitation: number;
  octoberRecord: number;
};
export const initialWeatherData: WeatherData = {
  locationNumber: "-",
  dateTime: "-",
  prefecture: "-",
  location: "-",
  precipitation: 0,
  maxPrecipitationToday: 0,
  recordPrecipitation: 0,
  octoberRecord: 0,
};

export type VegetableInfo = {
  id: number;
  name: string;
  enabled: boolean;
  temperature: {
    germination: VegetableTemperature;
    growth: VegetableTemperature;
  };
};

export type VegetableTemperature = {
  optimumRange: TemperatureRange;
  limitRange: TemperatureRange;
};
export type TemperatureRange = {
  low: number | null;
  high: number | null;
};

export type TemperatureCategory = "growth" | "germination";
export type TemperatureStatus = "optimal" | "acceptable" | "warning" | "danger";
