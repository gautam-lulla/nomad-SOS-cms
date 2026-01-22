import Image from 'next/image';
import { Button } from '../ui/Button';

interface ContentSectionProps {
  entry: string;
  variant: 'image-left' | 'image-right' | 'text-only' | 'full-width-image';
  heading?: string;
  subheading?: string;
  bodyText?: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaAriaLabel?: string;
  backgroundColor?: 'dark' | 'light' | 'pink';
}

export function ContentSection({
  entry,
  variant,
  heading,
  subheading,
  bodyText,
  image,
  imageAlt,
  ctaText,
  ctaUrl,
  ctaAriaLabel,
  backgroundColor = 'dark',
}: ContentSectionProps) {
  const bgColors = {
    dark: 'bg-ink-900',
    light: 'bg-off-white',
    pink: 'bg-pink-400',
  };

  const textColors = {
    dark: 'text-off-white',
    light: 'text-ink-900',
    pink: 'text-ink-900',
  };

  const bgClass = bgColors[backgroundColor];
  const textClass = textColors[backgroundColor];

  // Full-width image variant
  if (variant === 'full-width-image') {
    return (
      <section className={`relative h-[700px] overflow-hidden ${bgClass}`}>
        {image && (
          <div
            className="absolute inset-0"
            data-cms-entry={entry}
            data-cms-field="image"
            data-cms-type="image"
          >
            <Image
              src={image}
              alt={imageAlt || ''}
              fill
              className="object-cover"
            />
          </div>
        )}
        {(heading || bodyText) && (
          <div className="relative h-full flex flex-col justify-end p-[60px]">
            <div className="max-w-[544px]">
              {heading && (
                <h2
                  className={`font-sabon text-[36px] leading-[1.3] tracking-[-0.72px] ${textClass}`}
                  data-cms-entry={entry}
                  data-cms-field="heading"
                >
                  {heading}
                </h2>
              )}
              {bodyText && (
                <p
                  className={`font-sabon text-base leading-[1.6] tracking-[-0.32px] ${textClass} mt-4`}
                  data-cms-entry={entry}
                  data-cms-field="bodyText"
                >
                  {bodyText}
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }

  // Text-only variant
  if (variant === 'text-only') {
    return (
      <section className={`${bgClass} py-[120px] px-[60px]`}>
        <div className="max-w-[800px] mx-auto text-center">
          {subheading && (
            <span
              className={`font-gotham font-bold text-xs uppercase tracking-[0.36px] ${textClass} block mb-4`}
              data-cms-entry={entry}
              data-cms-field="subheading"
            >
              {subheading}
            </span>
          )}
          {heading && (
            <h2
              className={`font-sabon text-[36px] leading-[1.3] tracking-[-0.72px] ${textClass}`}
              data-cms-entry={entry}
              data-cms-field="heading"
            >
              {heading}
            </h2>
          )}
          {bodyText && (
            <p
              className={`font-sabon text-base leading-[1.6] tracking-[-0.32px] ${textClass} mt-6`}
              data-cms-entry={entry}
              data-cms-field="bodyText"
            >
              {bodyText}
            </p>
          )}
          {ctaText && ctaUrl && (
            <div className="mt-8">
              <Button
                href={ctaUrl}
                variant={backgroundColor === 'dark' ? 'outline' : 'secondary'}
                ariaLabel={ctaAriaLabel}
                data-cms-entry={entry}
                data-cms-field="ctaText"
              >
                {ctaText}
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Image-left or image-right variants (half-screen split)
  const isImageLeft = variant === 'image-left';

  return (
    <section className={`flex flex-col lg:flex-row min-h-[700px] ${bgClass}`}>
      {/* Image Side */}
      <div
        className={`relative w-full lg:w-1/2 h-[400px] lg:h-auto ${
          isImageLeft ? 'lg:order-1' : 'lg:order-2'
        }`}
      >
        {image && (
          <div
            className="absolute inset-0"
            data-cms-entry={entry}
            data-cms-field="image"
            data-cms-type="image"
          >
            <Image
              src={image}
              alt={imageAlt || ''}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Content Side */}
      <div
        className={`w-full lg:w-1/2 flex flex-col justify-center p-[60px] ${
          isImageLeft ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        <div className="max-w-[433px]">
          {subheading && (
            <span
              className={`font-gotham font-bold text-xs uppercase tracking-[0.36px] ${textClass} block mb-4`}
              data-cms-entry={entry}
              data-cms-field="subheading"
            >
              {subheading}
            </span>
          )}
          {heading && (
            <h2
              className={`font-sabon text-[36px] leading-[1.3] tracking-[-0.72px] ${textClass}`}
              data-cms-entry={entry}
              data-cms-field="heading"
            >
              {heading}
            </h2>
          )}
          {bodyText && (
            <p
              className={`font-sabon text-base leading-[1.6] tracking-[-0.32px] ${textClass} mt-6`}
              data-cms-entry={entry}
              data-cms-field="bodyText"
            >
              {bodyText}
            </p>
          )}
          {ctaText && ctaUrl && (
            <div className="mt-8">
              <Button
                href={ctaUrl}
                variant={backgroundColor === 'dark' ? 'outline' : 'secondary'}
                ariaLabel={ctaAriaLabel}
                data-cms-entry={entry}
                data-cms-field="ctaText"
              >
                {ctaText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
