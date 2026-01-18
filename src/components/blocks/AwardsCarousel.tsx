import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

interface AwardLogo {
  src: string;
  alt: string;
}

interface AwardsCarouselProps {
  title?: string;
  logos: AwardLogo[];
  className?: string;
  cmsEntry?: string;
  cmsFieldPrefix?: string;
}

export function AwardsCarousel({
  title = "Awards & Recognitions",
  logos,
  className,
  cmsEntry,
  cmsFieldPrefix,
}: AwardsCarouselProps) {
  const cmsAttrs = (field: string, type: "text" | "image" = "text", label?: string) => {
    if (!cmsEntry) return {};
    const prefix = cmsFieldPrefix ? `${cmsFieldPrefix}.` : "";
    return {
      "data-cms-entry": cmsEntry,
      "data-cms-field": `${prefix}${field}`,
      "data-cms-type": type,
      "data-cms-label": label || field,
    };
  };

  return (
    <section className={cn("px-4 md:px-6 lg:px-3m", className)}>
      {/* Title */}
      <h2
        className="font-sabon text-h2 text-off-white-100 text-center mb-10 lg:mb-l"
        {...cmsAttrs("title", "text", "Awards Section Title")}
      >
        {title}
      </h2>

      {/* Awards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="xl:flex-1 border border-off-white-100 -mt-px first:mt-0 md:-ml-px md:first:ml-0 md:mt-0 h-[180px] md:h-[250px] lg:h-[340px] flex items-center justify-center"
            {...cmsAttrs(`logos[${index}].src`, "image", `Award Logo ${index + 1}`)}
          >
            <div className="relative w-[100px] md:w-[120px] lg:w-[150px] h-[50px] md:h-[60px] lg:h-[80px]">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Arrows */}
      <div className="flex items-center justify-center gap-s mt-6 lg:mt-3s">
        <button className="text-off-white-100 hover:text-pink-500 transition-colors">
          <ArrowLeftIcon />
        </button>
        <button className="text-off-white-100 hover:text-pink-500 transition-colors">
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
}
