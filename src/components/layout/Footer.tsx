import { cn } from "@/lib/utils";
import { Input, Checkbox } from "@/components/ui";
import { Logo } from "./Logo";
import Image from "next/image";
import Link from "next/link";
import type { NavigationLink, HoursEntry } from "@/lib/content";

interface FooterProps {
  className?: string;
  location: {
    name: string;
    address: string;
    phone: string;
  };
  hours: HoursEntry[];
  wordmarkImage: string;
  wordmarkAlt: string;
  newsletterPlaceholder: string;
  newsletterConsentText: string;
  links: NavigationLink[];
  legalLinks: NavigationLink[];
}

export function Footer({
  className,
  location,
  hours,
  wordmarkImage,
  wordmarkAlt,
  newsletterPlaceholder,
  newsletterConsentText,
  links,
  legalLinks,
}: FooterProps) {
  // Parse address into lines for display
  const addressLines = location.address.split(", ");
  const addressPart1 = addressLines.slice(0, 2).join(", ");
  const addressPart2 = addressLines.slice(2).join(", ");

  return (
    <footer className={cn("bg-pink-500", className)}>
      <div className="max-w-[1440px] mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between p-4 md:p-6 lg:p-3m gap-8 lg:gap-0">
          {/* Address */}
          <div className="w-full lg:w-[229px]">
            <div
              className="font-gotham font-bold text-h5 uppercase tracking-wide-h5 text-black-900 leading-relaxed"
              data-cms-entry="global-settings"
              data-cms-field="location"
              data-cms-type="json"
              data-cms-label="Location"
            >
              <p>{location.name}</p>
              <p>{addressPart1},</p>
              <p>{addressPart2}</p>
            </div>
          </div>

          {/* Hours */}
          <div
            className="font-gotham font-bold text-h5 uppercase tracking-wide-h5 text-black-900 leading-relaxed"
            data-cms-entry="global-settings"
            data-cms-field="hours"
            data-cms-type="array"
            data-cms-label="Hours"
          >
            {hours.map((entry, index) => (
              <p key={index}>
                {entry.days} {entry.time}
              </p>
            ))}
          </div>

          {/* Links */}
          <div
            className="flex flex-col gap-[2px]"
            data-cms-entry="global-settings"
            data-cms-field="footer.links"
            data-cms-type="array"
            data-cms-label="Footer Links"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-gotham font-bold text-h5 uppercase tracking-wide-h5 text-black-900 leading-relaxed hover:underline transition-all duration-300 ease-out hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div className="w-full lg:w-[433px]">
            <form className="flex flex-col gap-3xs">
              <Input
                type="email"
                placeholder={newsletterPlaceholder}
                variant="dark"
                showArrow={true}
                data-cms-entry="global-settings"
                data-cms-field="footer.newsletterPlaceholder"
                data-cms-label="Newsletter Placeholder"
              />
              <Checkbox
                label={newsletterConsentText}
                variant="dark"
                data-cms-entry="global-settings"
                data-cms-field="footer.newsletterConsentText"
                data-cms-label="Newsletter Consent Text"
              />
            </form>
          </div>
        </div>

        {/* Logo Mark - 272px per Figma */}
        <div className="flex justify-center py-8 md:py-10 lg:py-3m">
          <Logo variant="dark" size="large" />
        </div>

        {/* Horizontal Wordmark - matches hero at 96px */}
        <div className="px-[30px] lg:px-3m pb-8 md:pb-10 lg:pb-3m">
          <div className="relative h-[40px] md:h-[70px] lg:h-[96px] w-full max-w-[1320px] mx-auto">
            <Image
              src={wordmarkImage}
              alt={wordmarkAlt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Legal Bar - Full Width */}
      <div className="bg-black-900 px-2s py-xs">
        <div
          className="flex flex-wrap items-center justify-center gap-xs"
          data-cms-entry="global-settings"
          data-cms-field="footer.legalLinks"
          data-cms-type="array"
          data-cms-label="Legal Links"
        >
          {legalLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 hover:underline transition-all duration-300 ease-out hover:text-pink-500"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
