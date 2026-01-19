/**
 * Content Abstraction Layer
 *
 * Fetches content from the CMS and transforms it to match
 * the existing JSON structure so components remain unchanged.
 */

import { getServerClient } from '../apollo-client';

// Cloudflare R2 CDN base URL
const CDN_BASE_URL = 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/nomad';

/**
 * Check if an object is an image object from the CMS inline editor.
 * Image objects have url/src and typically id, alt, filename.
 */
function isImageObject(obj: unknown): obj is { url?: string; src?: string } {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  // Must have url or src, and should have typical image fields
  return (typeof o.url === 'string' || typeof o.src === 'string') &&
    (o.id !== undefined || o.filename !== undefined || o.alt !== undefined);
}

/**
 * Transform local /images/ paths to Cloudflare CDN URLs.
 * Also extracts URL strings from image objects saved by the inline editor.
 * Recursively processes objects and arrays.
 */
function transformImageUrls<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // Transform /images/... paths to CDN URLs
    if (data.startsWith('/images/')) {
      return data.replace('/images/', `${CDN_BASE_URL}/`) as T;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => transformImageUrls(item)) as T;
  }

  if (typeof data === 'object') {
    // Check if this is an image object - extract URL directly
    if (isImageObject(data)) {
      const imageUrl = (data as { url?: string; src?: string }).url ||
                       (data as { url?: string; src?: string }).src || '';
      return imageUrl as T;
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      result[key] = transformImageUrls(value);
    }
    return result as T;
  }

  return data;
}
import {
  GET_PAGE_CONTENT,
  GET_ALL_ENTRIES_BY_TYPE,
  GET_CONTENT_TYPE_BY_SLUG,
} from '../queries';

// Environment configuration
const CMS_ORG_ID = process.env.CMS_ORGANIZATION_ID || '';

// Cache for content type IDs (populated on first use)
const typeIdCache: Map<string, string> = new Map();

// Type definitions for site settings
export interface NavigationLink {
  href: string;
  label: string;
}

export interface HoursEntry {
  days: string;
  time: string;
}

export interface ImageItem {
  src: string;
  alt: string;
}

export interface NotFoundContent {
  title: string;
  message: string;
  buttonText: string;
  buttonHref: string;
  galleryImages: ImageItem[];
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  navigation: {
    menuLabel: string;
    closeLabel: string;
    reserveButtonText: string;
    reserveButtonUrl: string;
    backgroundImage: string;
    links: NavigationLink[];
  };
  location: {
    name: string;
    address: string;
    phone: string;
  };
  hours: HoursEntry[];
  footer: {
    wordmarkImage: string;
    wordmarkAlt: string;
    newsletterPlaceholder: string;
    newsletterConsentText: string;
    links: NavigationLink[];
    legalLinks: NavigationLink[];
  };
  notFound: NotFoundContent;
}

// Type definitions for GraphQL responses
interface ContentTypeResponse {
  contentTypeBySlug?: {
    id: string;
    slug: string;
    name: string;
  };
}

interface ContentEntryResponse {
  contentEntryBySlug?: {
    id: string;
    slug: string;
    data: Record<string, unknown>;
  };
}

interface ContentEntriesResponse {
  contentEntries?: {
    items: Array<{
      id: string;
      slug: string;
      data: Record<string, unknown>;
    }>;
  };
}

/**
 * Get content type ID by slug (with caching)
 */
async function getContentTypeId(slug: string): Promise<string> {
  if (typeIdCache.has(slug)) {
    return typeIdCache.get(slug)!;
  }

  const client = getServerClient();
  const { data } = await client.query<ContentTypeResponse>({
    query: GET_CONTENT_TYPE_BY_SLUG,
    variables: { slug, organizationId: CMS_ORG_ID },
  });

  if (data?.contentTypeBySlug?.id) {
    typeIdCache.set(slug, data.contentTypeBySlug.id);
    return data.contentTypeBySlug.id;
  }

  throw new Error(`Content type not found: ${slug}`);
}

