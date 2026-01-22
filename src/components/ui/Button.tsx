'use client';

import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  ariaLabel?: string;
  isExternal?: boolean;
  // CMS data attributes
  'data-cms-entry'?: string;
  'data-cms-field'?: string;
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  ariaLabel,
  isExternal = false,
  ...cmsProps
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-gotham font-bold text-xs uppercase tracking-[0.36px] px-[18px] pt-[12px] pb-[14px] transition-colors duration-200';

  const variants = {
    primary: 'bg-pink-400 text-ink-900 hover:bg-pink-300',
    secondary: 'bg-ink-900 text-off-white hover:bg-ink-800',
    outline: 'border border-off-white text-off-white hover:bg-off-white hover:text-ink-900',
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          className={buttonClass}
          aria-label={ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
          {...cmsProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={buttonClass} aria-label={ariaLabel} {...cmsProps}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      aria-label={ariaLabel}
      type="button"
      {...cmsProps}
    >
      {children}
    </button>
  );
}
