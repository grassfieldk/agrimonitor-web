import type React from "react";

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Checkbox component
 * @param checked - Checked state
 * @param onChange - Change handler
 */
export function Checkbox({
  id,
  checked,
  onChange,
  disabled = false,
  className: additionalClassName,
}: CheckboxProps) {
  const baseClasses =
    "w-4 h-4 rounded border-1 border-primary-200 accent-primary";
  const className = [baseClasses, additionalClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={className}
    />
  );
}
