import { cn } from "@/lib/utils";
import Image from "next/image";

interface GalleryProps {
  images: {
    src: string;
    alt?: string;
  }[];
  className?: string;
}

export function Gallery({ images, className }: GalleryProps) {
  return (
    <section className={cn("flex flex-col md:flex-row gap-0", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "relative w-full md:flex-1",
            "h-[300px] md:h-[500px] lg:h-[700px]",
            // On mobile, show only first 2 images
            index >= 2 && "hidden md:block"
          )}
        >
          <Image
            src={image.src}
            alt={image.alt || ""}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ))}
    </section>
  );
}
