"use client";

import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { Skeleton } from "./Skeleton";

interface ImageWithLoaderProps extends Omit<ImageProps, "onLoad"> {
  skeletonClassName?: string;
}

export function ImageWithLoader({
  className,
  skeletonClassName,
  alt,
  ...props
}: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <Skeleton
          className={cn("absolute inset-0 w-full h-full", skeletonClassName)}
        />
      )}
      <Image
        {...props}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
