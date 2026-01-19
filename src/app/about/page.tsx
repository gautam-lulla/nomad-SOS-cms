import { SiteNavigation, SiteFooter } from "@/components/layout";
import {
  SectionHalfScreen,
  TextSection,
  TeamGrid,
  AwardsCarousel,
  FAQAccordion,
  InstagramFeed,
  FullWidthImage,
} from "@/components/blocks";
import Image from "next/image";
import { getPageContent, getInstagramContent } from "@/lib/content";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { edit?: string };
}

export default async function AboutPage({ searchParams }: PageProps) {
  const isEditMode = searchParams.edit === 'true';

  // Fetch content from CMS (bypass cache in edit mode)
  const aboutContent = await getPageContent('about', { noCache: isEditMode });
  const instagramContent = await getInstagramContent({ noCache: isEditMode });

  const { hero, heritage, quote, fullWidthImage, team, awards, faq } = aboutContent as {
    hero: { heading: string; imageSrc: string };
    heritage: { title: string; paragraph: string; imageSrc: string };
    quote: { heading: string; paragraph: string };
    fullWidthImage?: { src: string; alt: string };
    team: Array<{ name: string; title: string; description: string; imageSrc: string }>;
    awards: { title: string; logos: Array<{ src: string; alt: string }> };
    faq: { title: string; items: Array<{ question: string; answer: string }> };
  };

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <SiteNavigation />

      {/* Hero Section with Heading Overlay */}
      <section className="relative">
        {/* Heading */}
        <div className="pt-[140px] md:pt-[180px] lg:pt-[210px] pb-6 lg:pb-3m px-4 md:px-6 lg:px-3m">
          <h1
            className="font-sabon text-h2 text-off-white-100 max-w-[544px]"
            data-cms-entry="about"
            data-cms-field="hero.heading"
            data-cms-label="Hero Heading"
          >
            {hero.heading}
          </h1>
        </div>

        {/* Full Width Hero Image */}
        <div className="relative h-[400px] md:h-[600px] lg:h-[840px] w-full">
          <Image
            src={hero.imageSrc}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Heritage Section */}
      <SectionHalfScreen
        heading={heritage.title}
        paragraphs={[heritage.paragraph]}
        imageSrc={heritage.imageSrc}
        variant="image-right"
        headingSize="h1"
        cmsEntry="about"
        cmsFieldPrefix="heritage"
      />

      {/* Quote Section */}
      <section className="py-10 md:py-16 lg:py-xl">
        <TextSection
          heading={quote.heading}
          paragraph={quote.paragraph}
          layout="centered"
          cmsEntry="about"
          cmsFieldPrefix="quote"
        />
      </section>

      {/* Team Grid */}
      <section>
        <TeamGrid members={team} />
      </section>

      {/* Full Width Image */}
      {fullWidthImage && (
        <section className="mt-10 md:mt-16 lg:mt-xl">
          <FullWidthImage
            src={fullWidthImage.src}
            alt={fullWidthImage.alt}
          />
        </section>
      )}

      {/* Awards Section */}
      <section className="pt-16 md:pt-24 lg:pt-[160px]">
        <AwardsCarousel
          title={awards.title}
          logos={awards.logos}
        />
      </section>

      {/* FAQ Section */}
      <section className="pt-16 md:pt-24 lg:pt-[160px] pb-6 lg:pb-3m">
        <div className="max-w-[877px] mx-auto px-4 md:px-6 lg:px-3m">
          <h2
            className="font-sabon text-h2 text-off-white-100 text-center mb-10 lg:mb-l"
            data-cms-entry="about"
            data-cms-field="faq.title"
            data-cms-label="FAQ Title"
          >
            {faq.title}
          </h2>
          <FAQAccordion items={faq.items} cmsEntry="about" cmsFieldPrefix="faq" />
        </div>
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
