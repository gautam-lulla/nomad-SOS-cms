import { cn } from "@/lib/utils";
import Link from "next/link";

interface TextSectionProps {
  heading: string;
  paragraph?: string;
  buttonText?: string;
  buttonHref?: string;
  layout?: "left-right" | "centered";
  showLocationHours?: boolean;
  className?: string;
}

export function TextSection({
  heading,
  paragraph,
  buttonText,
  buttonHref,
  layout = "left-right",
  showLocationHours = false,
  className,
}: TextSectionProps) {
  if (layout === "centered") {
    return (
      <section className={cn("max-w-[454px] mx-auto text-center px-4 md:px-6", className)}>
        <h2 className="font-sabon text-h2 text-off-white-100 mb-4 lg:mb-3s">
          {heading}
        </h2>
        {paragraph && (
          <p className="font-sabon text-body-s text-off-white-100 leading-relaxed">
            {paragraph}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className={cn("px-4 md:px-6 lg:px-3m pt-10 md:pt-16 lg:pt-3l pb-0", className)}>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
        {/* Heading */}
        <div className="lg:w-1/2">
          <h2 className="font-sabon text-h2 text-off-white-100 max-w-[544px]">
            {heading}
          </h2>
        </div>

        {/* Content */}
        <div className="lg:w-[715px] lg:ml-auto">
          {paragraph && (
            <p className="font-sabon text-body-s text-off-white-100 leading-relaxed max-w-[433px] mb-6 lg:mb-3s">
              {paragraph}
            </p>
          )}

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
                "w-fit mb-8 lg:mb-3m"
              )}
            >
              {buttonText}
            </Link>
          )}

          {showLocationHours && (
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-m max-w-[433px] mt-8 lg:mt-3m">
              {/* Location */}
              <div className="w-full sm:w-[186px]">
                <div className="flex items-center gap-xxs mb-3xs">
                  <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                    01.
                  </span>
                  <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                    location
                  </span>
                </div>
                <div className="font-sabon text-body-s text-off-white-100 leading-relaxed tracking-tight-body">
                  <p>280 NW 27th St, Miami, FL 33127, United States</p>
                  <p>+1-877-666-2312</p>
                </div>
              </div>

              {/* Hours */}
              <div className="w-full sm:w-[186px]">
                <div className="flex items-center gap-xxs mb-3xs">
                  <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                    02.
                  </span>
                  <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                    hours
                  </span>
                </div>
                <div className="font-sabon text-body-s text-off-white-100 leading-relaxed tracking-tight-body">
                  <p>Tue-Fri 11 AM — 10 PM</p>
                  <p>Sat-Sun 12 PM — 10 PM</p>
                  <p>Mon (Closed)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
