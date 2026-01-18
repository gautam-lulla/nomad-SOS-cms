import { cn } from "@/lib/utils";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt?: string;
  id?: string;
  slug?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  className?: string;
  cmsEntry?: string;
  cmsFieldPrefix?: string;
}

export function Gallery({ images, className, cmsEntry, cmsFieldPrefix }: GalleryProps) {
  const cmsAttrs = (index: number, field: string) => {
    if (!cmsEntry) return {};
    const prefix = cmsFieldPrefix ? `${cmsFieldPrefix}.` : "";
    return {
      "data-cms-entry": cmsEntry,
      "data-cms-field": `${prefix}images[${index}].${field}`,
      "data-cms-type": field === "src" ? "image" : "text",
      "data-cms-label": `Gallery Image ${index + 1} ${field === "src" ? "" : "Alt Text"}`,
    };
  };

  return (
    <section className={cn("flex flex-col md:flex-row gap-0", className)}>
      {images.map((image, index) => (
        <div
          key={image.id || index}
          className={cn(
            "relative w-full md:flex-1",
            "h-[300px] md:h-[500px] lg:h-[700px]",
            // On mobile, show only first 2 images
            index >= 2 && "hidden md:block"
          )}
          {...cmsAttrs(index, "src")}
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
