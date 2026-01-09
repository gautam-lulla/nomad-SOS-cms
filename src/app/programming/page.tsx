import { Navigation, Footer } from "@/components/layout";
import { FAQAccordion, InstagramFeed } from "@/components/blocks";
import { Button } from "@/components/ui";
import Image from "next/image";
import programmingContent from "@/content/pages/programming.json";

export default function ProgrammingPage() {
  const { hero, intro, events, pagination, faq, instagram } = programmingContent;

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[600px] lg:h-[840px] w-full">
          <Image
            src={hero.imageSrc}
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black-900/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute top-[120px] md:top-[130px] lg:top-[140px] left-4 right-4 md:left-6 md:right-6 lg:left-3m lg:right-3m">
          <h1 className="font-sabon text-h2 text-off-white-100 max-w-[544px]">
            {hero.heading}
          </h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="pt-10 md:pt-16 lg:pt-xl px-4 md:px-6 lg:px-3m">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-xl">
          {/* Left Column with Button */}
          <div className="lg:w-1/2">
            <p className="font-sabon text-body-s text-off-white-100 leading-relaxed mb-6 lg:mb-3s max-w-[433px]">
              {intro.columns[0]}
            </p>
            <Button variant="outline">{intro.buttonText}</Button>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/2">
            <p className="font-sabon text-body-s text-off-white-100 leading-relaxed max-w-[433px]">
              {intro.columns[1]}
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="pt-10 md:pt-16 lg:pt-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {events.map((event, index) => (
            <div key={index} className="flex flex-col">
              {/* Event Image */}
              <div className="relative h-[350px] md:h-[500px] lg:h-[700px]">
                <Image
                  src={event.imageSrc}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Event Content */}
              <div className="px-4 md:px-6 lg:px-m pt-6 lg:pt-m pb-6 lg:pb-3s">
                <h3 className="font-gotham font-bold text-[16px] uppercase tracking-[0.48px] text-off-white-100 mb-xs">
                  {event.title}
                </h3>
                <p className="font-sabon text-body-s text-off-white-100 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-xs py-10 lg:py-xl">
          <span className="font-gotham font-bold text-cta text-off-white-100">
            ( 0{pagination.current} )
          </span>
          {[...Array(pagination.total - 1)].map((_, i) => (
            <span
              key={i}
              className="font-gotham font-bold text-cta text-off-white-100/50 hover:text-off-white-100 cursor-pointer"
            >
              0{i + 2}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-6 lg:pb-3m">
        <div className="max-w-[877px] mx-auto px-4 md:px-6 lg:px-3m">
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
