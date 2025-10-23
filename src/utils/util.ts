import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  TemperatureCategory,
  TemperatureStatus,
  VegetableInfo,
} from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkTemperatureStatus(
  currentTemp: number,
  vegetable: VegetableInfo,
  stage: TemperatureCategory,
): TemperatureStatus {
  const tempConfig = vegetable.temperature[stage];
  const { optimumRange, limitRange } = tempConfig;

  // Check if within optimal range
  if (
    optimumRange.low !== null &&
    optimumRange.high !== null &&
    currentTemp >= optimumRange.low &&
    currentTemp <= optimumRange.high
  ) {
    return "optimal";
  }

  // Check if within limit range
  if (
    (limitRange.low === null || currentTemp >= limitRange.low) &&
    (limitRange.high === null || currentTemp <= limitRange.high)
  ) {
    return "acceptable";
  }

  // Check if close to limit range
  const tempDiff = Math.min(
    limitRange.low !== null ? Math.abs(currentTemp - limitRange.low) : Infinity,
    limitRange.high !== null
      ? Math.abs(currentTemp - limitRange.high)
      : Infinity,
  );

  if (tempDiff <= 5) {
    return "warning";
  }

  return "danger";
}

export function getStatusColor(status: TemperatureStatus): string {
  switch (status) {
    case "optimal":
      return "text-green-500";
    case "acceptable":
      return "text-lime-300";
    case "warning":
      return "text-orange-500";
    case "danger":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

export function getStatusBgColor(status: TemperatureStatus): string {
  switch (status) {
    case "optimal":
      return "bg-green-600";
    case "acceptable":
      return "bg-lime-600";
    case "warning":
      return "bg-orange-600";
    case "danger":
      return "bg-red-600";
    default:
      return "bg-gray-600";
  }
}

export function getStatusText(status: TemperatureStatus): string {
  switch (status) {
    case "optimal":
      return "最適";
    case "acceptable":
      return "良好";
    case "warning":
      return "注意";
    case "danger":
      return "危険";
    default:
      return "不明";
  }
}

export function getTemperatureColor(temperature: number): string {
  if (temperature >= 35) {
    return "#b40068";
  } else if (temperature >= 30) {
    return "#ff2800";
  } else if (temperature >= 25) {
    return "#ff9900";
  } else if (temperature >= 20) {
    return "#faf500";
  } else if (temperature >= 15) {
    return "#ffff96";
  } else if (temperature >= 10) {
    return "#fffff0";
  } else if (temperature >= 5) {
    return "#b9ebff";
  } else if (temperature >= 0) {
    return "#0096ff";
  } else if (temperature >= -5) {
    return "#0041ff";
  } else {
    return "#002080";
  }
}

export function getHumidityColor(humidity: number): string {
  if (humidity >= 100) {
    return "#011f7d";
  } else if (humidity >= 90) {
    return "#004b96";
  } else if (humidity >= 80) {
    return "#00729a";
  } else if (humidity >= 70) {
    return "#1fc2d3";
  } else if (humidity >= 60) {
    return "#80f8e7";
  } else if (humidity >= 50) {
    return "#fffff0";
  } else if (humidity >= 40) {
    return "#ffc846";
  } else if (humidity >= 30) {
    return "#e78707";
  } else if (humidity >= 20) {
    return "#ab4a01";
  } else if (humidity >= 10) {
    return "#761100";
  } else {
    return "#540600";
  }
}

export function getPrecipitationColor(precipitation: number): string {
  if (precipitation >= 80) {
    return "#b40068";
  } else if (precipitation >= 50) {
    return "#b40068";
  } else if (precipitation >= 30) {
    return "#ff9900";
  } else if (precipitation >= 20) {
    return "#faf500";
  } else if (precipitation >= 10) {
    return "#0041ff";
  } else if (precipitation >= 5) {
    return "#218cff";
  } else if (precipitation >= 1) {
    return "#a0d2ff";
  } else {
    return "#f2f2ff";
  }
}
