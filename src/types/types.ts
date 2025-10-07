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
