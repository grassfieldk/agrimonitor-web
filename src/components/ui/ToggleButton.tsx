import type React from "react";

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const ToggleButton = ({
  isOn,
  onToggle,
  children,
  size = "md",
}: ToggleButtonProps) => {
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

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

  const className = `relative rounded-full border-1 ${sizeClasses[size]} ${
    isOn
      ? "bg-green-600 border-green-500 text-white"
      : "bg-neutral-700 border-neutral-600 text-neutral-300 hover:border-neutral-500"
  }`;

  return (
    <button type="button" onClick={onToggle} className={className}>
      <span className={`flex items-center ${gapClasses[size]}`}>
        <span
          className={`${dotSizeClasses[size]} rounded-full ${
            isOn ? "bg-white" : "bg-neutral-500"
          }`}
        />
        {children}
      </span>
    </button>
  );
};
