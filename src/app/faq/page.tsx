import { Navigation, Footer } from "@/components/layout";
import { FAQAccordion, InstagramFeed } from "@/components/blocks";
import Image from "next/image";
import faqContent from "@/content/pages/faq.json";

export default function FAQPage() {
  const { hero, faq, instagram } = faqContent;

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <Navigation />

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
        <div className="max-w-[544px] mx-auto text-center px-4 md:px-6 lg:px-3m">
          <h1 className="font-sabon text-h2 text-off-white-100">
            {hero.heading}
          </h1>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-10 md:pb-16 lg:pb-xl">
        <div className="max-w-[877px] mx-auto px-4 md:px-6 lg:px-3m">
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
