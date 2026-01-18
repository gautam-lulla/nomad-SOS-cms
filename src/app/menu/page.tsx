import { SiteNavigation, SiteFooter } from "@/components/layout";
import { Gallery, InstagramFeed } from "@/components/blocks";
import Image from "next/image";
import { getPageContent, getMenuContent, getInstagramContent } from "@/lib/content";

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  // Fetch content from CMS
  const pageContent = await getPageContent('menu');
  const menuData = await getMenuContent();
  const instagramContent = await getInstagramContent();

  // Get page-specific content
  const { hero, gallery } = pageContent as {
    hero: { images: Array<{ src: string; alt: string }> };
    gallery: Array<{ src: string; alt: string }>;
  };

  // Get menu-specific content
  const { categories, activeCategoryId, menuTitle, menuSubtitle, sections } = menuData;

  return (
    <main className="bg-black-900 min-h-screen relative">
      {/* Navigation */}
      <SiteNavigation />

      {/* Hero Gallery */}
      <section className="absolute top-0 left-0 right-0 z-0">
        <div className="flex h-[400px] md:h-[600px] lg:h-[840px]">
          {hero.images.map((image, index) => (
            <div key={index} className={`flex-1 relative ${index > 0 ? 'hidden md:block' : ''}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Menu Content */}
      <section className="relative z-10 pt-[450px] md:pt-[680px] lg:pt-[940px] px-4 md:px-6 lg:px-3m pb-10 lg:pb-xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-xl">
          {/* Sidebar Categories */}
          <div className="lg:w-[320px] shrink-0">
            <nav className="flex flex-row flex-wrap lg:flex-col gap-3 lg:gap-2xxs lg:sticky lg:top-[100px]">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  className={`font-sabon text-[18px] md:text-[20px] lg:text-h3 tracking-tight-h3 text-left transition-colors whitespace-nowrap ${
                    index === 0
                      ? "text-pink-500 italic"
                      : "text-off-white-100 hover:text-pink-500"
                  }`}
                  data-cms-entry={category.slug}
                  data-cms-field="name"
                  data-cms-label="Category Name"
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Menu Items */}
          <div className="flex-1">
            {/* Menu Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-6 lg:mb-m border-b border-off-white-100 pb-xs">
              <h1
                className="font-sabon text-[36px] md:text-[48px] lg:text-[56px] leading-tight text-off-white-100"
                data-cms-entry={categories.find(c => c.id === activeCategoryId)?.slug}
                data-cms-field="name"
                data-cms-label="Menu Title"
              >
                {menuTitle}
              </h1>
              <span
                className="font-sabon text-body-s text-off-white-100 italic mt-2 sm:mt-0"
                data-cms-entry={categories.find(c => c.id === activeCategoryId)?.slug}
                data-cms-field="subtitle"
                data-cms-label="Menu Subtitle"
              >
                {menuSubtitle}
              </span>
            </div>

            {/* Menu Sections */}
            {sections.map((section) => (
              <div key={section.id} className="mb-10 lg:mb-l">
                {/* Section Title */}
                <h2
                  className="font-gotham font-bold text-h5 uppercase tracking-wide-h5 text-off-white-100 mb-6 lg:mb-m border-b border-off-white-100 pb-3xs"
                  data-cms-entry={section.slug}
                  data-cms-field="name"
                  data-cms-label="Section Name"
                >
                  {section.name}
                </h2>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 lg:gap-x-xl gap-y-4 lg:gap-y-m">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start border-b border-off-white-100/20 pb-xs"
                      data-cms-entry={item.slug}
                      data-cms-type="menu-item"
                      data-cms-label={item.name}
                    >
                      <div className="flex-1">
                        <h3
                          className="font-gotham font-bold text-[14px] uppercase tracking-[0.42px] text-off-white-100"
                          data-cms-field="name"
                        >
                          {item.name}
                        </h3>
                        <p
                          className="font-sabon text-body-s text-off-white-100/70 italic"
                          data-cms-field="description"
                        >
                          {item.description}
                        </p>
                      </div>
                      <span
                        className="font-gotham font-bold text-[14px] text-off-white-100 ml-4 lg:ml-m"
                        data-cms-field="price"
                      >
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Gallery */}
      <section className="relative z-10">
        <Gallery images={gallery} />
      </section>

      {/* Instagram Feed */}
      <InstagramFeed
        title={instagramContent.title}
        handle={instagramContent.handle}
        handleUrl={instagramContent.handleUrl}
        images={instagramContent.images}
      />

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}
