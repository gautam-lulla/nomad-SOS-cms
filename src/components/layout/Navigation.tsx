"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui";
import { HamburgerIcon, CloseIcon } from "@/components/icons";
import { Logo } from "./Logo";
import Image from "next/image";
import Link from "next/link";
import type { NavigationLink, HoursEntry } from "@/lib/content";

interface NavigationProps {
  className?: string;
  links: NavigationLink[];
  location: {
    name: string;
    address: string;
    phone: string;
  };
  hours: HoursEntry[];
  menuLabel: string;
  closeLabel: string;
  reserveButtonText: string;
  reserveButtonUrl: string;
  backgroundImage: string;
}

export function Navigation({
  className,
  links,
  location,
  hours,
  menuLabel,
  closeLabel,
  reserveButtonText,
  reserveButtonUrl,
  backgroundImage,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Main Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[80px] md:h-[100px] lg:h-[110px]",
          "flex items-center justify-between",
          className
        )}
      >
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
          aria-label="Open navigation menu"
          className="absolute left-4 md:left-5 top-[24px] md:top-[30px] lg:top-[34px] flex items-center gap-2 md:gap-4 text-off-white-100 cursor-pointer"
        >
          <HamburgerIcon aria-hidden={true} />
          <span
            className="hidden md:inline font-gotham font-bold text-cta uppercase tracking-wide-cta"
            data-cms-entry="global-settings"
            data-cms-field="navigation.menuLabel"
            data-cms-label="Menu Label"
          >
            {menuLabel}
          </span>
        </button>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Logo variant="light" size="medium" />
        </div>

        {/* Reserve Button */}
        <div className="absolute right-4 md:right-5 top-4 md:top-5">
          <Button
            variant="filled"
            className="text-[10px] md:text-cta px-3 md:px-s"
            {...(reserveButtonUrl && reserveButtonUrl !== "#" ? { as: "a", href: reserveButtonUrl } : {})}
          >
            <span
              data-cms-entry="global-settings"
              data-cms-field="navigation.reserveButtonText"
              data-cms-label="Reserve Button Text"
            >
              {reserveButtonText}
            </span>
          </Button>
        </div>
      </header>

      {/* Expanded Menu Overlay */}
      {isMenuOpen && (
        <div
          id="main-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-[100] bg-black-900"
        >
          {/* Background Image */}
          <div
            className="absolute right-0 top-0 w-[720px] h-[840px] hidden lg:block"
            data-cms-entry="global-settings"
            data-cms-field="navigation.backgroundImage"
            data-cms-type="image"
            data-cms-label="Navigation Background Image"
          >
            <Image
              src={backgroundImage}
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* Close Button */}
          <button
            onClick={closeMenu}
            aria-label="Close navigation menu"
            className="absolute left-4 md:left-5 top-6 md:top-7 flex items-center gap-2 md:gap-2.5 text-off-white-100 cursor-pointer z-10"
          >
            <CloseIcon aria-hidden={true} />
            <span
              className="hidden md:inline font-gotham font-bold text-cta uppercase tracking-wide-cta"
              data-cms-entry="global-settings"
              data-cms-field="navigation.closeLabel"
              data-cms-label="Close Label"
            >
              {closeLabel}
            </span>
          </button>

          {/* Reserve Button */}
          <div className="absolute right-4 md:right-5 top-4 md:top-5 z-10">
            <Button
              variant="filled"
              className="text-[10px] md:text-cta px-3 md:px-s"
              {...(reserveButtonUrl && reserveButtonUrl !== "#" ? { as: "a", href: reserveButtonUrl } : {})}
            >
              <span
                data-cms-entry="global-settings"
                data-cms-field="navigation.reserveButtonText"
                data-cms-label="Reserve Button Text"
              >
                {reserveButtonText}
              </span>
            </Button>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10">
            <Logo variant="light" size="medium" />
          </div>

          {/* Menu Links */}
          <nav
            aria-label="Main navigation"
            className="absolute left-4 md:left-[60px] top-[120px] md:top-[160px] lg:top-[190px]"
          >
            <ul className="space-y-[3px]" role="list">
              {links.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "leading-[1.2] tracking-tight-h2",
                      "text-off-white-100 hover:text-pink-500 hover:italic",
                      "transition-all duration-200",
                      "font-sabon text-[28px] md:text-[32px] lg:text-[36px]"
                    )}
                    data-cms-entry="global-settings"
                    data-cms-field={`navigation.links[${index}].label`}
                    data-cms-type="text"
                    data-cms-label={`Nav Link ${index + 1}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Location Info */}
          <div className="absolute left-4 md:left-[60px] bottom-[80px] md:bottom-[120px] lg:bottom-[178px]">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-[60px]">
              {/* Location */}
              <div className="w-full sm:w-[187px]">
                <div className="flex items-center gap-2.5 mb-3xs">
                  <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                    01.
                  </span>
                  <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                    location
                  </span>
                </div>
                <div className="font-sabon text-body-s text-off-white-100 leading-relaxed tracking-tight-body">
                  <p
                    data-cms-entry="global-settings"
                    data-cms-field="location.address"
                    data-cms-label="Address"
                  >
                    {location.address}
                  </p>
                  <p
                    data-cms-entry="global-settings"
                    data-cms-field="location.phone"
                    data-cms-label="Phone"
                  >
                    {location.phone}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="w-full sm:w-[187px]">
                <div className="flex items-center gap-2.5 mb-3xs">
                  <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                    02.
                  </span>
                  <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                    hours
                  </span>
                </div>
                <div
                  className="font-sabon text-body-s text-off-white-100 leading-relaxed tracking-tight-body"
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
