import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getPageContent,
  getHeroSection,
  getContentSection,
  getInstagramFeed,
  getAllFaqItems,
  getAllAwards,
} from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { InstagramFeed } from '@/components/sections/InstagramFeed';
import { TeamSection } from '@/components/sections/TeamSection';
import { AwardsGrid } from '@/components/sections/AwardCard';
import { FaqAccordion } from '@/components/sections/FaqAccordion';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string[] }>;
}

// Static file extensions that should not be handled by CMS
const STATIC_FILE_EXTENSIONS = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.css', '.js', '.map', '.json', '.xml', '.txt'];

function isStaticFile(slug: string): boolean {
  return STATIC_FILE_EXTENSIONS.some(ext => slug.endsWith(ext));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug.join('/');

  // Don't try to fetch metadata for static files
  if (isStaticFile(pageSlug)) {
    return { title: 'Not Found' };
  }

  const page = await getPageContent(pageSlug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const pageSlug = slug.join('/');

  // Don't handle static file requests - let them 404 naturally
  if (isStaticFile(pageSlug)) {
    notFound();
  }

  // Fetch page content from CMS
  const page = await getPageContent(pageSlug);

  if (!page) {
    notFound();
  }

  // Fetch hero section if specified
  const hero = page.heroSlug ? await getHeroSection(page.heroSlug) : null;

  // Fetch instagram feed if enabled
  const instagram = page.showInstagram ? await getInstagramFeed() : null;

  // Fetch content sections
  const sections = await Promise.all(
    (page.sections || []).map(async (section) => {
      if (section.type === 'content-section') {
        return {
          type: 'content-section',
          slug: section.slug,
          data: await getContentSection(section.slug),
        };
      }
      return null;
    })
  );

  // Fetch FAQ items (filter by category if specified)
  const allFaqItems = page.showFaq ? await getAllFaqItems() : [];
  const faqItems = page.faqCategory
    ? allFaqItems.filter((item) => item.category === page.faqCategory)
    : allFaqItems;

  // Fetch awards
  const awards = page.showAwards ? await getAllAwards() : [];
  const sortedAwards = [...awards].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return (
    <>
      {/* Hero Section */}
      {hero && (
        <HeroSection
          entry={page.heroSlug!}
          variant={
            hero.variant as
              | 'split-screen'
              | 'full-screen'
              | 'gallery'
              | 'text-only'
          }
          headline={hero.headline}
          subtitle={hero.subtitle}
          bodyText={hero.bodyText}
          backgroundImage={hero.backgroundImage}
          backgroundImageAlt={hero.backgroundImageAlt}
          leftImage={hero.leftImage}
          leftImageAlt={hero.leftImageAlt}
          rightImage={hero.rightImage}
          rightImageAlt={hero.rightImageAlt}
          logoImage={hero.logoImage}
          logoImageAlt={hero.logoImageAlt}
          galleryImages={hero.galleryImages}
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
              variant={
                data.variant as
                  | 'image-left'
                  | 'image-right'
                  | 'text-only'
                  | 'full-width-image'
              }
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
          entry={pageSlug}
          heading={page.teamHeading}
          subheading={page.teamSubheading}
          members={page.teamMembers}
        />
      )}

      {/* Awards Section */}
      {page.showAwards && sortedAwards.length > 0 && (
        <AwardsGrid
          entry={pageSlug}
          heading={page.awardsHeading || 'Awards & Recognitions'}
          awards={sortedAwards}
        />
      )}

      {/* FAQ Section */}
      {page.showFaq && faqItems.length > 0 && (
        <FaqAccordion
          entry={pageSlug}
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
