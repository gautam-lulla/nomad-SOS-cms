"use client";

import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "light" | "dark";
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant = "dark", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-transparent outline-none resize-y",
          "border-b border-t-0 border-l-0 border-r-0",
          "font-sabon text-body-s py-3xs min-h-[150px]",
          "transition-colors",
          variant === "dark" && "border-black-900 text-black-900 placeholder:text-black-900/70 focus:border-pink-500",
          variant === "light" && "border-off-white-100 text-off-white-100 placeholder:text-off-white-100/70 focus:border-pink-500",
          className
        )}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea };
