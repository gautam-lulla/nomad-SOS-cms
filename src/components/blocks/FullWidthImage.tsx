import { cn } from "@/lib/utils";
import Image from "next/image";

interface FullWidthImageProps {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  cmsEntry?: string;
  cmsField?: string;
  cmsLabel?: string;
}

export function FullWidthImage({
  src,
  alt = "",
  className,
  priority = false,
  cmsEntry,
  cmsField,
  cmsLabel,
}: FullWidthImageProps) {
  const cmsAttrs = cmsEntry
    ? {
        "data-cms-entry": cmsEntry,
        "data-cms-field": cmsField || "image",
        "data-cms-type": "image",
        "data-cms-label": cmsLabel || "Full Width Image",
      }
    : {};

  return (
    <section
      className={cn("relative w-full h-[400px] md:h-[600px] lg:h-[840px]", className)}
      {...cmsAttrs}
    >
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
