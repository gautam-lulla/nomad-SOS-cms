/**
 * Template Types
 *
 * Defines the data structures expected by each page template.
 * These match the existing page content structures from the CMS.
 */

// Common types
export interface ImageItem {
  src: string;
  alt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  items: FAQItem[];
}

export interface InstagramContent {
  title: string;
  handle: string;
  handleUrl: string;
  images: ImageItem[];
}

// Base props that all templates receive
export interface BaseTemplateProps {
  slug: string;
  instagramContent: InstagramContent;
}

// About Page
export interface AboutPageContent {
  hero: { heading: string; imageSrc: string };
  heritage: { title: string; paragraph: string; imageSrc: string };
  quote: { heading: string; paragraph: string };
  fullWidthImage?: { src: string; alt: string };
  team: Array<{ name: string; title: string; description: string; imageSrc: string }>;
  awards: { title: string; logos: ImageItem[] };
  faq: FAQSection;
}

export interface AboutTemplateProps extends BaseTemplateProps {
  pageContent: AboutPageContent;
}

// FAQ Page
export interface FAQPageContent {
  hero: { heading: string; images: ImageItem[] };
  faq: { items: FAQItem[] };
}

export interface FAQTemplateProps extends BaseTemplateProps {
  pageContent: FAQPageContent;
}

// Contact Page
export interface ContactPageContent {
  hero: { title: string; phone: string };
  info: {
    hours: { label: string; times: string[] };
    location: { label: string; address: string[] };
    socials: { label: string; links: Array<{ name: string; url: string }> };
  };
  gallery: ImageItem[];
  faq: FAQSection;
}

export interface ContactTemplateProps extends BaseTemplateProps {
  pageContent: ContactPageContent;
}

// Getting Here Page
export interface GettingHerePageContent {
  hero: { title: string; subtitle?: string };
  location: { phone: string; address: string[] };
  info: {
    hours: { label: string; times: string[] };
    transit?: { label: string; content: string[] };
  };
  gallery: ImageItem[];
  map?: {
    labels: Array<{
      text: string;
      position: { top?: string; bottom?: string; left?: string; right?: string };
    }>;
  };
  faq: FAQSection;
}

export interface GettingHereTemplateProps extends BaseTemplateProps {
  pageContent: GettingHerePageContent;
  siteSettings?: { footer?: { wordmarkImage?: string; wordmarkAlt?: string } };
}

// Programming Page
export interface ProgrammingPageContent {
  hero: { heading: string; imageSrc: string };
  intro: { columns: string[]; buttonText: string };
  events: Array<{ title: string; description: string; imageSrc: string }>;
  pagination: { current: number; total: number };
  faq: FAQSection;
}

export interface ProgrammingTemplateProps extends BaseTemplateProps {
  pageContent: ProgrammingPageContent;
}

// Private Events Page
export interface PrivateEventsPageContent {
  hero: { heading: string; paragraph: string; buttonText: string };
  gallery: ImageItem[];
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
  faq: FAQSection;
}

export interface PrivateEventsTemplateProps extends BaseTemplateProps {
  pageContent: PrivateEventsPageContent;
}

// Homepage (kept for completeness, though it has a dedicated route)
export interface HomepageContent {
  hero: { leftImage: string; rightImage: string; logoSrc: string };
  introSection: {
    heading: string;
    paragraph: string;
    buttonText: string;
    location: { address: string; phone: string };
    hours: { times: string[] };
  };
  gallery: ImageItem[];
  menuSection: {
    heading: string;
    paragraph: string;
    buttonText: string;
    buttonHref: string;
    fullWidthImage?: { src: string; alt: string };
  };
  eventsSection: {
    heading: string;
    paragraph: string;
    buttonText: string;
    buttonHref: string;
    imageSrc: string;
  };
  contactSection: {
    heading: string;
    paragraph: string;
    buttonText: string;
    buttonHref: string;
    imageSrc: string;
  };
}

export interface HomepageTemplateProps extends BaseTemplateProps {
  pageContent: HomepageContent;
}

// Union type for all page content
export type PageContent =
  | AboutPageContent
  | FAQPageContent
  | ContactPageContent
  | GettingHerePageContent
  | ProgrammingPageContent
  | PrivateEventsPageContent
  | HomepageContent;

// Template name type
export type TemplateName =
  | 'about'
  | 'faq'
  | 'contact'
  | 'getting-here'
  | 'programming'
  | 'private-events'
  | 'homepage';
