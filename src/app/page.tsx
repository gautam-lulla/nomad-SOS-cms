import { SiteNavigation, SiteFooter } from "@/components/layout";
import {
  HeroSplitScreen,
  Gallery,
  SectionHalfScreen,
  InstagramFeed,
  FullWidthImage,
} from "@/components/blocks";
import { Button } from "@/components/ui";
import Link from "next/link";
import { getPageContent, getInstagramContent } from "@/lib/content";

// Force dynamic rendering - content comes from CMS at request time
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch content from CMS
  const homepageContent = await getPageContent('homepage');
  const instagramContent = await getInstagramContent();

  const {
    hero,
    introSection,
    gallery,
    menuSection,
    eventsSection,
    contactSection,
  } = homepageContent as {
    hero: { leftImage: string; rightImage: string; logoSrc: string };
    introSection: {
      heading: string;
      paragraph: string;
      buttonText: string;
      location: { address: string; phone: string };
      hours: { times: string[] };
    };
    gallery: Array<{ src: string; alt: string }>;
    menuSection: { heading: string; paragraph: string; buttonText: string; buttonHref: string; fullWidthImage?: { src: string; alt: string } };
    eventsSection: {
      heading: string;
      paragraph: string;
      buttonText: string;
      buttonHref: string;
      imageSrc: string;
    };
    contactSection: {
      heading: string;
      paragraph: string;
      buttonText: string;
      buttonHref: string;
      imageSrc: string;
    };
  };

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <SiteNavigation />

      {/* Hero Section */}
      <HeroSplitScreen
        leftImage={hero.leftImage}
        rightImage={hero.rightImage}
        logoSrc={hero.logoSrc}
        showGradients={true}
        showLogo={true}
        cmsEntry="homepage"
      />

      {/* Intro Section with Location & Hours */}
      <section className="pt-10 md:pt-16 lg:pt-3l px-[30px] lg:px-3m">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
          {/* Heading */}
          <div className="lg:w-1/2">
            <h2
              className="font-sabon text-h2-mobile md:text-h2 text-off-white-100 max-w-[544px]"
              data-cms-entry="homepage"
              data-cms-field="intro.heading"
              data-cms-label="Intro Heading"
            >
              {introSection.heading}
            </h2>
          </div>

          {/* Content */}
          <div className="lg:w-[715px] lg:ml-auto">
            <div className="max-w-[433px]">
              <p
                className="font-sabon text-body-s text-off-white-100 leading-relaxed mb-6 lg:mb-3s"
                data-cms-entry="homepage"
                data-cms-field="intro.paragraph"
                data-cms-type="textarea"
                data-cms-label="Intro Paragraph"
              >
                {introSection.paragraph}
              </p>

              <Button variant="outline" className="mb-8 lg:mb-3m">
                <span
                  data-cms-entry="homepage"
                  data-cms-field="intro.buttonText"
                  data-cms-label="Intro Button Text"
                >
                  {introSection.buttonText}
                </span>
              </Button>

              {/* Location & Hours */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-m">
                {/* Location */}
                <div className="w-full sm:w-[186px]">
                  <div className="flex items-center gap-xxs mb-3xs">
                    <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                      01.
                    </span>
                    <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                      location
                    </span>
                  </div>
                  <div className="font-sabon text-body-s text-off-white-100 leading-relaxed tracking-tight-body">
                    <p
                      data-cms-entry="homepage"
                      data-cms-field="intro.location.address"
                      data-cms-label="Address"
                    >
                      {introSection.location.address}
                    </p>
                    <p
                      data-cms-entry="homepage"
                      data-cms-field="intro.location.phone"
                      data-cms-label="Phone"
                    >
                      {introSection.location.phone}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="w-full sm:w-[186px]">
                  <div className="flex items-center gap-xxs mb-3xs">
                    <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                      02.
                    </span>
                    <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                      hours
                    </span>
                  </div>
                  <div
                    className="font-sabon text-body-s text-off-white-100 leading-relaxed tracking-tight-body"
                    data-cms-entry="homepage"
                    data-cms-field="intro.hours.times"
                    data-cms-type="array"
                    data-cms-label="Hours"
                  >
                    {introSection.hours.times.map((time, index) => (
                      <p key={index}>{time}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pt-10 md:pt-16 lg:pt-xl">
        <Gallery images={gallery} />
      </section>

      {/* Menu Section */}
      <section className="pt-10 md:pt-16 lg:pt-3l">
        <div className="px-[30px] lg:px-3m">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
            {/* Heading */}
            <div className="lg:w-1/2">
              <h2
                className="font-sabon text-h2-mobile md:text-h2 text-off-white-100 max-w-[544px]"
                data-cms-entry="homepage"
                data-cms-field="menu.heading"
                data-cms-label="Menu Heading"
              >
                {menuSection.heading}
              </h2>
            </div>

            {/* Content */}
            <div className="lg:w-[715px] lg:ml-auto">
              <div className="max-w-[433px]">
                <p
                  className="font-sabon text-body-s text-off-white-100 leading-relaxed mb-6 lg:mb-3s"
                  data-cms-entry="homepage"
                  data-cms-field="menu.paragraph"
                  data-cms-type="textarea"
                  data-cms-label="Menu Paragraph"
                >
                  {menuSection.paragraph}
                </p>
                <Link href={menuSection.buttonHref}>
                  <Button variant="outline">
                    <span
                      data-cms-entry="homepage"
                      data-cms-field="menu.buttonText"
                      data-cms-label="Menu Button Text"
                    >
                      {menuSection.buttonText}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Menu Image */}
        {menuSection.fullWidthImage && (
          <div className="mt-10 md:mt-16 lg:mt-xl">
            <FullWidthImage
              src={menuSection.fullWidthImage.src}
              alt={menuSection.fullWidthImage.alt}
            />
          </div>
        )}
      </section>

      {/* Events Section - Image Right */}
      <SectionHalfScreen
        heading={eventsSection.heading}
        paragraphs={[eventsSection.paragraph]}
        buttonText={eventsSection.buttonText}
        buttonHref={eventsSection.buttonHref}
        imageSrc={eventsSection.imageSrc}
        variant="image-right"
        cmsEntry="homepage"
        cmsFieldPrefix="events"
      />

      {/* Contact Section - Image Left */}
      <SectionHalfScreen
        heading={contactSection.heading}
        paragraphs={[contactSection.paragraph]}
        buttonText={contactSection.buttonText}
        buttonHref={contactSection.buttonHref}
        imageSrc={contactSection.imageSrc}
        variant="image-left"
        cmsEntry="homepage"
        cmsFieldPrefix="contact"
      />

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
