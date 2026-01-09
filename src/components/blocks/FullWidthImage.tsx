import { cn } from "@/lib/utils";
import Image from "next/image";

interface FullWidthImageProps {
  src: string;
  alt?: string;
  height?: number;
  className?: string;
}

export function FullWidthImage({
  src,
  alt = "",
  height = 840,
  className,
}: FullWidthImageProps) {
  return (
    <section className={cn("relative w-full", className)} style={{ height }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </section>
  );
}
