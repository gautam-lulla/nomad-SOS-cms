import { getPublicClient } from '../apollo-client';
import { GET_CONTENT_ENTRY_BY_SLUG, GET_CONTENT_ENTRIES } from '../queries';

const ORG_ID = process.env.CMS_ORGANIZATION_ID || '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

// Content Type ID mapping (from content-model.md)
const CONTENT_TYPE_IDS: Record<string, string> = {
  'site-settings': 'c675b32e-649c-4c6b-94db-cb57224d1a9b',
  'navigation': '4744dd96-44f1-42e1-8b42-f7e437db2d35',
  'footer': '1ac54fb2-fed8-49d8-b483-2c1d6c1a9eff',
  'hero-section': 'f568e78c-1037-40d3-8a65-4f52685a1eb2',
  'content-section': 'bd2974d6-39ad-44bc-8beb-ee4b5c25811c',
  'gallery': '7e05102c-b270-45bd-8a34-e402d63e7852',
  'instagram-feed': '53f450dc-916c-4618-9388-e2b6cf05ab2e',
  'faq-item': '1cf0fa5e-59b3-46dc-9ea2-a45aee6b2ac3',
  'event': '23d0f666-0a0e-465f-80ba-6cf396c2447c',
  'menu-category': '3a4388ed-9fb2-4351-ba40-0c4d05c4b804',
  'award': '4db4496a-a5d8-4300-ad60-fba0202b2a7e',
  'page': '54d15929-4f6a-4939-9423-338d7f9fd21f',
};

// GraphQL response types
interface ContentEntryBySlugResponse {
  contentEntryBySlug: {
    id: string;
    slug: string;
    data: Record<string, unknown>;
  } | null;
}

interface ContentEntriesResponse {
  contentEntries: {
    items: Array<{
      id: string;
      slug: string;
      data: Record<string, unknown>;
    }>;
    pagination: {
      total: number;
      skip: number;
      take: number;
      hasMore: boolean;
    };
  };
}

/**
 * Check if an object is an inline editor image object.
 * The inline editor saves images as objects with {id, url, src, alt, filename}
 */
function isImageObject(obj: unknown): obj is { url?: string; src?: string } {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  // Must have url or src as a string, AND have at least one image-specific property
  return (
    (typeof o.url === 'string' || typeof o.src === 'string') &&
    (o.id !== undefined || o.filename !== undefined || o.alt !== undefined)
  );
}

/**
 * Transform image objects to plain URL strings.
 * The inline editor saves images as objects, but components expect string URLs.
 * This function recursively processes data to extract URLs from image objects.
 */
export function transformImageUrls<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') return data;

  if (Array.isArray(data)) {
    return data.map(transformImageUrls) as T;
  }

  if (typeof data === 'object') {
    // Check if this is an image object - extract URL
    if (isImageObject(data)) {
      return ((data as { url?: string; src?: string }).url ||
              (data as { url?: string; src?: string }).src || '') as T;
    }

    // Recursively process object properties
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      result[key] = transformImageUrls(value);
    }
    return result as T;
  }

  return data;
}

/**
 * Extract URL from MEDIA field (handles both string and array formats)
 */
export function extractMediaUrl(field: unknown): string | null {
  if (Array.isArray(field) && field.length > 0 && typeof field[0] === 'string') {
    return field[0];
  }
  if (typeof field === 'string' && field.length > 0) {
    return field;
  }
  return null;
}

/**
 * Build image array from individual MEDIA fields.
 * CMS stores images as individual fields (image1, image1Alt, image2, image2Alt...)
 * This function reconstructs them into an array for components.
 */
export function buildImageArray(
  data: Record<string, unknown>,
  prefix: string,
  count: number
): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = [];

  for (let i = 1; i <= count; i++) {
    const url = extractMediaUrl(data[`${prefix}${i}`]);
    const alt = (data[`${prefix}${i}Alt`] as string) || `${prefix} ${i}`;

    if (url) {
      images.push({ src: url, alt });
    }
  }

  return images;
}

