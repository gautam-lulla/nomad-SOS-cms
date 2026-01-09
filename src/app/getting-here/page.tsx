import { Navigation, Footer } from "@/components/layout";
import { FAQAccordion, InstagramFeed } from "@/components/blocks";
import Image from "next/image";
import gettingHereContent from "@/content/pages/getting-here.json";
import instagramContent from "@/content/global/instagram.json";

export default function GettingHerePage() {
  const { hero, location, info, gallery, faq } = gettingHereContent;

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <Navigation />

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
      <section className="pt-10 md:pt-16 lg:pt-xl pb-10 md:pb-16 lg:pb-2l px-4 md:px-6 lg:px-3m">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-xl">
          {/* Left - Title & Phone */}
          <div className="lg:w-[433px]">
            <h1 className="font-sabon text-h2 text-off-white-100 mb-2xxs">
              {hero.title}
            </h1>
            <a
              href={`tel:${location.phone}`}
              className="font-sabon text-h2 text-off-white-100 hover:text-pink-500 transition-colors"
            >
              {location.phone}
            </a>
          </div>

          {/* Right - Info Columns */}
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-[60px]">
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
      <section className="relative h-[400px] md:h-[600px] lg:h-[720px] w-full overflow-hidden bg-[#1a1a2e]">
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
        <div className="absolute top-[15%] left-[8%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          Hialeah
        </div>
        <div className="absolute top-[25%] left-[5%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          Brownsville
        </div>
        <div className="absolute top-[45%] left-[12%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          Little Havana
        </div>
        <div className="absolute top-[65%] left-[8%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          Coral Gables
        </div>
        <div className="absolute top-[35%] left-[35%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          Wynwood
        </div>
        <div className="absolute top-[55%] left-[30%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          Downtown
        </div>
        <div className="absolute top-[20%] right-[15%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          North Beach
        </div>
        <div className="absolute top-[35%] right-[10%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          Miami Beach
        </div>
        <div className="absolute top-[55%] right-[12%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          South Beach
        </div>
        <div className="absolute bottom-[20%] right-[25%] font-gotham text-[10px] md:text-[12px] text-off-white-100/40 uppercase tracking-widest">
          Key Biscayne
        </div>

        {/* Location Pin - Centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          {/* Pin Card */}
          <div className="bg-pink-500 px-2xs py-2xs">
            <Image
              src="/images/nomad-wynwood-wordmark-footer.svg"
              alt="The NoMad Bar"
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
