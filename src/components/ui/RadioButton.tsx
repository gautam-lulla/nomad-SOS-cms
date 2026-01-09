"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  variant?: "light" | "dark";
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ className, label, variant = "dark", checked, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2xxs cursor-pointer">
        <input
          ref={ref}
          type="radio"
          className="sr-only peer"
          checked={checked}
          {...props}
        />
        <div
          className={cn(
            "w-[14px] h-[14px] border rounded-full",
            "flex items-center justify-center",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
            variant === "dark" && "border-black-900",
            variant === "light" && "border-off-white-100",
            className
          )}
        >
          <div
            className={cn(
              "w-[8px] h-[8px] rounded-full transition-transform",
              "peer-checked:scale-100",
              checked ? "scale-100" : "scale-0",
              variant === "dark" && "bg-black-900",
              variant === "light" && "bg-off-white-100"
            )}
          />
        </div>
        {label && (
          <span
            className={cn(
              "font-sabon text-body-s tracking-tight-body leading-relaxed",
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

RadioButton.displayName = "RadioButton";

export { RadioButton };
