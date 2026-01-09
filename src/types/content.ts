// Link Types
export interface NavigationLink {
  href: string;
  label: string;
}

export interface FooterLink {
  href: string;
  label: string;
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
