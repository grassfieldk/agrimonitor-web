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

export type TemperatureRange = {
  low: number | null;
  high: number | null;
};

export type VegetableTemperature = {
  optimumRange: TemperatureRange;
  limitRange: TemperatureRange;
};

export type Vegetable = {
  id: number;
  name: string;
  temperature: {
    germination: VegetableTemperature;
    growth: VegetableTemperature;
  };
};

export type VegetableData = {
  vegetables: Vegetable[];
};

export type TemperatureStatus = "optimal" | "acceptable" | "warning" | "danger";
