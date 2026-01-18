import { getSiteSettings } from "@/lib/content";
import { Footer } from "./Footer";

interface SiteFooterProps {
  className?: string;
}

export async function SiteFooter({ className }: SiteFooterProps) {
  const settings = await getSiteSettings();

  return (
    <Footer
      className={className}
      location={settings.location}
      hours={settings.hours}
      wordmarkImage={settings.footer.wordmarkImage}
      wordmarkAlt={settings.footer.wordmarkAlt}
      newsletterPlaceholder={settings.footer.newsletterPlaceholder}
      newsletterConsentText={settings.footer.newsletterConsentText}
      links={settings.footer.links}
      legalLinks={settings.footer.legalLinks}
    />
  );
}
