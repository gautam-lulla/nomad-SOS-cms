import { Navigation, Footer } from "@/components/layout";
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
import aboutContent from "@/content/pages/about.json";
import instagramContent from "@/content/global/instagram.json";

export default function AboutPage() {
  const { hero, heritage, quote, team, awards, faq } = aboutContent;

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Heading Overlay */}
      <section className="relative">
        {/* Heading */}
        <div className="pt-[140px] md:pt-[180px] lg:pt-[210px] pb-6 lg:pb-3m px-4 md:px-6 lg:px-3m">
          <h1 className="font-sabon text-h2 text-off-white-100 max-w-[544px]">
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
      />

      {/* Quote Section */}
      <section className="py-10 md:py-16 lg:py-xl">
        <TextSection
          heading={quote.heading}
          paragraph={quote.paragraph}
          layout="centered"
        />
      </section>

      {/* Team Grid */}
      <section>
        <TeamGrid members={team} />
      </section>

      {/* Full Width Image */}
      <section className="mt-10 md:mt-16 lg:mt-xl">
        <FullWidthImage
          src="/images/about/dining-table.jpg"
          alt="Dining experience"
        />
      </section>

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
          <h2 className="font-sabon text-h2 text-off-white-100 text-center mb-10 lg:mb-l">
            {faq.title}
          </h2>
          <FAQAccordion items={faq.items} />
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
      <Footer />
    </main>
  );
}
