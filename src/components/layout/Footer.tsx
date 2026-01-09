import { cn } from "@/lib/utils";
import { Input, Checkbox } from "@/components/ui";
import { Logo, LogoHorizontal } from "./Logo";
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
        <div className="flex flex-col lg:flex-row items-start justify-between p-3m gap-3m lg:gap-0">
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
              />
              <Checkbox
                label="I agree to the Privacy Policy"
                variant="dark"
              />
            </form>
          </div>
        </div>

        {/* Logo Mark */}
        <div className="flex justify-center py-3m">
          <Logo variant="dark" size="large" />
        </div>

        {/* Horizontal Wordmark */}
        <div className="px-3m pb-0">
          <LogoHorizontal className="max-w-[1320px] mx-auto" />
        </div>

        {/* Legal Bar */}
        <div className="bg-black-900 px-2s py-xs mt-0">
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
      </div>
    </footer>
  );
}
