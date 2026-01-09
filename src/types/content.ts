// Navigation Types
export interface NavigationLink {
  href: string;
  label: string;
}

export interface NavigationContent {
  links: NavigationLink[];
  reserveButtonText: string;
  location: {
    address: string;
    phone: string;
  };
  hours: string[];
}

// Footer Types
export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterContent {
  address: string[];
  hours: string[];
  links: FooterLink[];
  legalLinks: FooterLink[];
  newsletterPlaceholder: string;
  privacyLabel: string;
}

// Hero Types
export interface HeroContent {
  leftImage: string;
  rightImage: string;
  logoSrc?: string;
}

// Section Types
export interface SectionContent {
  heading: string;
  paragraphs: string[];
  buttonText?: string;
  buttonHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

// Gallery Types
export interface GalleryImage {
  src: string;
  alt?: string;
}

// Instagram Types
export interface InstagramContent {
  title: string;
  handle: string;
  handleUrl: string;
  images: GalleryImage[];
}

// Team Types
export interface TeamMember {
  name: string;
  title: string;
  description: string;
  imageSrc: string;
}

// FAQ Types
export interface FAQItem {
  question: string;
  answer: string;
}

// Page Types
export interface HomePageContent {
  hero: HeroContent;
  introSection: SectionContent & {
    showLocationHours: boolean;
  };
  gallery: GalleryImage[];
  menuSection: SectionContent & {
    fullWidthImage: string;
  };
  eventsSection: SectionContent;
  contactSection: SectionContent;
  instagram: InstagramContent;
}

export interface AboutPageContent {
  heroHeading: string;
  heroImage: string;
  heritageSection: SectionContent;
  quote: {
    heading: string;
    paragraph: string;
  };
  team: TeamMember[];
  fullWidthImage: string;
  awards: {
    title: string;
    logos: GalleryImage[];
  };
  faq: FAQItem[];
  instagram: InstagramContent;
}

export interface MetadataContent {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  pages: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
}
