import { getSiteSettings } from "@/lib/content";
import { Navigation } from "./Navigation";

interface SiteNavigationProps {
  className?: string;
}

export async function SiteNavigation({ className }: SiteNavigationProps) {
  const settings = await getSiteSettings();

  return (
    <Navigation
      className={className}
      links={settings.navigation.links}
      location={settings.location}
      hours={settings.hours}
      menuLabel={settings.navigation.menuLabel}
      closeLabel={settings.navigation.closeLabel}
      reserveButtonText={settings.navigation.reserveButtonText}
      reserveButtonUrl={settings.navigation.reserveButtonUrl}
      backgroundImage={settings.navigation.backgroundImage}
    />
  );
}
