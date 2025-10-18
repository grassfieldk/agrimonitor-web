import type React from "react";

interface NumberInputProps {
  id?: string;
  value: number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Number input component
 * @param value - Current number value (null for empty)
 * @param onChange - Change handler
 */
export function NumberInput({
  id,
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  required = false,
  disabled = false,
  className: additionalClassName,
}: NumberInputProps) {
  const baseClasses =
    "w-full p-2 bg-primary-50 border-1 border-primary-200 rounded text-center text-dark";
  const className = [baseClasses, additionalClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      id={id}
      type="number"
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      required={required}
      disabled={disabled}
      className={className}
    />
  );
}
