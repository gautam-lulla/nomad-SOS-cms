import {
  getPageContent,
  getHeroSection,
  getContentSection,
  getGallery,
  getInstagramFeed,
  ContentSection as ContentSectionData,
  Gallery as GalleryData,
} from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { Gallery } from '@/components/sections/Gallery';
import { InstagramFeed } from '@/components/sections/InstagramFeed';

export const dynamic = 'force-dynamic';

type SectionResult =
  | { type: 'content-section'; slug: string; data: ContentSectionData | null }
  | { type: 'gallery'; slug: string; data: GalleryData | null }
  | null;

export default async function HomePage() {
  // Fetch page content
  const page = await getPageContent('home');
  if (!page) {
    return <div>Page not found</div>;
  }

  // Fetch hero section
  const hero = page.heroSlug ? await getHeroSection(page.heroSlug) : null;

  // Fetch content sections
  const sections: SectionResult[] = await Promise.all(
    (page.sections || []).map(async (section): Promise<SectionResult> => {
      if (section.type === 'content-section') {
        return { type: 'content-section', slug: section.slug, data: await getContentSection(section.slug) };
      }
      if (section.type === 'gallery') {
        return { type: 'gallery', slug: section.slug, data: await getGallery(section.slug) };
      }
      return null;
    })
  );

  // Fetch Instagram feed if enabled
  const instagram = page.showInstagram ? await getInstagramFeed() : null;

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
          backgroundVideo={hero.backgroundVideo}
          leftImage={hero.leftImage}
          leftImageAlt={hero.leftImageAlt}
          rightImage={hero.rightImage}
          rightImageAlt={hero.rightImageAlt}
          galleryImages={hero.galleryImages}
          logoImage={hero.logoImage}
          logoImageAlt={hero.logoImageAlt}
          ctaText={hero.ctaText}
          ctaUrl={hero.ctaUrl}
          ctaAriaLabel={hero.ctaAriaLabel}
          textAlignment={hero.textAlignment as 'left' | 'center' | 'right'}
          overlayOpacity={hero.overlayOpacity}
        />
      )}

      {/* Page Sections */}
      {sections.map((section, index) => {
        if (!section || !section.data) return null;

        if (section.type === 'content-section' && section.data) {
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

        if (section.type === 'gallery' && section.data) {
          const data = section.data;
          return (
            <Gallery
              key={index}
              entry={section.slug}
              sectionLabel={data.sectionLabel}
              images={data.images}
            />
          );
        }

        return null;
      })}

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
