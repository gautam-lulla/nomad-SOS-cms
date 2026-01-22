import Image from 'next/image';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  entry: string;
  variant: 'split-screen' | 'full-screen' | 'gallery' | 'text-only';
  headline?: string;
  subtitle?: string;
  bodyText?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  backgroundVideo?: string;
  leftImage?: string;
  leftImageAlt?: string;
  rightImage?: string;
  rightImageAlt?: string;
  galleryImages?: Array<{ src: string; alt: string }>;
  logoImage?: string;
  logoImageAlt?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaAriaLabel?: string;
  textAlignment?: 'left' | 'center' | 'right';
  overlayOpacity?: number;
}

export function HeroSection({
  entry,
  variant,
  headline,
  subtitle,
  bodyText,
  backgroundImage,
  backgroundImageAlt,
  backgroundVideo,
  leftImage,
  leftImageAlt,
  rightImage,
  rightImageAlt,
  galleryImages,
  logoImage,
  logoImageAlt,
  ctaText,
  ctaUrl,
  ctaAriaLabel,
  textAlignment = 'center',
  overlayOpacity = 0,
}: HeroSectionProps) {
  // Split-screen hero (homepage style)
  if (variant === 'split-screen') {
    return (
      <section className="relative h-[840px] overflow-hidden">
        {/* Left Image */}
        {leftImage && (
          <div className="absolute left-0 top-0 w-1/2 h-full">
            <div
              className="relative w-full h-full"
              data-cms-entry={entry}
              data-cms-field="leftImage"
              data-cms-type="image"
            >
              <Image
                src={leftImage}
                alt={leftImageAlt || ''}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Right Image */}
        {rightImage && (
          <div className="absolute right-0 top-0 w-1/2 h-full">
            <div
              className="relative w-full h-full"
              data-cms-entry={entry}
              data-cms-field="rightImage"
              data-cms-type="image"
            >
              <Image
                src={rightImage}
                alt={rightImageAlt || ''}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Gradients */}
        <div className="absolute bottom-0 left-0 right-0 h-[480px] bg-gradient-to-t from-ink-900 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[480px] bg-gradient-to-b from-ink-900 to-transparent pointer-events-none" />

        {/* Logo/Wordmark at bottom */}
        {logoImage && (
          <div className="absolute bottom-[60px] left-[60px] right-[60px]">
            <div
              className="w-full h-[96px] relative"
              data-cms-entry={entry}
              data-cms-field="logoImage"
              data-cms-type="image"
            >
              <Image
                src={logoImage}
                alt={logoImageAlt || ''}
                fill
                className="object-contain object-left"
              />
            </div>
          </div>
        )}
      </section>
    );
  }

  // Full-screen hero with background image/video
  if (variant === 'full-screen') {
    return (
      <section className="relative h-[840px] overflow-hidden">
        {/* Background */}
        {backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            data-cms-entry={entry}
            data-cms-field="backgroundVideo"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <div
            className="absolute inset-0"
            data-cms-entry={entry}
            data-cms-field="backgroundImage"
            data-cms-type="image"
          >
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt || ''}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        {/* Overlay */}
        {overlayOpacity > 0 && (
          <div
            className="absolute inset-0 bg-ink-900"
            style={{ opacity: overlayOpacity / 100 }}
          />
        )}

        {/* Content */}
        <div
          className={`relative h-full flex flex-col justify-center px-[60px] ${
            textAlignment === 'center'
              ? 'items-center text-center'
              : textAlignment === 'right'
              ? 'items-end text-right'
              : 'items-start text-left'
          }`}
        >
          {headline && (
            <h1
              className="font-sabon text-[36px] leading-[1.3] tracking-[-0.72px] text-off-white max-w-[544px]"
              data-cms-entry={entry}
              data-cms-field="headline"
            >
              {headline}
            </h1>
          )}
          {subtitle && (
            <p
              className="font-sabon text-[24px] leading-[1.3] tracking-[-0.48px] text-off-white mt-4"
              data-cms-entry={entry}
              data-cms-field="subtitle"
            >
              {subtitle}
            </p>
          )}
          {bodyText && (
            <p
              className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white mt-6 max-w-[433px]"
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
                variant="outline"
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

  // Gallery hero with multiple images
  if (variant === 'gallery') {
    return (
      <section
        className="relative h-[700px] overflow-hidden"
        data-cms-entry={entry}
        data-cms-field="galleryImages"
        data-cms-type="array"
      >
        <div className="flex h-full">
          {galleryImages?.slice(0, 3).map((image, index) => (
            <div key={index} className="flex-1 relative">
              <div
                data-cms-entry={entry}
                data-cms-field={`galleryImage${index + 1}`}
                data-cms-type="image"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Text-only hero
  return (
    <section className="relative h-[600px] bg-ink-900 flex items-center justify-center px-[60px]">
      <div
        className={`max-w-[800px] ${
          textAlignment === 'center'
            ? 'text-center'
            : textAlignment === 'right'
            ? 'text-right'
            : 'text-left'
        }`}
      >
        {headline && (
          <h1
            className="font-sabon text-[48px] leading-[1.2] tracking-[-1px] text-off-white"
            data-cms-entry={entry}
            data-cms-field="headline"
          >
            {headline}
          </h1>
        )}
        {subtitle && (
          <p
            className="font-sabon text-[24px] leading-[1.3] tracking-[-0.48px] text-off-white mt-4"
            data-cms-entry={entry}
            data-cms-field="subtitle"
          >
            {subtitle}
          </p>
        )}
        {ctaText && ctaUrl && (
          <div className="mt-8">
            <Button
              href={ctaUrl}
              variant="outline"
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
