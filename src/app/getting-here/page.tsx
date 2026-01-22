import { getPageContent, getHeroSection, getSiteSettings } from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('getting-here');
  return {
    title: page?.metaTitle || 'Getting Here',
    description: page?.metaDescription,
  };
}

export default async function GettingHerePage() {
  const page = await getPageContent('getting-here');
  const settings = await getSiteSettings();
  if (!page) {
    return <div>Page not found</div>;
  }

  const hero = page.heroSlug ? await getHeroSection(page.heroSlug) : null;

  return (
    <>
      {/* Hero Section */}
      {hero && (
        <HeroSection
          entry={page.heroSlug!}
          variant={hero.variant as 'split-screen' | 'full-screen' | 'gallery' | 'text-only'}
          headline={hero.headline}
          subtitle={hero.subtitle}
          bodyText={hero.bodyText}
          backgroundImage={hero.backgroundImage}
          backgroundImageAlt={hero.backgroundImageAlt}
          ctaText={hero.ctaText}
          ctaUrl={hero.ctaUrl}
          ctaAriaLabel={hero.ctaAriaLabel}
          textAlignment={hero.textAlignment as 'left' | 'center' | 'right'}
          overlayOpacity={hero.overlayOpacity}
        />
      )}

      {/* Contact Info Section */}
      <section className="bg-ink-900 py-[60px] px-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] max-w-[800px]">
          {/* Address */}
          {settings?.address && (
            <div>
              <h3
                className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white mb-4"
                data-cms-entry="global-settings"
                data-cms-field="addressLabel"
              >
                {settings.addressLabel}
              </h3>
              <p
                className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white"
                data-cms-entry="global-settings"
                data-cms-field="address"
              >
                {settings.address.street}
                <br />
                {settings.address.city}, {settings.address.state} {settings.address.zip}
              </p>
            </div>
          )}

          {/* Contact */}
          {(settings?.phone || settings?.email) && (
            <div>
              <h3
                className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white mb-4"
                data-cms-entry="global-settings"
                data-cms-field="contactLabel"
              >
                {settings?.contactLabel}
              </h3>
              {settings?.phone && (
                <p
                  className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white"
                  data-cms-entry="global-settings"
                  data-cms-field="phone"
                >
                  {settings.phone}
                </p>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-pink-400 hover:text-off-white transition-colors"
                  data-cms-entry="global-settings"
                  data-cms-field="email"
                >
                  {settings.email}
                </a>
              )}
            </div>
          )}

          {/* Hours */}
          {settings?.hours && settings.hours.length > 0 && (
            <div>
              <h3
                className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white mb-4"
                data-cms-entry="global-settings"
                data-cms-field="hoursLabel"
              >
                {settings.hoursLabel}
              </h3>
              <div
                className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white"
                data-cms-entry="global-settings"
                data-cms-field="hours"
              >
                {settings.hours.map((h, i) => (
                  <p key={i}>
                    {h.closed
                      ? `${h.days} ${settings.closedDayLabel ? `(${settings.closedDayLabel})` : ''}`
                      : `${h.days} ${h.open} — ${h.close}`}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Reservation */}
          {settings?.reservationUrl && settings?.reservationsLabel && (
            <div>
              <h3
                className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white mb-4"
                data-cms-entry="global-settings"
                data-cms-field="reservationsLabel"
              >
                {settings.reservationsLabel}
              </h3>
              <a
                href={settings.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-gotham font-bold text-xs uppercase tracking-[0.36px] px-[18px] pt-[12px] pb-[14px] border border-off-white text-off-white hover:bg-off-white hover:text-ink-900 transition-colors"
                data-cms-entry="global-settings"
                data-cms-field="reserveButtonText"
              >
                {settings.reserveButtonText}
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
