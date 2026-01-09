import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

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
      <section className={cn("max-w-[454px] mx-auto text-center px-6", className)}>
        <h2 className="font-sabon text-h2 text-off-white-100 mb-3s">
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
    <section className={cn("px-3m pt-3l pb-0", className)}>
      <div className="flex flex-col lg:flex-row gap-3s lg:gap-0">
        {/* Heading */}
        <div className="lg:w-1/2">
          <h2 className="font-sabon text-h2 text-off-white-100 max-w-[544px]">
            {heading}
          </h2>
        </div>

        {/* Content */}
        <div className="lg:w-[715px] lg:ml-auto">
          {paragraph && (
            <p className="font-sabon text-body-s text-off-white-100 leading-relaxed max-w-[433px] mb-3s">
              {paragraph}
            </p>
          )}

          {buttonText && (
            <Button
              variant="outline"
              onClick={() => buttonHref && (window.location.href = buttonHref)}
              className="mb-3m"
            >
              {buttonText}
            </Button>
          )}

          {showLocationHours && (
            <div className="flex gap-m max-w-[433px] mt-3m">
              {/* Location */}
              <div className="w-[186px]">
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
              <div className="w-[186px]">
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
