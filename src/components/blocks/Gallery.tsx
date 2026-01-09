import { cn } from "@/lib/utils";
import Image from "next/image";

interface GalleryProps {
  images: {
    src: string;
    alt?: string;
  }[];
  height?: number;
  className?: string;
}

export function Gallery({ images, height = 700, className }: GalleryProps) {
  return (
    <section className={cn("flex gap-0", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className="flex-1 relative"
          style={{ height }}
        >
          <Image
            src={image.src}
            alt={image.alt || ""}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </section>
  );
}
