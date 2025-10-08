import type React from "react";

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const ToggleButton = ({
  isOn,
  onToggle,
  children,
}: ToggleButtonProps) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative px-6 py-2 text-sm rounded-full border-1 ${
      isOn
        ? "bg-green-600 border-green-500 text-white"
        : "bg-neutral-700 border-neutral-600 text-neutral-300 hover:border-neutral-500"
    }`}
  >
    <span className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${
          isOn ? "bg-white" : "bg-neutral-500"
        }`}
      />
      {children}
    </span>
  </button>
);
