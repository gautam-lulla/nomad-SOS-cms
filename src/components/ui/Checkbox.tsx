'use client';

import { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  // CMS data attributes
  'data-cms-entry'?: string;
  'data-cms-field'?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkboxId = id || props.name || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <label
        htmlFor={checkboxId}
        className={`flex items-center gap-3 cursor-pointer group ${className}`}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 border border-off-white/30 peer-checked:border-pink-400 peer-checked:bg-pink-400 transition-all duration-200 flex items-center justify-center">
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              className="text-ink-900 opacity-0 peer-checked:opacity-100 transition-opacity"
            >
              <path
                d="M1 5L4.5 8.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <span className="font-sabon text-base text-off-white group-hover:text-pink-400 transition-colors">
          {label}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
