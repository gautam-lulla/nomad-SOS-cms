import { Navigation, Footer } from "@/components/layout";
import {
  Gallery,
  FAQAccordion,
  InstagramFeed,
} from "@/components/blocks";
import { Button, Input, RadioButton } from "@/components/ui";
import Link from "next/link";
import privateEventsContent from "@/content/pages/private-events.json";

export default function PrivateEventsPage() {
  const { hero, gallery, form, faq, instagram } = privateEventsContent;

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-[120px] md:pt-[130px] lg:pt-[140px] px-4 md:px-6 lg:px-3m">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
          {/* Heading */}
          <div className="lg:w-1/2">
            <h1 className="font-sabon text-h2 text-off-white-100 max-w-[544px]">
              {hero.heading}
            </h1>
          </div>

          {/* Content */}
          <div className="lg:w-[433px] lg:ml-auto">
            <p className="font-sabon text-body-s text-off-white-100 leading-relaxed mb-6 lg:mb-3s">
              {hero.paragraph}
            </p>
            <Link
              href="#contact-form"
              className="font-gotham font-bold text-cta uppercase tracking-wide-cta inline-flex items-center justify-center gap-xxs transition-all duration-300 ease-in-out px-s pt-3xs pb-2xs bg-transparent text-off-white-100 border border-off-white-100 hover:bg-pink-500 hover:text-black-900 hover:border-pink-500"
            >
              {hero.buttonText}
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pt-10 md:pt-16 lg:pt-xl">
        <Gallery images={gallery} />
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="pt-10 md:pt-16 lg:pt-xl px-4 md:px-6 lg:px-3m">
        <h2 className="font-sabon text-h2 text-off-white-100 text-center mb-10 lg:mb-l">
          {form.title}
        </h2>

        <form className="max-w-[877px] mx-auto">
          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-3m gap-y-6 lg:gap-y-m">
            {/* First Name */}
            <div>
              <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
                {form.fields.firstName.label}
              </label>
              <Input
                type="text"
                placeholder={form.fields.firstName.placeholder}
                variant="light"
                inputStyle="form"
                showArrow={false}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
                {form.fields.lastName.label}
              </label>
              <Input
                type="text"
                placeholder={form.fields.lastName.placeholder}
                variant="light"
                inputStyle="form"
                showArrow={false}
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
                {form.fields.email.label}
              </label>
              <Input
                type="email"
                placeholder={form.fields.email.placeholder}
                variant="light"
                inputStyle="form"
                showArrow={false}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
                {form.fields.phone.label}
              </label>
              <Input
                type="tel"
                placeholder={form.fields.phone.placeholder}
                variant="light"
                inputStyle="form"
                showArrow={false}
              />
            </div>

            {/* Country */}
            <div>
              <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
                {form.fields.country.label}
              </label>
              <Input
                type="text"
                placeholder={form.fields.country.placeholder}
                variant="light"
                inputStyle="form"
                showArrow={false}
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
                {form.fields.eventType.label}
              </label>
              <Input
                type="text"
                placeholder={form.fields.eventType.placeholder}
                variant="light"
                inputStyle="form"
                showArrow={false}
              />
            </div>

            {/* Number of Guests */}
            <div>
              <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
                {form.fields.guests.label}
              </label>
              <Input
                type="text"
                placeholder={form.fields.guests.placeholder}
                variant="light"
                inputStyle="form"
                showArrow={false}
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
                {form.fields.startTime.label}
              </label>
              <Input
                type="text"
                placeholder={form.fields.startTime.placeholder}
                variant="light"
                inputStyle="form"
                showArrow={false}
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="mt-6 lg:mt-m">
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.additionalOptions.label}
            </label>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 lg:gap-m">
              {form.additionalOptions.options.map((option, index) => (
                <RadioButton key={index} name="additionalOption" label={option} variant="light" />
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 lg:mt-m">
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.additionalInfo.label}
            </label>
            <textarea
              placeholder={form.additionalInfo.placeholder}
              className="w-full bg-transparent border-b border-t-0 border-l-0 border-r-0 border-off-white-100 text-off-white-100 placeholder:text-off-white-100/70 font-sabon text-body-s py-3xs min-h-[150px] resize-y outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6 lg:mt-3s">
            <Button type="submit" variant="filled">
              {form.submitText}
            </Button>
          </div>
        </form>
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
