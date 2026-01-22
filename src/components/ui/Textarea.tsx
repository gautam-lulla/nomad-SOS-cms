'use client';

import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  // CMS data attributes
  'data-cms-entry'?: string;
  'data-cms-field'?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, required, rows = 4, ...props }, ref) => {
    const textareaId = id || props.name || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white mb-2"
          >
            {label}
            {required && <span className="text-pink-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          rows={rows}
          className={`
            w-full
            bg-transparent
            border-b border-off-white/30
            py-3
            font-sabon text-base text-off-white
            placeholder:text-off-white/50
            focus:outline-none focus:border-pink-400
            transition-colors duration-200
            resize-none
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-2 font-gotham text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
