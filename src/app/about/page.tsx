import { getPageContent, getHeroSection, getContentSection, getInstagramFeed, getAllFaqItems, getAllAwards } from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { InstagramFeed } from '@/components/sections/InstagramFeed';
import { TeamSection } from '@/components/sections/TeamSection';
import { AwardsGrid } from '@/components/sections/AwardCard';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('about');
  return {
    title: page?.metaTitle || 'About',
    description: page?.metaDescription,
  };
}

export default async function AboutPage() {
  const page = await getPageContent('about');
  if (!page) {
    return <div>Page not found</div>;
  }

  const hero = page.heroSlug ? await getHeroSection(page.heroSlug) : null;
  const instagram = page.showInstagram ? await getInstagramFeed() : null;

  // Fetch content sections
  const sections = await Promise.all(
    (page.sections || []).map(async (section) => {
      if (section.type === 'content-section') {
        return { type: 'content-section', slug: section.slug, data: await getContentSection(section.slug) };
      }
      return null;
    })
  );

  // Fetch FAQ items (filter by category if specified)
  const allFaqItems = page.showFaq ? await getAllFaqItems() : [];
  const faqItems = page.faqCategory
    ? allFaqItems.filter(item => item.category === page.faqCategory)
    : allFaqItems;

  // Fetch awards
  const awards = page.showAwards ? await getAllAwards() : [];
  const sortedAwards = [...awards].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));


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

      {/* Content Sections */}
      {sections.map((section, index) => {
        if (!section || !section.data) return null;

        if (section.type === 'content-section') {
          const data = section.data;
          return (
            <ContentSection
              key={index}
              entry={section.slug}
              variant={data.variant as 'image-left' | 'image-right' | 'text-only' | 'full-width-image'}
              heading={data.heading}
              subheading={data.subheading}
              bodyText={data.bodyText}
              image={data.image}
              imageAlt={data.imageAlt}
              ctaText={data.ctaText}
              ctaUrl={data.ctaUrl}
              ctaAriaLabel={data.ctaAriaLabel}
              backgroundColor={data.backgroundColor as 'dark' | 'light' | 'pink'}
            />
          );
        }

        return null;
      })}

      {/* Team Section */}
      {page.showTeam && page.teamMembers && page.teamMembers.length > 0 && (
        <TeamSection
          entry="about"
          heading={page.teamHeading}
          subheading={page.teamSubheading}
          members={page.teamMembers}
        />
      )}

      {/* Awards Section */}
      {page.showAwards && sortedAwards.length > 0 && (
        <AwardsGrid
          entry="about"
          heading={page.awardsHeading || 'Awards & Recognitions'}
          awards={sortedAwards}
        />
      )}

      {/* FAQ Section */}
      {page.showFaq && faqItems.length > 0 && (
        <FaqAccordion
          entry="about"
          heading={page.faqHeading || 'Frequently Asked Questions'}
          items={faqItems}
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
