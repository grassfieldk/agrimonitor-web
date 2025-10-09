import type {
  TemperatureCategory,
  TemperatureStatus,
  VegetableInfo,
} from "@/types/types";

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
