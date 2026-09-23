import type { ComponentPropsWithoutRef, ElementType } from "react";

import { joinClasses } from "./utils.js";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonClassOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: ButtonClassOptions = {}) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "border border-transparent bg-black text-white hover:bg-zinc-800",
    secondary: "border border-zinc-300 text-zinc-800 hover:bg-zinc-100",
    danger: "border border-transparent bg-red-700 text-white hover:bg-red-800",
    ghost: "border border-transparent text-zinc-800 hover:bg-zinc-100",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
  };

  return joinClasses(
    "box-border rounded-full border font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
  );
}

type ButtonOwnProps<T extends ElementType> = ButtonClassOptions & {
  as?: T;
  className?: string;
};

type ButtonProps<T extends ElementType = "button"> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";

  return (
    <Component
      className={joinClasses(
        buttonClasses({ variant, size, fullWidth }),
        className,
      )}
      {...props}
    />
  );
}
