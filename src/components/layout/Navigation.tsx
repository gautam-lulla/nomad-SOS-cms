"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
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
];

export function Navigation({ className }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Main Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[110px]",
          "flex items-center justify-between",
          className
        )}
      >
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="absolute left-5 top-[34px] flex items-center gap-4 text-off-white-100 cursor-pointer"
        >
          <HamburgerIcon />
          <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta">
            menu
          </span>
        </button>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Logo variant="light" size="medium" />
        </div>

        {/* Reserve Button */}
        <div className="absolute right-5 top-5">
          <Button variant="filled">Reserve a Table</Button>
        </div>
      </header>

      {/* Expanded Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black-900">
          {/* Background Image */}
          <div className="absolute right-0 top-0 w-[720px] h-[840px] hidden lg:block">
            <Image
              src="/images/hero/nav-background.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute left-5 top-7 flex items-center gap-2.5 text-off-white-100 cursor-pointer z-10"
          >
            <CloseIcon />
            <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta">
              Close
            </span>
          </button>

          {/* Reserve Button */}
          <div className="absolute right-5 top-5 z-10">
            <Button variant="filled">Reserve a Table</Button>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10">
            <Logo variant="light" size="medium" />
          </div>

          {/* Menu Links */}
          <nav className="absolute left-[60px] top-[190px]">
            <ul className="space-y-[3px]">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "font-sabon text-[36px] leading-[1.2] tracking-tight-h2",
                      "text-off-white-100 hover:text-pink-500 hover:italic",
                      "transition-all duration-200"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Location Info */}
          <div className="absolute left-[60px] bottom-[178px]">
            <div className="flex gap-[60px]">
              {/* Location */}
              <div className="w-[187px]">
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
              <div className="w-[187px]">
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
