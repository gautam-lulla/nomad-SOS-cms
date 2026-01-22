import { Suspense } from 'react';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { InlineEditorLoader } from '@/components/InlineEditorLoader';
import { getSiteSettings, getNavigation, getFooter } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings?.siteName || 'NoMad Wynwood',
      template: `%s | ${settings?.siteName || 'NoMad Wynwood'}`,
    },
    description: settings?.siteDescription || 'Experience exceptional dining at NoMad Wynwood',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch global content
  const [settings, navigation, footer] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getFooter(),
  ]);

  return (
    <html lang="en">
      <head>
        {/* Load fonts via CSS - fallback to system fonts */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-sabon: 'Georgia', 'Times New Roman', serif;
                --font-gotham: 'system-ui', 'Helvetica Neue', sans-serif;
              }
            `,
          }}
        />
      </head>
      <body className="bg-ink-900 text-off-white min-h-screen">
        {/* Navigation */}
        {settings && navigation && (
          <Navigation
            logoUrl={settings.logoUrl}
            logoAlt={settings.logoAlt || settings.siteName}
            menuLinks={navigation.menuLinks || []}
            ctaText={navigation.ctaText}
            ctaUrl={navigation.ctaUrl}
            ctaAriaLabel={navigation.ctaAriaLabel}
            backgroundImage={navigation.backgroundImage}
            backgroundImageAlt={navigation.backgroundImageAlt}
            address={
              settings.address
                ? `${settings.address.street}\n${settings.address.city}, ${settings.address.state} ${settings.address.zip}`
                : undefined
            }
            phone={settings.phone}
            hours={settings.hours}
            menuButtonOpenLabel={navigation.menuButtonOpenLabel}
            menuButtonCloseLabel={navigation.menuButtonCloseLabel}
            locationSectionLabel={navigation.locationSectionLabel}
            hoursSectionLabel={navigation.hoursSectionLabel}
            closedDayLabel={settings.closedDayLabel}
          />
        )}

        {/* Main Content */}
        <main className="pt-[110px] max-w-page mx-auto">{children}</main>

        {/* Footer */}
        {footer && (
          <Footer
            column1Links={footer.column1Links}
            column2Links={footer.column2Links}
            column3Links={footer.column3Links}
            newsletterHeading={footer.newsletterHeading}
            newsletterPlaceholder={footer.newsletterPlaceholder}
            privacyPolicyLabel={footer.privacyPolicyLabel}
            copyrightText={footer.copyrightText}
            legalLinks={footer.legalLinks}
            footerLogo={footer.footerLogo}
            footerLogoAlt={footer.footerLogoAlt}
            wordmark={footer.wordmark}
            wordmarkAlt={footer.wordmarkAlt}
          />
        )}

        {/* Inline Editor */}
        <Suspense fallback={null}>
          <InlineEditorLoader orgSlug="spherical-hospitality" />
        </Suspense>
      </body>
    </html>
  );
}
