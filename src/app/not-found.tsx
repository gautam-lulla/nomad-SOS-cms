import { getPageContent, getHeroSection } from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';

export const dynamic = 'force-dynamic';

export default async function NotFound() {
  const page = await getPageContent('404');
  const hero = page?.heroSlug ? await getHeroSection(page.heroSlug) : null;

  if (!hero) {
    // Fallback if CMS content not available
    return (
      <section className="relative h-[600px] bg-ink-900 flex items-center justify-center px-[60px]">
        <div className="max-w-[800px] text-center">
          <h1 className="font-sabon text-[48px] leading-[1.2] tracking-[-1px] text-off-white">
            Page Not Found
          </h1>
          <p className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white mt-6">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <div className="mt-8">
            <a
              href="/"
              className="inline-flex items-center justify-center font-gotham font-bold text-xs uppercase tracking-[0.36px] px-[18px] pt-[12px] pb-[14px] border border-off-white text-off-white hover:bg-off-white hover:text-ink-900 transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <HeroSection
      entry={page?.heroSlug || 'hero-404'}
      variant={hero.variant as 'split-screen' | 'full-screen' | 'gallery' | 'text-only'}
      headline={hero.headline}
      subtitle={hero.subtitle}
      bodyText={hero.bodyText}
      ctaText={hero.ctaText}
      ctaUrl={hero.ctaUrl}
      ctaAriaLabel={hero.ctaAriaLabel}
      textAlignment={hero.textAlignment as 'left' | 'center' | 'right'}
    />
  );
}