/**
 * Fetch page content by slug
 * Returns data matching the original JSON structure
 */
export async function getPageContent(pageSlug: string): Promise<Record<string, unknown>> {
  const client = getServerClient();
  const typeId = await getContentTypeId('nomad-page');

  const { data, error } = await client.query<ContentEntryResponse>({
    query: GET_PAGE_CONTENT,
    variables: {
      contentTypeId: typeId,
      organizationId: CMS_ORG_ID,
      slug: pageSlug,
    },
  });

  if (error || !data?.contentEntryBySlug) {
    console.error(`Failed to fetch page: ${pageSlug}`, error);
    return {};
  }

  const rawData = transformImageUrls(data.contentEntryBySlug.data || {});
  const mappedData: Record<string, unknown> = { ...rawData };

  // Only remap fields for the homepage, which uses *Section suffixed field names
  // Other pages (programming, private-events, etc.) use the direct field names
  if (pageSlug === 'homepage') {
    const fieldMappings: Record<string, string> = {
      intro: 'introSection',
      menu: 'menuSection',
      events: 'eventsSection',
      contact: 'contactSection',
    };

    for (const [cmsField, jsonField] of Object.entries(fieldMappings)) {
      if (cmsField in rawData) {
        mappedData[jsonField] = rawData[cmsField];
        delete mappedData[cmsField];
      }
    }
  }

  return mappedData;
}

/**
 * Fetch Instagram feed content
 */
export async function getInstagramContent(): Promise<{
  title: string;
  handle: string;
  handleUrl: string;
  images: Array<{ src: string; alt: string }>;
}> {
  const client = getServerClient();
  const typeId = await getContentTypeId('instagram-feed');

  const { data, error } = await client.query<ContentEntryResponse>({
    query: GET_PAGE_CONTENT,
    variables: {
      contentTypeId: typeId,
      organizationId: CMS_ORG_ID,
      slug: 'global-instagram',
    },
  });

  if (error || !data?.contentEntryBySlug) {
    console.error('Failed to fetch Instagram content', error);
    return {
      title: '',
      handle: '',
      handleUrl: '',
      images: [],
    };
  }

  const entryData = transformImageUrls(data.contentEntryBySlug.data) as {
    title: string;
    handle: string;
    handleUrl: string;
    images: Array<{ src: string; alt: string }>;
  };

  return entryData;
}

/**
 * Fetch menu content with full hierarchy
 * Returns data matching the original menu.json structure, with entry IDs for inline editing
 */
