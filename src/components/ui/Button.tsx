import Link from "next/link";
import type React from "react";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import type { ButtonIcon, Size, Target, Variant } from "@/types/ui";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: Target;
  variant?: Variant;
  size?: Size;
  icon?: ButtonIcon;
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  children,
  onClick,
  href,
  target = "_self",
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  className: additionalClassName,
}: ButtonProps) => {
  const iconRight = icon === "next";

  const baseClasses = "flex items-center justify-center rounded";
  const sizeClasses = {
    sm: `px-3 py-1 text-sm ${icon && (iconRight ? "pr-1" : "pl-1")}`,
    md: `px-4 py-2 ${icon && (iconRight ? "pr-2" : "pl-2")}`,
    lg: `px-6 py-3 text-lg ${icon && (iconRight ? "pr-3" : "pl-3")}`,
  };
  const variantClasses = {
    primary:
      "bg-primary hover:bg-primary-hover outline-1 outline-primary-border text-light",
    secondary:
      "bg-secondary hover:bg-secondary-hover outline-1 outline-secondary-border text-dark",
    accent:
      "bg-accent hover:bg-accent-hover outline-1 outline-accent-border text-light",
    ghost:
      "bg-transparent hover:bg-primary-hover:20 outline-1 outline-primary-border text-dark",
    text: "bg-transparent text-dark hover:text-dark/80",
  };
  const disabledClasses = disabled && "opacity-50";
  const className = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabledClasses,
    additionalClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const iconElement = (
    <span className="px-[0.4em]">
      {icon === "prev" ? (
        <MdChevronLeft />
      ) : icon === "next" ? (
        <MdChevronRight />
      ) : icon === "close" ? (
        <MdClose />
      ) : null}
    </span>
  );
  const label = (
    <>
      {icon && (iconRight || iconElement)}
      {children}
      {icon && iconRight && iconElement}
    </>
  );

  return href ? (
    <Link href={href} target={target} className={className}>
      {label}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {label}
    </button>
  );
};
