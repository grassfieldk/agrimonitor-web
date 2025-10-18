import type React from "react";
import { cn } from "@/utils/util";

interface InputProps {
  id?: string;
  type?: "text" | "email" | "password" | "search";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Text input component
 * @param value - Current input value
 * @param onChange - Change handler
 */
export function Input({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className: additionalClassName,
}: InputProps) {
  const baseClasses =
    "w-full p-2 bg-primary-50 border-1 border-primary-200 rounded text-dark";
  const className = cn(baseClasses, additionalClassName);

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={className}
    />
  );
}
