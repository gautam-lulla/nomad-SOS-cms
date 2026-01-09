import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-off-white-100/10",
        variant === "rectangular" && "rounded",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded h-4 w-full",
        className
      )}
    />
  );
}
