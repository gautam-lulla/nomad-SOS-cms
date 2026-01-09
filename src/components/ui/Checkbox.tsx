"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  variant?: "light" | "dark";
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, variant = "dark", ...props }, ref) => {
    return (
      <label className="flex items-center gap-2xxs cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "w-[14px] h-[14px] border",
            "peer-checked:bg-current",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
            variant === "dark" && "border-black-900",
            variant === "light" && "border-off-white-100",
            className
          )}
        />
        {label && (
          <span
            className={cn(
              "font-gotham font-bold text-cta uppercase tracking-wide-cta",
              variant === "dark" && "text-black-900",
              variant === "light" && "text-off-white-100"
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
