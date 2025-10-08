import type { TemperatureStatus, Vegetable } from "@/types/types";

export function checkTemperatureStatus(
  currentTemp: number,
  vegetable: Vegetable,
  stage: "germination" | "growth" = "growth",
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
