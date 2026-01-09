import { cn } from "@/lib/utils";
import { Input, Checkbox } from "@/components/ui";
import { Logo } from "./Logo";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

const footerLinks = [
  { href: "/gift-cards", label: "Gift Cards" },
  { href: "/contact", label: "Contact us" },
  { href: "/faq", label: "FAQ" },
];

const legalLinks = [
  { href: "#", label: "Copyright © 2025" },
  { href: "/accessibility", label: "accessibility" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/careers", label: "careers" },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-pink-500", className)}>
      <div className="max-w-[1440px] mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between p-4 md:p-6 lg:p-3m gap-8 lg:gap-0">
          {/* Address */}
          <div className="w-full lg:w-[229px]">
            <div className="font-gotham font-bold text-h5 uppercase tracking-wide-h5 text-black-900 leading-relaxed">
              <p>the nomad bar</p>
              <p>280 NW 27th St, Miami,</p>
              <p>FL 33127, United States</p>
            </div>
          </div>

          {/* Hours */}
          <div className="font-gotham font-bold text-h5 uppercase tracking-wide-h5 text-black-900 leading-relaxed">
            <p>Tue-Fri 11 AM — 10 PM</p>
            <p>Sat-Sun 12 PM — 10 PM</p>
            <p>Mon (Closed)</p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-[2px]">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-gotham font-bold text-h5 uppercase tracking-wide-h5 text-black-900 leading-relaxed hover:underline"
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
                placeholder="Please enter your email"
                variant="dark"
                showArrow={true}
              />
              <Checkbox
                label="I agree to the Privacy Policy"
                variant="dark"
              />
            </form>
          </div>
        </div>

        {/* Logo Mark - 272px per Figma */}
        <div className="flex justify-center py-8 md:py-10 lg:py-3m">
          <Logo variant="dark" size="large" />
        </div>

        {/* Horizontal Wordmark - matches hero at 96px */}
        <div className="px-4 md:px-6 lg:px-3m pb-8 md:pb-10 lg:pb-3m">
          <div className="relative h-[40px] md:h-[70px] lg:h-[96px] w-full max-w-[1320px] mx-auto">
            <Image
              src="/images/nomad-wynwood-wordmark-footer.svg"
              alt="The NoMad Bar"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Legal Bar - Full Width */}
      <div className="bg-black-900 px-2s py-xs">
        <div className="flex flex-wrap items-center justify-center gap-xs">
          {legalLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
