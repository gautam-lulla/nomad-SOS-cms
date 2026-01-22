import { getPageContent, getHeroSection, getAllFaqItems, getInstagramFeed } from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { InstagramFeed } from '@/components/sections/InstagramFeed';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('faq');
  return {
    title: page?.metaTitle || 'FAQ',
    description: page?.metaDescription,
  };
}

export default async function FaqPage() {
  const page = await getPageContent('faq');
  if (!page) {
    return <div>Page not found</div>;
  }

  const hero = page.heroSlug ? await getHeroSection(page.heroSlug) : null;
  const faqItems = await getAllFaqItems();
  const instagram = page.showInstagram !== false ? await getInstagramFeed() : null;

  // Sort by sortOrder
  const sortedFaqs = [...faqItems].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return (
    <>
      {/* Hero Section */}
      {hero && (
        <HeroSection
          entry={page.heroSlug!}
          variant={hero.variant as 'split-screen' | 'full-screen' | 'gallery' | 'text-only'}
          headline={hero.headline}
          subtitle={hero.subtitle}
          bodyText={hero.bodyText}
          backgroundImage={hero.backgroundImage}
          backgroundImageAlt={hero.backgroundImageAlt}
          galleryImages={hero.galleryImages}
          ctaText={hero.ctaText}
          ctaUrl={hero.ctaUrl}
          ctaAriaLabel={hero.ctaAriaLabel}
          textAlignment={hero.textAlignment as 'left' | 'center' | 'right'}
        />
      )}

      {/* FAQ Accordion */}
      {sortedFaqs.length > 0 && (
        <FaqAccordion
          entry="faq"
          items={sortedFaqs}
          filterCategory={page.faqCategory}
        />
      )}

      {/* Instagram Feed */}
      {instagram && (
        <InstagramFeed
          entry="global-instagram"
          title={instagram.title}
          handle={instagram.handle}
          profileUrl={instagram.profileUrl}
          sectionLabel={instagram.sectionLabel}
          images={instagram.images}
        />
      )}
    </>
  );
}
