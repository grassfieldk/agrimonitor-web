import type React from "react";
import type { Size } from "@/types/ui";
import { Button } from "./Button";

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  size?: Size;
}

export const ToggleButton = ({
  isOn,
  onToggle,
  children,
  size = "md",
}: ToggleButtonProps) => {
  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  const gapClasses = {
    sm: "gap-1.5",
    md: "gap-2",
    lg: "gap-2.5",
  };

  return (
    <Button
      onClick={onToggle}
      variant={isOn ? "primary" : "secondary"}
      size={size}
      className="rounded-full"
    >
      <span className={`flex items-center ${gapClasses[size]}`}>
        <span
          className={`${dotSizeClasses[size]} rounded-full ${isOn ? "bg-white" : "bg-disabled"}`}
        />
        {children}
      </span>
    </Button>
  );
};
