import { SiteNavigation, SiteFooter } from "@/components/layout";
import {
  Gallery,
  FAQAccordion,
  InstagramFeed,
} from "@/components/blocks";
import Link from "next/link";
import { getPageContent, getInstagramContent } from "@/lib/content";
import { PrivateEventsForm } from "./private-events-form";

export const dynamic = 'force-dynamic';

export default async function PrivateEventsPage() {
  // Fetch content from CMS
  const privateEventsContent = await getPageContent('private-events');
  const instagramContent = await getInstagramContent();

  const { hero, gallery, form, faq } = privateEventsContent as {
    hero: { heading: string; paragraph: string; buttonText: string };
    gallery: Array<{ src: string; alt: string }>;
    form: {
      title: string;
      fields: {
        firstName: { label: string; placeholder: string };
        lastName: { label: string; placeholder: string };
        email: { label: string; placeholder: string };
        phone: { label: string; placeholder: string };
        country: { label: string; placeholder: string };
        eventType: { label: string; placeholder: string };
        guests: { label: string; placeholder: string };
        startTime: { label: string; placeholder: string };
      };
      additionalOptions: { label: string; options: string[] };
      additionalInfo: { label: string; placeholder: string };
      submitText: string;
    };
    faq: { title: string; items: Array<{ question: string; answer: string }> };
  };

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <SiteNavigation />

      {/* Hero Section */}
      <section className="pt-[120px] md:pt-[130px] lg:pt-[140px] px-[30px] lg:px-3m">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
          {/* Heading */}
          <div className="lg:w-1/2">
            <h1
              className="font-sabon text-h2-mobile md:text-h2 text-off-white-100 max-w-[544px]"
              data-cms-entry="private-events"
              data-cms-field="hero.heading"
              data-cms-label="Hero Heading"
            >
              {hero.heading}
            </h1>
          </div>

          {/* Content */}
          <div className="lg:w-[433px] lg:ml-auto">
            <p
              className="font-sabon text-body-s text-off-white-100 leading-relaxed mb-6 lg:mb-3s"
              data-cms-entry="private-events"
              data-cms-field="hero.paragraph"
              data-cms-type="textarea"
              data-cms-label="Hero Paragraph"
            >
              {hero.paragraph}
            </p>
            <Link
              href="#contact-form"
              className="font-gotham font-bold text-cta uppercase tracking-wide-cta inline-flex items-center justify-center gap-xxs transition-all duration-300 ease-in-out px-s pt-3xs pb-2xs bg-transparent text-off-white-100 border border-off-white-100 hover:bg-pink-500 hover:text-black-900 hover:border-pink-500"
            >
              <span
                data-cms-entry="private-events"
                data-cms-field="hero.buttonText"
                data-cms-label="Hero Button Text"
              >
                {hero.buttonText}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pt-10 md:pt-16 lg:pt-xl">
        <Gallery images={gallery} />
      </section>

      {/* Contact Form - Client Component */}
      <PrivateEventsForm form={form} />

      {/* FAQ Section */}
      <section className="pt-10 md:pt-16 lg:pt-xl pb-6 lg:pb-3m">
        <div className="max-w-[877px] mx-auto px-[30px] lg:px-3m">
          <h2
            className="font-sabon text-h2-mobile md:text-h2 text-off-white-100 text-center mb-10 lg:mb-l"
            data-cms-entry="private-events"
            data-cms-field="faq.title"
            data-cms-label="FAQ Title"
          >
            {faq.title}
          </h2>
          <FAQAccordion items={faq.items} cmsEntry="private-events" cmsFieldPrefix="faq" />
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