export async function getMenuContent(): Promise<{
  categories: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  activeCategory: string;
  activeCategoryId: string;
  menuTitle: string;
  menuSubtitle: string;
  sections: Array<{
    id: string;
    slug: string;
    name: string;
    items: Array<{
      id: string;
      slug: string;
      name: string;
      price: string;
      description: string;
    }>;
  }>;
}> {
  const client = getServerClient();

  // Fetch all content types we need
  const [categoryTypeId, sectionTypeId, itemTypeId] = await Promise.all([
    getContentTypeId('menu-category'),
    getContentTypeId('menu-section'),
    getContentTypeId('menu-item'),
  ]);

  // Fetch all categories
  const { data: categoriesData } = await client.query<ContentEntriesResponse>({
    query: GET_ALL_ENTRIES_BY_TYPE,
    variables: {
      filter: {
        contentTypeId: categoryTypeId,
        organizationId: CMS_ORG_ID,
        take: 100,
      },
    },
  });

  const categoriesItems = categoriesData?.contentEntries?.items || [];
  const categories = [...categoriesItems].sort((a, b) =>
    ((a.data.sortOrder as number) || 0) - ((b.data.sortOrder as number) || 0)
  );

  const activeCategory = categories.find(c => c.data.isActive) || categories[0];
  const activeCategorySlug = activeCategory
    ? slugify(activeCategory.data.name as string)
    : '';

  // Fetch sections for active category
  const { data: sectionsData } = await client.query<ContentEntriesResponse>({
    query: GET_ALL_ENTRIES_BY_TYPE,
    variables: {
      filter: {
        contentTypeId: sectionTypeId,
        organizationId: CMS_ORG_ID,
        take: 100,
      },
    },
  });

  const sectionsItems = sectionsData?.contentEntries?.items || [];
  const sections = [...sectionsItems]
    .filter(s => s.data.categorySlug === activeCategorySlug)
    .sort((a, b) =>
      ((a.data.sortOrder as number) || 0) - ((b.data.sortOrder as number) || 0)
    );

  // Fetch all menu items (CMS limits take to 100)
  const { data: itemsData } = await client.query<ContentEntriesResponse>({
    query: GET_ALL_ENTRIES_BY_TYPE,
    variables: {
      filter: {
        contentTypeId: itemTypeId,
        organizationId: CMS_ORG_ID,
        take: 100,
      },
    },
  });

  const allItems = itemsData?.contentEntries?.items || [];

  // Build sections with their items, including IDs for inline editing
  const sectionsWithItems = sections.map(section => {
    const sectionItems = [...allItems]
      .filter(item => item.data.sectionSlug === section.slug)
      .sort((a, b) =>
        ((a.data.sortOrder as number) || 0) - ((b.data.sortOrder as number) || 0)
      )
      .map(item => ({
        id: item.id,
        slug: item.slug,
        name: item.data.name as string,
        price: item.data.price as string,
        description: (item.data.description as string) || '',
      }));

    return {
      id: section.id,
      slug: section.slug,
      name: section.data.name as string,
      items: sectionItems,
    };
  });

  return {
    categories: categories.map(c => ({
      id: c.id,
      slug: c.slug,
      name: c.data.name as string,
    })),
    activeCategory: (activeCategory?.data.name as string) || '',
    activeCategoryId: activeCategory?.id || '',
    menuTitle: (activeCategory?.data.name as string) || '',
    menuSubtitle: (activeCategory?.data.subtitle as string) || '',
    sections: sectionsWithItems,
  };
}

/**
 * Fetch FAQ items
 */
export async function getFaqItems(): Promise<Array<{ question: string; answer: string }>> {
  const client = getServerClient();
  const typeId = await getContentTypeId('faq-item');

  const { data } = await client.query<ContentEntriesResponse>({
    query: GET_ALL_ENTRIES_BY_TYPE,
    variables: {
      filter: {
        contentTypeId: typeId,
        organizationId: CMS_ORG_ID,
        take: 100,
      },
    },
  });

  return (data?.contentEntries?.items || []).map(item => ({
    question: item.data.question as string,
    answer: item.data.answer as string,
  }));
}

/**
 * Fetch team members
 */
export async function getTeamMembers(): Promise<
  Array<{ name: string; title: string; description: string; imageSrc: string }>
> {
  const client = getServerClient();
  const typeId = await getContentTypeId('team-member');

  const { data } = await client.query<ContentEntriesResponse>({
    query: GET_ALL_ENTRIES_BY_TYPE,
    variables: {
      filter: {
        contentTypeId: typeId,
        organizationId: CMS_ORG_ID,
        take: 100,
      },
    },
  });

  return (data?.contentEntries?.items || []).map(item => {
    const transformed = transformImageUrls(item.data);
    return {
      name: transformed.name as string,
      title: transformed.title as string,
      description: (transformed.description as string) || '',
      imageSrc: (transformed.imageSrc as string) || '',
    };
  });
}

/**
 * Fetch events
 */
export async function getEvents(): Promise<
  Array<{ title: string; description: string; imageSrc: string }>
