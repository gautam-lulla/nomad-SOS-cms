import { Navigation, Footer } from "@/components/layout";
import { FAQAccordion, InstagramFeed, Gallery } from "@/components/blocks";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import contactContent from "@/content/pages/contact.json";

export default function ContactPage() {
  const { hero, info, gallery, faq, instagram } = contactContent;

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-[120px] md:pt-[130px] lg:pt-[140px] px-4 md:px-6 lg:px-3m">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-xl">
          {/* Contact Info */}
          <div className="lg:w-1/2">
            <h1 className="font-sabon text-[36px] md:text-[48px] lg:text-[56px] leading-tight text-off-white-100 mb-xs">
              {hero.title}
            </h1>
            <a
              href={`tel:${hero.phone}`}
              className="font-sabon text-[28px] md:text-h2 text-pink-500 hover:text-off-white-100 transition-colors"
            >
              {hero.phone}
            </a>

            {/* Info Sections */}
            <div className="mt-10 lg:mt-xl space-y-6 lg:space-y-m">
              {/* Hours */}
              <div>
                <p className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 mb-3xs">
                  {info.hours.label}
                </p>
                <div className="font-sabon text-body-s text-off-white-100 leading-relaxed">
                  {info.hours.times.map((time, index) => (
                    <p key={index}>{time}</p>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 mb-3xs">
                  {info.location.label}
                </p>
                <div className="font-sabon text-body-s text-off-white-100 leading-relaxed">
                  {info.location.address.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div>
                <p className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 mb-3xs">
                  {info.socials.label}
                </p>
                <div className="font-sabon text-body-s text-off-white-100 leading-relaxed">
                  {info.socials.links.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:text-pink-500 transition-colors"
                    >
                      {social.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map/Logo Section */}
          <div className="lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0">
            <div className="border border-off-white-100 p-10 lg:p-xl">
              <Logo variant="light" size="large" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pt-10 md:pt-16 lg:pt-xl">
        <Gallery images={gallery} />
      </section>

      {/* FAQ Section */}
      <section className="pt-10 md:pt-16 lg:pt-xl pb-6 lg:pb-3m">
        <div className="max-w-[600px] mx-auto px-4 md:px-6 lg:px-3m">
          <h2 className="font-sabon text-h2 text-off-white-100 text-center mb-10 lg:mb-l">
            {faq.title}
          </h2>
          <FAQAccordion items={faq.items} />
        </div>
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
