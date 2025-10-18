import Link from "next/link";
import type React from "react";
import { MdAdd, MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import type { ButtonIcon, Size, Target, Variant } from "@/types/ui";

interface ButtonProps {
  children: React.ReactNode;
  title?: string;
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
  title = typeof children === "string" ? children : undefined,
  onClick,
  href,
  target = "_self",
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  className: additionalClassName,
}: ButtonProps) => {
  const baseClasses =
    "inline-flex gap-1 text-center items-center justify-center rounded";
  const sizeClasses = {
    sm: `px-3 py-1 text-sm`,
    md: `px-4 py-2`,
    lg: `px-6 py-3 text-lg`,
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
    `!${additionalClassName?.replace(/ /g, " !")}`,
  ]
    .filter(Boolean)
    .join(" ");

  const iconRight = icon === "next";
  const iconElement =
    icon === "prev" ? (
      <MdChevronLeft />
    ) : icon === "next" ? (
      <MdChevronRight />
    ) : icon === "close" ? (
      <MdClose />
    ) : icon === "add" ? (
      <MdAdd />
    ) : null;
  const label = (
    <>
      {icon && !iconRight && iconElement}
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
      title={title}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {label}
    </button>
  );
};