> {
  const client = getServerClient();
  const typeId = await getContentTypeId('event');

  const { data } = await client.query<ContentEntriesResponse>({
    query: GET_ALL_ENTRIES_BY_TYPE,
    variables: {
      filter: {
        contentTypeId: typeId,
        organizationId: CMS_ORG_ID,
        take: 100,
      },
    },
  });

  return (data?.contentEntries?.items || []).map(item => {
    const transformed = transformImageUrls(item.data);
    return {
      title: transformed.title as string,
      description: (transformed.description as string) || '',
      imageSrc: (transformed.imageSrc as string) || '',
    };
  });
}

// Helper function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Fetch site-wide settings (navigation, footer, location, hours)
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const client = getServerClient();

  try {
    const typeId = await getContentTypeId('site-settings');

    const { data, error } = await client.query<ContentEntryResponse>({
      query: GET_PAGE_CONTENT,
      variables: {
        contentTypeId: typeId,
        organizationId: CMS_ORG_ID,
        slug: 'global-settings',
      },
    });

    if (error || !data?.contentEntryBySlug) {
      console.warn('Site settings not found in CMS, using defaults');
      return getDefaultSiteSettings();
    }

    const settings = transformImageUrls(data.contentEntryBySlug.data) as unknown as SiteSettings;
    return settings;
  } catch (e) {
    console.warn('Failed to fetch site settings from CMS:', e);
    return getDefaultSiteSettings();
  }
}

/**
 * Default site settings fallback
 */
function getDefaultSiteSettings(): SiteSettings {
  return {
    siteName: "NoMad Wynwood",
    siteDescription: "The NoMad Bar in Miami",
    navigation: {
      menuLabel: "menu",
      closeLabel: "Close",
      reserveButtonText: "Reserve a Table",
      reserveButtonUrl: "#",
      backgroundImage: `${CDN_BASE_URL}/hero/nav-background.jpg`,
      links: [
        { href: "/", label: "Home" },
        { href: "/menu", label: "Menu" },
        { href: "/private-events", label: "Private Events" },
        { href: "/programming", label: "Programming" },
        { href: "/about", label: "About" },
        { href: "/getting-here", label: "Getting Here" },
      ],
    },
    location: {
      name: "the nomad bar",
      address: "280 NW 27th St, Miami, FL 33127, United States",
      phone: "+1-877-666-2312",
    },
    hours: [
      { days: "Tue-Fri", time: "11 AM — 10 PM" },
      { days: "Sat-Sun", time: "12 PM — 10 PM" },
      { days: "Mon", time: "(Closed)" },
    ],
    footer: {
      wordmarkImage: `${CDN_BASE_URL}/nomad-wynwood-wordmark-footer.svg`,
      wordmarkAlt: "The NoMad Bar",
      newsletterPlaceholder: "Please enter your email",
      newsletterConsentText: "I agree to the Privacy Policy",
      links: [
        { href: "/gift-cards", label: "Gift Cards" },
        { href: "/contact", label: "Contact us" },
        { href: "/faq", label: "FAQ" },
      ],
      legalLinks: [
        { href: "#", label: "Copyright © 2025" },
        { href: "/accessibility", label: "accessibility" },
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/privacy", label: "Privacy policy" },
        { href: "/careers", label: "careers" },
      ],
    },
    notFound: {
      title: "404",
      message: "Lost? Must Be the Cocktails",
      buttonText: "Take Me Home",
      buttonHref: "/",
      galleryImages: [
        { src: `${CDN_BASE_URL}/gallery/image-1.jpg`, alt: "Gallery 1" },
        { src: `${CDN_BASE_URL}/gallery/image-2.jpg`, alt: "Gallery 2" },
        { src: `${CDN_BASE_URL}/gallery/image-3.jpg`, alt: "Gallery 3" },
        { src: `${CDN_BASE_URL}/instagram/insta-1.jpg`, alt: "Gallery 4" },
        { src: `${CDN_BASE_URL}/instagram/insta-2.jpg`, alt: "Gallery 5" },
        { src: `${CDN_BASE_URL}/instagram/insta-3.jpg`, alt: "Gallery 6" },
      ],
    },
  };
}
