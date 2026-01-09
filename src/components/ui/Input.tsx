"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";
import { ArrowRightIcon } from "@/components/icons";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  showArrow?: boolean;
  variant?: "light" | "dark";
  inputStyle?: "form" | "newsletter";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, showArrow = true, variant = "dark", inputStyle = "newsletter", ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-xs",
          "border-b pb-3xs",
          variant === "dark" && "border-black-900",
          variant === "light" && "border-off-white-100"
        )}
      >
        <input
          ref={ref}
          className={cn(
            "flex-1 bg-transparent outline-none",
            inputStyle === "newsletter" && "font-gotham font-bold text-h5 uppercase tracking-wide-h5",
            inputStyle === "form" && "font-sabon text-body-s italic",
            variant === "dark" && "text-black-900 placeholder:text-black-900/70",
            variant === "light" && "text-off-white-100 placeholder:text-off-white-100/70",
            className
          )}
          {...props}
        />
        {showArrow && (
          <ArrowRightIcon
            className={cn(
              variant === "dark" && "text-black-900",
              variant === "light" && "text-off-white-100"
            )}
          />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
