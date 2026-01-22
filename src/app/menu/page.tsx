import { getPageContent, getHeroSection, getAllMenuCategories, getInstagramFeed } from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { MenuCategory } from '@/components/sections/MenuCategory';
import { InstagramFeed } from '@/components/sections/InstagramFeed';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('menu');
  return {
    title: page?.metaTitle || 'Menu',
    description: page?.metaDescription,
  };
}

export default async function MenuPage() {
  const page = await getPageContent('menu');
  if (!page) {
    return <div>Page not found</div>;
  }

  const hero = page.heroSlug ? await getHeroSection(page.heroSlug) : null;
  const menuCategories = await getAllMenuCategories();
  const instagram = page.showInstagram ? await getInstagramFeed() : null;

  // Filter to only include categories with items
  const categoriesWithItems = menuCategories.filter(c => c.items && c.items.length > 0);

  // Sort by sortOrder
  const sortedCategories = [...categoriesWithItems].sort(
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
          leftImage={hero.leftImage}
          leftImageAlt={hero.leftImageAlt}
          rightImage={hero.rightImage}
          rightImageAlt={hero.rightImageAlt}
          logoImage={hero.logoImage}
          logoImageAlt={hero.logoImageAlt}
          textAlignment={hero.textAlignment as 'left' | 'center' | 'right'}
          overlayOpacity={hero.overlayOpacity}
        />
      )}

      {/* Menu Categories */}
      <section className="bg-ink-900 px-[60px] py-[60px]">
        <div className="max-w-[800px]">
          {sortedCategories.map((category, index) => (
            <MenuCategory
              key={index}
              entry="menu"
              name={category.name}
              availability={category.availability}
              items={category.items || []}
              index={index}
            />
          ))}
        </div>
      </section>

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
