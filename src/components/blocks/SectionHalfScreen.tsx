import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface SectionHalfScreenProps {
  heading: string;
  paragraphs: string[];
  buttonText?: string;
  buttonHref?: string;
  imageSrc: string;
  imageAlt?: string;
  variant?: "image-left" | "image-right";
  headingSize?: "h1" | "h2";
  className?: string;
  // CMS inline editing props
  cmsEntry?: string;
  cmsFieldPrefix?: string;
}

export function SectionHalfScreen({
  heading,
  paragraphs,
  buttonText,
  buttonHref,
  imageSrc,
  imageAlt = "",
  variant = "image-right",
  headingSize = "h2",
  className,
  cmsEntry,
  cmsFieldPrefix,
}: SectionHalfScreenProps) {
  const isImageLeft = variant === "image-left";

  // Helper to create CMS data attributes
  const cmsAttrs = (field: string, type?: string, label?: string) => {
    if (!cmsEntry || !cmsFieldPrefix) return {};
    return {
      "data-cms-entry": cmsEntry,
      "data-cms-field": `${cmsFieldPrefix}.${field}`,
      ...(type && { "data-cms-type": type }),
      ...(label && { "data-cms-label": label }),
    };
  };

  return (
    <section
      className={cn(
        "flex flex-col lg:flex-row items-center bg-black-900",
        isImageLeft && "lg:flex-row",
        !isImageLeft && "lg:flex-row-reverse",
        className
      )}
    >
      {/* Image */}
      <div
        className="relative w-full lg:w-1/2 h-[400px] lg:h-[840px]"
        {...cmsAttrs("imageSrc", "image", "Image")}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="w-full lg:w-1/2 h-auto lg:h-[840px] flex flex-col justify-between px-6 lg:px-3m py-10 lg:pt-2l lg:pb-l">
        {/* Heading */}
        <h2
          className={cn(
            "font-sabon text-off-white-100 max-w-[544px]",
            headingSize === "h1" && "text-h1",
            headingSize === "h2" && "text-h2-mobile md:text-h2"
          )}
          {...cmsAttrs("heading", undefined, "Heading")}
        >
          {heading}
        </h2>

        {/* Body */}
        <div className="max-w-[433px] flex flex-col gap-3s mt-8 lg:mt-0">
          <div className="flex flex-col gap-xs">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="font-sabon text-body-s text-off-white-100 leading-relaxed"
                {...(paragraphs.length === 1 ? cmsAttrs("paragraph", "textarea", "Paragraph") : {})}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {buttonText && buttonHref && (
            <Link
              href={buttonHref}
              className={cn(
                "font-gotham font-bold text-cta uppercase tracking-wide-cta",
                "inline-flex items-center justify-center gap-xxs",
                "transition-all duration-300 ease-in-out",
                "px-s pt-3xs pb-2xs",
                "bg-transparent text-off-white-100",
                "border border-off-white-100",
                "hover:bg-pink-500 hover:text-black-900 hover:border-pink-500",
                "w-fit"
              )}
            >
              <span {...cmsAttrs("buttonText", undefined, "Button Text")}>
                {buttonText}
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
