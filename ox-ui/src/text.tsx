import type { ComponentPropsWithoutRef, ElementType } from "react";

import { joinClasses } from "./utils.js";

type TextVariant = "primary" | "secondary";
type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

type TextClassOptions = {
  variant?: TextVariant;
  size?: TextSize;
};

export function textClasses({
  variant = "primary",
  size = "base",
}: TextClassOptions = {}) {
  const variantClasses: Record<TextVariant, string> = {
    primary: "font-semibold tracking-tight text-black",
    secondary: "font-semibold tracking-widest uppercase text-black/60",
  };

  const sizeClasses: Record<TextSize, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };

  return joinClasses(variantClasses[variant], sizeClasses[size]);
}

type TextOwnProps<T extends ElementType> = TextClassOptions & {
  as?: T;
  className?: string;
};

type TextProps<T extends ElementType = "p"> = TextOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;

export function Text<T extends ElementType = "p">({
  as,
  variant = "primary",
  size = "base",
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={joinClasses(textClasses({ variant, size }), className)}
      {...props}
    />
  );
}