/**
 * Fetch content entry by slug and content type.
 */
async function fetchEntry<T>(contentTypeSlug: string, slug: string): Promise<T | null> {
  const client = getPublicClient();
  const contentTypeId = CONTENT_TYPE_IDS[contentTypeSlug];

  if (!contentTypeId) {
    console.error(`Unknown content type: ${contentTypeSlug}`);
    return null;
  }

  try {
    const { data } = await client.query<ContentEntryBySlugResponse>({
      query: GET_CONTENT_ENTRY_BY_SLUG,
      variables: {
        slug,
        contentTypeId,
        organizationId: ORG_ID,
      },
    });

    if (!data?.contentEntryBySlug?.data) {
      return null;
    }

    return transformImageUrls(data.contentEntryBySlug.data) as T;
  } catch (error) {
    console.error(`Error fetching ${contentTypeSlug}/${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all entries of a content type.
 */
async function fetchEntries<T>(contentTypeSlug: string, limit = 100): Promise<T[]> {
  const client = getPublicClient();
  const contentTypeId = CONTENT_TYPE_IDS[contentTypeSlug];

  if (!contentTypeId) {
    console.error(`Unknown content type: ${contentTypeSlug}`);
    return [];
  }

  try {
    const { data } = await client.query<ContentEntriesResponse>({
      query: GET_CONTENT_ENTRIES,
      variables: {
        filter: {
          contentTypeId,
          organizationId: ORG_ID,
          take: limit,
        },
      },
    });

    if (!data?.contentEntries?.items) {
      return [];
    }

    return data.contentEntries.items.map((item) =>
      transformImageUrls(item.data)
    ) as T[];
  } catch (error) {
    console.error(`Error fetching ${contentTypeSlug} entries:`, error);
    return [];
  }
}

// ============================================================
// Global Content Fetchers
// ============================================================

export interface SiteSettings {
  siteName: string;
  siteDescription?: string;
  logoUrl: string;
  logoAlt: string;
  logoAltUrl?: string;
  logoAltAlt?: string;
  phone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  socialLinks?: Array<{
    platform: string;
    url: string;
    ariaLabel?: string;
  }>;
  instagramHandle?: string;
  reservationUrl?: string;
  hours?: Array<{
    days: string;
    open?: string | null;
    close?: string | null;
    closed?: boolean;
  }>;
  // UI Labels
  addressLabel?: string;
  contactLabel?: string;
  hoursLabel?: string;
  reservationsLabel?: string;
  reserveButtonText?: string;
  closedDayLabel?: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const data = await fetchEntry<SiteSettings>('site-settings', 'global-settings');
  if (!data) return null;

  // Extract first URL from array for logo fields
  return {
    ...data,
    logoUrl: extractMediaUrl(data.logoUrl) || '',
    logoAltUrl: data.logoAltUrl ? extractMediaUrl(data.logoAltUrl) || undefined : undefined,
  };
}

export interface Navigation {
  menuLinks: Array<{
    label: string;
    href: string;
    isExternal?: boolean;
  }>;
  ctaText?: string;
  ctaUrl?: string;
  ctaAriaLabel?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  // UI Labels
  menuButtonOpenLabel?: string;
  menuButtonCloseLabel?: string;
  locationSectionLabel?: string;
  hoursSectionLabel?: string;
}

export async function getNavigation(): Promise<Navigation | null> {
  const data = await fetchEntry<Navigation>('navigation', 'global-navigation');
  if (!data) return null;

  return {
    ...data,
    backgroundImage: data.backgroundImage ? extractMediaUrl(data.backgroundImage) || undefined : undefined,
  };
}

export interface Footer {
  column1Title?: string;
  column1Links?: Array<{ label: string; url?: string | null }>;
  column2Title?: string;
  column2Links?: Array<{ label: string; url?: string | null }>;
  column3Title?: string;
  column3Links?: Array<{ label: string; url?: string | null }>;
  newsletterHeading?: string;
  newsletterPlaceholder?: string;
  privacyPolicyLabel?: string;
  copyrightText?: string;
  legalLinks?: Array<{ label: string; url: string }>;
  footerLogo?: string;
  footerLogoAlt?: string;
  wordmark?: string;
  wordmarkAlt?: string;
}

export async function getFooter(): Promise<Footer | null> {
  const data = await fetchEntry<Footer>('footer', 'global-footer');
  if (!data) return null;

  return {
    ...data,
    footerLogo: data.footerLogo ? extractMediaUrl(data.footerLogo) || undefined : undefined,
    wordmark: data.wordmark ? extractMediaUrl(data.wordmark) || undefined : undefined,
  };
}

export interface InstagramFeed {
  title?: string;
  handle?: string;
  profileUrl?: string;
  sectionLabel?: string;
  images: Array<{ src: string; alt: string }>;
}

export async function getInstagramFeed(): Promise<InstagramFeed | null> {
  const data = await fetchEntry<Record<string, unknown>>('instagram-feed', 'global-instagram');
  if (!data) return null;

  return {
    title: data.title as string,
    handle: data.handle as string,
    profileUrl: data.profileUrl as string,
    sectionLabel: data.sectionLabel as string,
    images: buildImageArray(data, 'image', 4),
  };
}

// ============================================================
// Component Content Fetchers
// ============================================================

export interface HeroSection {
  variant: string;
  headline?: string;
  subtitle?: string;
  bodyText?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  backgroundVideo?: string;
  leftImage?: string;
  leftImageAlt?: string;
  rightImage?: string;
  rightImageAlt?: string;
  galleryImages?: Array<{ src: string; alt: string }>;
  logoImage?: string;
  logoImageAlt?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaAriaLabel?: string;
  textAlignment?: string;
  overlayOpacity?: number;
}

export async function getHeroSection(slug: string): Promise<HeroSection | null> {
  const data = await fetchEntry<Record<string, unknown>>('hero-section', slug);
  if (!data) return null;

  return {
    variant: data.variant as string,
    headline: data.headline as string,
    subtitle: data.subtitle as string,
    bodyText: data.bodyText as string,
    backgroundImage: extractMediaUrl(data.backgroundImage) || undefined,
    backgroundImageAlt: data.backgroundImageAlt as string,
    backgroundVideo: data.backgroundVideo as string,
    leftImage: extractMediaUrl(data.leftImage) || undefined,
    leftImageAlt: data.leftImageAlt as string,
    rightImage: extractMediaUrl(data.rightImage) || undefined,
    rightImageAlt: data.rightImageAlt as string,
    galleryImages: buildImageArray(data, 'galleryImage', 6),
    logoImage: extractMediaUrl(data.logoImage) || undefined,
    logoImageAlt: data.logoImageAlt as string,
    ctaText: data.ctaText as string,
    ctaUrl: data.ctaUrl as string,
    ctaAriaLabel: data.ctaAriaLabel as string,
    textAlignment: data.textAlignment as string,
    overlayOpacity: data.overlayOpacity as number,
  };
}

export interface ContentSection {
  variant: string;
  heading?: string;
  subheading?: string;
  bodyText?: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaAriaLabel?: string;
  backgroundColor?: string;
}

export async function getContentSection(slug: string): Promise<ContentSection | null> {
  const data = await fetchEntry<Record<string, unknown>>('content-section', slug);
  if (!data) return null;

  return {
    variant: data.variant as string,
    heading: data.heading as string,
    subheading: data.subheading as string,
    bodyText: data.bodyText as string,
    image: extractMediaUrl(data.image) || undefined,
    imageAlt: data.imageAlt as string,
    ctaText: data.ctaText as string,
    ctaUrl: data.ctaUrl as string,
    ctaAriaLabel: data.ctaAriaLabel as string,
    backgroundColor: data.backgroundColor as string,
  };
}

export interface Gallery {
  name: string;
  sectionLabel?: string;
  images: Array<{ src: string; alt: string }>;
}

export async function getGallery(slug: string): Promise<Gallery | null> {
  const data = await fetchEntry<Record<string, unknown>>('gallery', slug);
  if (!data) return null;

  return {
    name: data.name as string,
    sectionLabel: data.sectionLabel as string,
    images: buildImageArray(data, 'image', 8),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
}

export async function getAllFaqItems(): Promise<FaqItem[]> {
  return fetchEntries<FaqItem>('faq-item');
}

export interface Event {
  title: string;
  date: string;
  time?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  ticketUrl?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}

export async function getAllEvents(): Promise<Event[]> {
  const entries = await fetchEntries<Record<string, unknown>>('event');
  return entries.map(data => ({
    title: data.title as string,
    date: data.date as string,
    time: data.time as string,
    description: data.description as string,
    image: extractMediaUrl(data.image) || undefined,
    imageAlt: data.imageAlt as string,
    category: data.category as string,
    ticketUrl: data.ticketUrl as string,
    isFeatured: data.isFeatured as boolean,
    sortOrder: data.sortOrder as number,
  }));
}

export interface MenuCategory {
  name: string;
  availability?: string;
  items: Array<{
    name: string;
    description?: string;
    price?: string;
    dietary?: string[];
  }>;
  sortOrder?: number;
}

export async function getAllMenuCategories(): Promise<MenuCategory[]> {
  return fetchEntries<MenuCategory>('menu-category');
}

export interface Award {
  name: string;
  organization?: string;
  logo?: string;
  logoAlt?: string;
  year?: string;
  url?: string;
  sortOrder?: number;
}

export async function getAllAwards(): Promise<Award[]> {
  const entries = await fetchEntries<Record<string, unknown>>('award');
  return entries.map(data => ({
    name: data.name as string,
    organization: data.organization as string,
    logo: extractMediaUrl(data.logo) || undefined,
    logoAlt: data.logoAlt as string,
    year: data.year as string,
    url: data.url as string,
    sortOrder: data.sortOrder as number,
  }));
}

// ============================================================
// Page Content Fetcher
// ============================================================

export interface PageContent {
  title: string;
  urlSlug: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  pageAnnouncement?: string;
  heroSlug?: string;
  sections?: Array<{ type: string; slug: string }>;
  showInstagram?: boolean;
  showFaq?: boolean;
  faqCategory?: string;
  faqHeading?: string;
  // Team section
  showTeam?: boolean;
  teamHeading?: string;
  teamSubheading?: string;
  teamMembers?: Array<{
    name: string;
    title: string;
    bio?: string;
    image?: string;
    imageAlt?: string;
  }>;
  // Awards section
  showAwards?: boolean;
  awardsHeading?: string;
  // Page-specific labels
  eventsSectionLabel?: string;
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
  const data = await fetchEntry<Record<string, unknown>>('page', slug);
  if (!data) return null;

  return {
    title: data.title as string,
    urlSlug: data.urlSlug as string,
    metaTitle: data.metaTitle as string,
    metaDescription: data.metaDescription as string,
    ogImage: extractMediaUrl(data.ogImage) || undefined,
    ogImageAlt: data.ogImageAlt as string,
    canonicalUrl: data.canonicalUrl as string,
    noIndex: data.noIndex as boolean,
    pageAnnouncement: data.pageAnnouncement as string,
    heroSlug: data.heroSlug as string,
    sections: data.sections as Array<{ type: string; slug: string }>,
    showInstagram: data.showInstagram as boolean,
    showFaq: data.showFaq as boolean,
    faqCategory: data.faqCategory as string,
    faqHeading: data.faqHeading as string,
    // Team section
    showTeam: data.showTeam as boolean,
    teamHeading: data.teamHeading as string,
    teamSubheading: data.teamSubheading as string,
    teamMembers: data.teamMembers as Array<{
      name: string;
      title: string;
      bio?: string;
      image?: string;
      imageAlt?: string;
    }>,
    // Awards section
    showAwards: data.showAwards as boolean,
    awardsHeading: data.awardsHeading as string,
    eventsSectionLabel: data.eventsSectionLabel as string,
  };
}
