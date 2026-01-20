import { SiteNavigation, SiteFooter } from "@/components/layout";
import { FAQAccordion, InstagramFeed } from "@/components/blocks";
import Image from "next/image";
import { getPageContent, getInstagramContent, getSiteSettings } from "@/lib/content";

export const dynamic = 'force-dynamic';

export default async function GettingHerePage() {
  // Fetch content from CMS
  const gettingHereContent = await getPageContent('getting-here');
  const instagramContent = await getInstagramContent();
  const siteSettings = await getSiteSettings();

  const { hero, location, info, gallery, map, faq } = gettingHereContent as {
    hero: { title: string; subtitle?: string };
    location: { phone: string; address: string[] };
    info: {
      hours: { label: string; times: string[] };
      transit: { label: string; content: string[] };
    };
    gallery: Array<{ src: string; alt?: string }>;
    map?: {
      labels: Array<{
        text: string;
        position: { top?: string; bottom?: string; left?: string; right?: string };
      }>;
    };
    faq: { title: string; items: Array<{ question: string; answer: string }> };
  };

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <SiteNavigation />

      {/* Hero Gallery - 2 rows on mobile, 1 row on tablet+ */}
      <section className="pt-[100px] md:pt-[105px] lg:pt-[110px]">
        <div className="grid grid-cols-3 md:grid-cols-6 h-[200px] md:h-[200px] lg:h-[296px]">
          {gallery.map((image, index) => (
            <div
              key={index}
              className="relative"
            >
              <Image
                src={image.src}
                alt={image.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="pt-10 md:pt-16 lg:pt-xl pb-10 md:pb-16 lg:pb-2l px-[30px] lg:px-3m">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-xl">
          {/* Left - Title & Phone */}
          <div className="lg:w-[433px]">
            <h1 className="font-sabon text-h2-mobile md:text-h2 text-off-white-100 mb-2xxs">
              {hero.title}
            </h1>
            <a
              href={`tel:${location.phone}`}
              className="font-sabon text-h2-mobile md:text-h2 text-off-white-100 hover:text-pink-500 transition-colors"
            >
              {location.phone}
            </a>
          </div>

          {/* Right - Info Columns */}
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-3m">
            {/* Working Hours */}
            <div className="w-[180px]">
              <div className="flex items-center gap-xxs mb-3xs">
                <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                  01.
                </span>
                <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                  {info.hours.label}
                </span>
              </div>
              <div className="font-sabon text-body-s text-off-white-100 leading-relaxed">
                {info.hours.times.map((time, index) => (
                  <p key={index}>{time}</p>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="w-[180px]">
              <div className="flex items-center gap-xxs mb-3xs">
                <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                  02.
                </span>
                <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                  Location
                </span>
              </div>
              <div className="font-sabon text-body-s text-off-white-100 leading-relaxed">
                {location.address.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            {/* Directions */}
            <div className="w-[180px]">
              <div className="flex items-center gap-xxs mb-3xs">
                <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                  03.
                </span>
                <span className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100">
                  {info.transit.label}
                </span>
              </div>
              <div className="font-sabon text-body-s text-off-white-100 leading-relaxed">
                {info.transit.content.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Stylized map design */}
      <section className="relative h-[400px] md:h-[600px] lg:h-[720px] w-full overflow-hidden bg-map-background">
        {/* Map grid lines */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Neighborhood labels */}
        {map?.labels?.map((label, index) => (
          <div
            key={index}
            className="absolute font-gotham text-cta-small md:text-cta text-off-white-100/40 uppercase tracking-widest"
            style={{
              top: label.position.top,
              bottom: label.position.bottom,
              left: label.position.left,
              right: label.position.right,
            }}
          >
            {label.text}
          </div>
        ))}

        {/* Location Pin - Centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          {/* Pin Card */}
          <div className="bg-pink-500 px-2xs py-2xs">
            <Image
              src={siteSettings.footer.wordmarkImage}
              alt={siteSettings.footer.wordmarkAlt}
              width={185}
              height={14}
              className="h-[14px] w-auto"
            />
          </div>
          {/* Pin Triangle */}
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-pink-500" />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pt-10 md:pt-16 lg:pt-xl pb-6 lg:pb-3m">
        <div className="max-w-[877px] mx-auto px-[30px] lg:px-3m">
          <h2 className="font-sabon text-h2-mobile md:text-h2 text-off-white-100 text-center mb-10 lg:mb-l">
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
      <SiteFooter />
    </main>
  );
}
