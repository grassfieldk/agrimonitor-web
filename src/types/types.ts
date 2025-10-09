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

export type VegetableInfo = {
  id: number;
  name: string;
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
