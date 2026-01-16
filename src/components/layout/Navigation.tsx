"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui";
import { HamburgerIcon, CloseIcon } from "@/components/icons";
import { Logo } from "./Logo";
import Image from "next/image";
import Link from "next/link";

interface NavigationProps {
  className?: string;
}

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/private-events", label: "Private Events" },
  { href: "/programming", label: "Programming" },
  { href: "/about", label: "About" },
  { href: "/getting-here", label: "Getting Here" },
  { href: "/test-404", label: "404 (test only)", isTest: true },
];

export function Navigation({ className }: NavigationProps) {
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
          <span className="hidden md:inline font-gotham font-bold text-cta uppercase tracking-wide-cta">
            menu
          </span>
        </button>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Logo variant="light" size="medium" />
        </div>

        {/* Reserve Button */}
        <div className="absolute right-4 md:right-5 top-4 md:top-5">
          <Button variant="filled" className="text-[10px] md:text-cta px-3 md:px-s">Reserve a Table</Button>
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
          <div className="absolute right-0 top-0 w-[720px] h-[840px] hidden lg:block">
            <Image
              src="https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/nomad/hero/nav-background.jpg"
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
            <span className="hidden md:inline font-gotham font-bold text-cta uppercase tracking-wide-cta">
              Close
            </span>
          </button>

          {/* Reserve Button */}
          <div className="absolute right-4 md:right-5 top-4 md:top-5 z-10">
            <Button variant="filled" className="text-[10px] md:text-cta px-3 md:px-s">Reserve a Table</Button>
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
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "leading-[1.2] tracking-tight-h2",
                      "text-off-white-100 hover:text-pink-500 hover:italic",
                      "transition-all duration-200",
                      link.isTest
                        ? "font-gotham text-[12px] md:text-[14px] opacity-60"
                        : "font-sabon text-[28px] md:text-[32px] lg:text-[36px]"
                    )}
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
                  <p>280 NW 27th St, Miami, FL 33127, United States</p>
                  <p>+1-877-666-2312</p>
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
                <div className="font-sabon text-body-s text-off-white-100 leading-relaxed tracking-tight-body">
                  <p>Tue-Fri 11 AM — 10 PM</p>
                  <p>Sat-Sun 12 PM — 10 PM</p>
                  <p>Mon (Closed)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
