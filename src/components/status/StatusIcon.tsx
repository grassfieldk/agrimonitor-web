import { GiSeedling, GiWheat } from "react-icons/gi";
import type { TemperatureCategory, TemperatureStatus } from "@/types/types";
import { getStatusColor } from "@/utils/util";

interface StatusIconProps {
  status: TemperatureStatus;
  stage: TemperatureCategory;
  className?: string;
  title?: string;
}

export const StatusIcon = ({
  status,
  stage,
  className = "w-4 h-4",
  title,
}: StatusIconProps) => {
  const IconComponent = stage === "germination" ? GiSeedling : GiWheat;

  return (
    <IconComponent
      className={`${getStatusColor(status)} ${className}`}
      title={title}
    />
  );
};
