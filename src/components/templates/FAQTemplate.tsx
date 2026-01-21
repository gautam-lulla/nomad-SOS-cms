/**
 * FAQ Page Template
 *
 * Renders the FAQ page with hero gallery, heading,
 * FAQ accordion, and Instagram feed.
 */

import { FAQAccordion, InstagramFeed } from "@/components/blocks";
import Image from "next/image";
import type { FAQTemplateProps } from "./types";

export function FAQTemplate({ slug, pageContent, instagramContent }: FAQTemplateProps) {
  const { hero, faq } = pageContent;

  return (
    <>
      {/* Hero Gallery */}
      <section className="pt-[100px] md:pt-[105px] lg:pt-[110px]">
        <div className="flex h-[200px] md:h-[250px] lg:h-[296px]">
          {hero.images.map((image, index) => (
            <div key={index} className={`flex-1 relative ${index >= 2 ? 'hidden md:block' : ''}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Hero Heading */}
      <section className="pt-10 md:pt-16 lg:pt-xl pb-10 md:pb-16 lg:pb-xl">
        <div className="max-w-[544px] mx-auto text-center px-[30px] lg:px-3m">
          <h1
            className="font-sabon text-h2-mobile md:text-h2 text-off-white-100"
            data-cms-entry={slug}
            data-cms-field="hero.heading"
            data-cms-label="Hero Heading"
          >
            {hero.heading}
          </h1>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-10 md:pb-16 lg:pb-xl">
        <div className="max-w-[877px] mx-auto px-[30px] lg:px-3m">
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
