/**
 * Contact Page Template
 *
 * Renders the Contact page with hero, info blocks,
 * logo, gallery, FAQ, and Instagram feed.
 */

import { Logo } from "@/components/layout";
import { FAQAccordion, InstagramFeed, Gallery } from "@/components/blocks";
import Link from "next/link";
import type { ContactTemplateProps } from "./types";

export function ContactTemplate({ slug, pageContent, instagramContent }: ContactTemplateProps) {
  const { hero, info, gallery, faq } = pageContent;

  return (
    <>
      {/* Hero Section */}
      <section className="pt-[120px] md:pt-[130px] lg:pt-[140px] px-[30px] lg:px-3m">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-xl">
          {/* Contact Info */}
          <div className="lg:w-1/2">
            <h1
              className="font-sabon text-[36px] md:text-[48px] lg:text-[56px] leading-tight text-off-white-100 mb-xs"
              data-cms-entry={slug}
              data-cms-field="hero.title"
              data-cms-label="Hero Title"
            >
              {hero.title}
            </h1>
            <a
              href={`tel:${hero.phone}`}
              className="font-sabon text-h2-mobile md:text-h2 text-pink-500 hover:text-off-white-100 transition-colors"
              data-cms-entry={slug}
              data-cms-field="hero.phone"
              data-cms-label="Phone Number"
            >
              {hero.phone}
            </a>

            {/* Info Sections */}
            <div className="mt-10 lg:mt-xl space-y-6 lg:space-y-m">
              {/* Hours */}
              <div>
                <p
                  className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 mb-3xs"
                  data-cms-entry={slug}
                  data-cms-field="info.hours.label"
                  data-cms-label="Hours Label"
                >
                  {info.hours.label}
                </p>
                <div
                  className="font-sabon text-body-s text-off-white-100 leading-relaxed"
                  data-cms-entry={slug}
                  data-cms-field="info.hours.times"
                  data-cms-type="array"
                  data-cms-label="Hours Times"
                >
                  {info.hours.times.map((time, index) => (
                    <p key={index}>{time}</p>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <p
                  className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 mb-3xs"
                  data-cms-entry={slug}
                  data-cms-field="info.location.label"
                  data-cms-label="Location Label"
                >
                  {info.location.label}
                </p>
                <div
                  className="font-sabon text-body-s text-off-white-100 leading-relaxed"
                  data-cms-entry={slug}
                  data-cms-field="info.location.address"
                  data-cms-type="array"
                  data-cms-label="Address Lines"
                >
                  {info.location.address.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div>
                <p
                  className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 mb-3xs"
                  data-cms-entry={slug}
                  data-cms-field="info.socials.label"
                  data-cms-label="Socials Label"
                >
                  {info.socials.label}
                </p>
                <div
                  className="font-sabon text-body-s text-off-white-100 leading-relaxed"
                  data-cms-entry={slug}
                  data-cms-field="info.socials.links"
                  data-cms-type="array"
                  data-cms-label="Social Links"
                >
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
        <Gallery images={gallery} cmsEntry={slug} cmsFieldPrefix="gallery" />
      </section>

      {/* FAQ Section */}
      <section className="pt-10 md:pt-16 lg:pt-xl pb-6 lg:pb-3m">
        <div className="max-w-[600px] mx-auto px-[30px] lg:px-3m">
          <h2
            className="font-sabon text-h2-mobile md:text-h2 text-off-white-100 text-center mb-10 lg:mb-l"
            data-cms-entry={slug}
            data-cms-field="faq.title"
            data-cms-label="FAQ Title"
          >
            {faq.title}
          </h2>
          <FAQAccordion items={faq.items} cmsEntry={slug} cmsFieldPrefix="faq" />
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed
        title={instagramContent.title}
        handle={instagramContent.handle}
        handleUrl={instagramContent.handleUrl}
        images={instagramContent.images}
      />
    </>
  );
}
