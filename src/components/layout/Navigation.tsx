'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/Button';

interface NavigationProps {
  logoUrl: string;
  logoAlt: string;
  menuLinks: Array<{
    label: string;
    href: string;
    isExternal?: boolean;
  }>;
  ctaText?: string;
  ctaUrl?: string;
  ctaAriaLabel?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  // Location info from settings
  address?: string;
  phone?: string;
  // Hours from settings
  hours?: Array<{
    days: string;
    open?: string | null;
    close?: string | null;
    closed?: boolean;
  }>;
  // UI labels (from CMS)
  menuButtonOpenLabel?: string;
  menuButtonCloseLabel?: string;
  locationSectionLabel?: string;
  hoursSectionLabel?: string;
  closedDayLabel?: string;
}

export function Navigation({
  logoUrl,
  logoAlt,
  menuLinks,
  ctaText,
  ctaUrl,
  ctaAriaLabel,
  backgroundImage,
  backgroundImageAlt,
  address,
  phone,
  hours,
  menuButtonOpenLabel,
  menuButtonCloseLabel,
  locationSectionLabel,
  hoursSectionLabel,
  closedDayLabel,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Fixed Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[110px]">
        <nav className="relative flex items-center justify-between h-full px-5 max-w-page mx-auto">
          {/* Hamburger / Close Button */}
          <button
            onClick={toggleMenu}
            className="flex items-center gap-3 p-0 cursor-pointer group"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              /* Close X Icon */
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-off-white"
              >
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              /* Hamburger Icon - 3 horizontal lines */
              <div className="w-[50px] h-[14px] flex flex-col justify-between">
                <span className="block w-full h-[2px] bg-off-white" />
                <span className="block w-full h-[2px] bg-off-white" />
                <span className="block w-full h-[2px] bg-off-white" />
              </div>
            )}
            <span
              className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white"
              data-cms-entry="global-navigation"
              data-cms-field={isMenuOpen ? 'menuButtonCloseLabel' : 'menuButtonOpenLabel'}
            >
              {isMenuOpen ? menuButtonCloseLabel : menuButtonOpenLabel}
            </span>
          </button>

          {/* Center Logo */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label="Home"
          >
            <div
              className="w-[110px] h-[110px] relative"
              data-cms-entry="global-settings"
              data-cms-field="logoUrl"
              data-cms-type="image"
            >
              <Image
                src={logoUrl || '/images/logos/nav-logo-emblem.svg'}
                alt={logoAlt}
                fill
                className="object-contain"
                priority
                unoptimized={logoUrl?.endsWith('.svg') || !logoUrl}
              />
            </div>
          </Link>

          {/* CTA Button */}
          {ctaText && ctaUrl && (
            <Button
              href={ctaUrl}
              variant="primary"
              ariaLabel={ctaAriaLabel}
              isExternal
              data-cms-entry="global-navigation"
              data-cms-field="ctaText"
            >
              {ctaText}
            </Button>
          )}
        </nav>
      </header>

      {/* Full-Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-ink-900 transition-transform duration-500 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMenuOpen}
      >
        {/* Background Image (right half on desktop, top half on mobile) */}
        <div className="absolute right-0 top-0 w-full h-[45%] lg:w-1/2 lg:h-full">
          {backgroundImage && (
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt || ''}
              fill
              className="object-cover"
              data-cms-entry="global-navigation"
              data-cms-field="backgroundImage"
              data-cms-type="image"
            />
          )}
          {/* Logo at bottom-left of image section */}
          <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]">
            <Image
              src={logoUrl || '/images/logos/nav-logo-emblem.svg'}
              alt={logoAlt}
              fill
              className="object-contain"
              unoptimized={logoUrl?.endsWith('.svg') || !logoUrl}
            />
          </div>
        </div>

        {/* Menu Content */}
        <div className="relative h-full pt-[50%] lg:pt-[190px] px-5 lg:px-[60px] lg:w-1/2">
          {/* Menu Links */}
          <nav className="space-y-2">
            {menuLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block font-sabon text-[36px] leading-[1.2] tracking-[-0.72px] text-off-white hover:text-pink-400 hover:italic transition-colors"
                data-cms-entry="global-navigation"
                data-cms-field={`menuLinks[${index}].label`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom Info */}
          <div className="absolute bottom-[178px] left-[60px] flex gap-[60px]">
            {/* Location */}
            {address && (
              <div className="w-[187px]">
                <div className="flex items-center gap-[10px] mb-3">
                  <span
                    className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white"
                    data-cms-entry="global-navigation"
                    data-cms-field="locationSectionLabel"
                  >
                    {locationSectionLabel}
                  </span>
                </div>
                <p
                  className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white whitespace-pre-line"
                  data-cms-entry="global-settings"
                  data-cms-field="address"
                >
                  {address}
                </p>
                {phone && (
                  <p
                    className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white"
                    data-cms-entry="global-settings"
                    data-cms-field="phone"
                  >
                    {phone}
                  </p>
                )}
              </div>
            )}

            {/* Hours */}
            {hours && hours.length > 0 && (
              <div className="w-[187px]">
                <div className="flex items-center gap-[10px] mb-3">
                  <span
                    className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white"
                    data-cms-entry="global-navigation"
                    data-cms-field="hoursSectionLabel"
                  >
                    {hoursSectionLabel}
                  </span>
                </div>
                <div
                  className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white"
                  data-cms-entry="global-settings"
                  data-cms-field="hours"
                >
                  {hours.map((h, i) => (
                    <p key={i}>
                      {h.closed
                        ? `${h.days} ${closedDayLabel ? `(${closedDayLabel})` : ''}`
                        : `${h.days} ${h.open} — ${h.close}`}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
