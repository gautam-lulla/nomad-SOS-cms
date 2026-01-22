import { getPageContent, getHeroSection, getInstagramFeed, getGallery, getAllFaqItems } from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { Gallery } from '@/components/sections/Gallery';
import { EventInquiryForm } from '@/components/sections/EventInquiryForm';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { InstagramFeed } from '@/components/sections/InstagramFeed';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('private-events');
  return {
    title: page?.metaTitle || 'Private Events',
    description: page?.metaDescription,
  };
}

export default async function PrivateEventsPage() {
  const page = await getPageContent('private-events');
  if (!page) {
    return <div>Page not found</div>;
  }

  const hero = page.heroSlug ? await getHeroSection(page.heroSlug) : null;
  const gallery = await getGallery('private-events-gallery');
  const faqs = await getAllFaqItems();
  const instagram = page.showInstagram ? await getInstagramFeed() : null;

  // Filter FAQs by private-events category if applicable
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

      {/* Gallery Section */}
      {gallery && gallery.images.length > 0 && (
        <Gallery
          entry="private-events-gallery"
          sectionLabel={gallery.sectionLabel}
          images={gallery.images}
          variant="grid-3"
        />
      )}

      {/* Event Inquiry Form */}
      <EventInquiryForm
        entry="private-events-form"
        sectionLabel="Inquiries"
        heading="Tell us about your event"
        description="Complete the form below and our events team will get back to you within 24 hours to discuss your private event."
      />

      {/* FAQ Section */}
      {filteredFaqs.length > 0 && (
        <FaqAccordion
          entry="private-events"
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
