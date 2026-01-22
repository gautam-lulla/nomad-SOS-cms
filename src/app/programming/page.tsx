import { getPageContent, getHeroSection, getAllEvents, getAllFaqItems, getInstagramFeed } from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { EventsList } from '@/components/sections/EventsList';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { InstagramFeed } from '@/components/sections/InstagramFeed';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('programming');
  return {
    title: page?.metaTitle || 'Programming',
    description: page?.metaDescription,
  };
}

export default async function ProgrammingPage() {
  const page = await getPageContent('programming');
  if (!page) {
    return <div>Page not found</div>;
  }

  const hero = page.heroSlug ? await getHeroSection(page.heroSlug) : null;
  const events = await getAllEvents();
  const faqs = page.showFaq !== false ? await getAllFaqItems() : [];
  const instagram = page.showInstagram ? await getInstagramFeed() : null;

  // Filter FAQs by programming category if specified
  const filteredFaqs = page.faqCategory
    ? faqs.filter((faq) => faq.category === page.faqCategory)
    : faqs;

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
          ctaText={hero.ctaText}
          ctaUrl={hero.ctaUrl}
          ctaAriaLabel={hero.ctaAriaLabel}
          textAlignment={hero.textAlignment as 'left' | 'center' | 'right'}
          overlayOpacity={hero.overlayOpacity}
        />
      )}

      {/* Events List with pagination - shows 6 events per page */}
      {events.length > 0 && (
        <EventsList
          entry="programming"
          sectionLabel={page.eventsSectionLabel}
          events={events}
          variant="grid"
          limit={6}
          showPagination={true}
        />
      )}

      {/* FAQ Section */}
      {filteredFaqs.length > 0 && (
        <FaqAccordion
          entry="programming"
          sectionLabel="Questions"
          heading={page.faqHeading || 'Frequently Asked Questions'}
          items={filteredFaqs}
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
