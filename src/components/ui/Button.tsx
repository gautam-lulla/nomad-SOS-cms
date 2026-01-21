"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outline";
  size?: "default" | "small";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "filled", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-gotham font-bold text-cta uppercase tracking-wide-cta",
          "inline-flex items-center justify-center gap-xxs",
          "transition-all duration-300 ease-out",
          size === "default" && "px-s pt-3xs pb-2xs",
          size === "small" && "px-3xs pt-[10px] pb-3xs",
          variant === "filled" && [
            "bg-pink-500 text-black-900",
            "hover:bg-transparent hover:text-off-white-100",
            "border border-transparent hover:border-off-white-100",
          ],
          variant === "outline" && [
            "bg-transparent text-off-white-100",
            "border border-off-white-100",
            "hover:bg-pink-500 hover:text-black-900 hover:border-pink-500",
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
