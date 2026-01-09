import { Navigation, Footer } from "@/components/layout";
import { Gallery, InstagramFeed } from "@/components/blocks";
import Image from "next/image";
import menuContent from "@/content/pages/menu.json";

export default function MenuPage() {
  const { hero, categories, menuTitle, menuSubtitle, sections, gallery, instagram } = menuContent;

  return (
    <main className="bg-black-900 min-h-screen relative">
      {/* Navigation */}
      <Navigation />

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
                  key={index}
                  className={`font-sabon text-[18px] md:text-[20px] lg:text-h3 tracking-tight-h3 text-left transition-colors whitespace-nowrap ${
                    index === 0
                      ? "text-pink-500 italic"
                      : "text-off-white-100 hover:text-pink-500"
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>

          {/* Menu Items */}
          <div className="flex-1">
            {/* Menu Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-6 lg:mb-m border-b border-off-white-100 pb-xs">
              <h1 className="font-sabon text-[36px] md:text-[48px] lg:text-[56px] leading-tight text-off-white-100">
                {menuTitle}
              </h1>
              <span className="font-sabon text-body-s text-off-white-100 italic mt-2 sm:mt-0">
                {menuSubtitle}
              </span>
            </div>

            {/* Menu Sections */}
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-10 lg:mb-l">
                {/* Section Title */}
                <h2 className="font-gotham font-bold text-h5 uppercase tracking-wide-h5 text-off-white-100 mb-6 lg:mb-m border-b border-off-white-100 pb-3xs">
                  {section.name}
                </h2>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 lg:gap-x-xl gap-y-4 lg:gap-y-m">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between items-start border-b border-off-white-100/20 pb-xs"
                    >
                      <div className="flex-1">
                        <h3 className="font-gotham font-bold text-[14px] uppercase tracking-[0.42px] text-off-white-100">
                          {item.name}
                        </h3>
                        <p className="font-sabon text-body-s text-off-white-100/70 italic">
                          {item.description}
                        </p>
                      </div>
                      <span className="font-gotham font-bold text-[14px] text-off-white-100 ml-4 lg:ml-m">
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
        title={instagram.title}
        handle={instagram.handle}
        handleUrl={instagram.handleUrl}
        images={instagram.images}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
