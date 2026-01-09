import { cn } from "@/lib/utils";
import Image from "next/image";

interface FullWidthImageProps {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

export function FullWidthImage({
  src,
  alt = "",
  className,
  priority = false,
}: FullWidthImageProps) {
  return (
    <section className={cn("relative w-full h-[400px] md:h-[600px] lg:h-[840px]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        loading={priority ? undefined : "lazy"}
        priority={priority}
        sizes="100vw"
      />
    </section>
  );
}
