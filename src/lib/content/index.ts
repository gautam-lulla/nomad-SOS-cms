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
 * Inline editor saves images as objects with id/filename - these should be
 * converted to URL strings. Simple {src, alt} objects from arrays should NOT match.
 */
function isImageObject(obj: unknown): obj is { url?: string; src?: string } {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  // Only match inline editor image objects (have id OR filename)
  // Do NOT match simple {src, alt} pairs from arrays like instagramImages
  return (typeof o.url === 'string' || typeof o.src === 'string') &&
    (o.id !== undefined || o.filename !== undefined);
}

/**
 * Transform local /images/ paths to Cloudflare CDN URLs.
 * Also extracts URL strings from image objects saved by the inline editor.
 * Handles MEDIA fields which are arrays with single URL strings.
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
    // Handle MEDIA fields: arrays with single URL string - extract the URL
    if (data.length === 1 && typeof data[0] === 'string') {
      return transformImageUrls(data[0]) as T;
    }
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
 * Transform flat CMS data back to nested structure for components
 * This allows the CMS to use individual fields while keeping the component API stable
 */
function transformFlatToNested(flat: Record<string, unknown>): Record<string, unknown> {
  const nested: Record<string, unknown> = {};

  // Title
  if (flat.title) nested.title = flat.title;

  // Hero section - homepage variant (logo + two images)
  if (flat.heroLogoSrc || flat.heroLeftImage || flat.heroRightImage) {
    nested.hero = {
      logoSrc: flat.heroLogoSrc,
      leftImage: flat.heroLeftImage,
      rightImage: flat.heroRightImage,
    };
  }
  // Hero section - other pages variant (heading + single image)
  if (flat.heroHeading || flat.heroImageSrc || flat.heroParagraph || flat.heroButtonText) {
    nested.hero = {
      ...(nested.hero as object || {}),
      heading: flat.heroHeading,
      imageSrc: flat.heroImageSrc,
      paragraph: flat.heroParagraph || '',
      buttonText: flat.heroButtonText || '',
    };
  }

  // Intro section -> introSection for homepage, intro for programming page
  if (flat.introHeading || flat.introParagraph || flat.introButtonText) {
    nested.introSection = {
      heading: flat.introHeading,
      paragraph: flat.introParagraph,
      buttonText: flat.introButtonText,
      location: {
        label: flat.introLocationLabel,
        address: flat.introLocationAddress,
        phone: flat.introLocationPhone,
      },
      hours: {
        label: flat.introHoursLabel,
        times: flat.introHoursTimes,
      },
    };
  }

  // Intro for programming page (columns format)
  if (flat.introButtonText || flat.introColumn1 || flat.introColumn2) {
    nested.intro = {
      columns: [
        (flat.introColumn1 as string) || '',
        (flat.introColumn2 as string) || '',
      ].filter(Boolean),
      buttonText: flat.introButtonText,
    };
    // If no intro columns, provide defaults
    if (!nested.intro || !(nested.intro as { columns: string[] }).columns?.length) {
      (nested.intro as { columns: string[] }).columns = [
        'The NoMad Wynwood transforms every visit into an experience, from intimate dinners to unforgettable celebrations.',
        'Our culinary team crafts seasonal menus that honor tradition while embracing innovation.',
      ];
    }
  }

  // Menu section -> menuSection for components
  if (flat.menuHeading || flat.menuParagraph) {
    // Determine fullWidthImage - use CMS value or default
    const menuFullWidthImage = flat.menuFullWidthImageSrc
      ? { src: flat.menuFullWidthImageSrc, alt: flat.menuFullWidthImageAlt || 'Dining experience' }
      : { src: `${CDN_BASE_URL}/about/dining-table.jpg`, alt: 'Dining experience' };

    nested.menuSection = {
      heading: flat.menuHeading,
      paragraph: flat.menuParagraph,
      buttonText: flat.menuButtonText,
      buttonHref: flat.menuButtonHref,
      fullWidthImage: menuFullWidthImage,
    };
  }

  // Events section -> eventsSection for homepage, events array for programming
  if (flat.eventsHeading || flat.eventsParagraph) {
    nested.eventsSection = {
      heading: flat.eventsHeading,
      paragraph: flat.eventsParagraph,
      imageSrc: flat.eventsImageSrc,
      buttonText: flat.eventsButtonText,
      buttonHref: flat.eventsButtonHref,
    };
  }
  // Events array (for programming page)
  if (flat.events) {
    nested.events = flat.events;
  } else if (flat.heroHeading && !nested.events) {
    // Provide default events for programming page (using permanent CDN URLs)
    const CDN_EVENTS = {
      card1: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/f9b69cf9-c2ef-4609-81e0-c4187a571c53/original.jpg',
      card2: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/bef6acee-fa10-4817-b73b-9eed82b02902/original.jpg',
      card3: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/0c3ff6fc-71d1-4af9-be40-f701a9db1245/original.jpg',
    };
    nested.events = [
      {
        title: 'Live Music',
        description: 'Join us for live performances featuring local and international artists.',
        imageSrc: CDN_EVENTS.card1,
      },
      {
        title: 'Chef\'s Table',
        description: 'An exclusive dining experience with our executive chef.',
        imageSrc: CDN_EVENTS.card2,
      },
      {
        title: 'Wine Tastings',
        description: 'Explore curated selections from renowned vineyards.',
        imageSrc: CDN_EVENTS.card3,
      },
    ];
  }

  // Contact section -> contactSection for components
  if (flat.contactHeading || flat.contactParagraph) {
    nested.contactSection = {
      heading: flat.contactHeading,
      paragraph: flat.contactParagraph,
      imageSrc: flat.contactImageSrc,
      buttonText: flat.contactButtonText,
      buttonHref: flat.contactButtonHref,
    };
  }

  // Gallery - already array, pass through directly
  if (flat.gallery) {
    nested.gallery = flat.gallery;
  }

  // Instagram section
  if (flat.instagramTitle || flat.instagramHandle) {
    nested.instagram = {
      title: flat.instagramTitle,
      handle: flat.instagramHandle,
      handleUrl: flat.instagramHandleUrl,
      images: flat.instagramImages,
    };
  }

  // FAQ section
  if (flat.faqTitle || flat.faqItems) {
    nested.faq = {
      title: flat.faqTitle,
      items: flat.faqItems,
    };
  }

  // Heritage section
  if (flat.heritageTitle || flat.heritageParagraph) {
    nested.heritage = {
      title: flat.heritageTitle,
      paragraph: flat.heritageParagraph,
      imageSrc: flat.heritageImageSrc,
    };
  }

  // Team - already array
  if (flat.team) nested.team = flat.team;

  // Quote section
  if (flat.quoteHeading || flat.quoteParagraph) {
    nested.quote = {
      heading: flat.quoteHeading,
      paragraph: flat.quoteParagraph,
    };
  }

  // Awards section
  if (flat.awardsTitle || flat.awardsLogos) {
    nested.awards = {
      title: flat.awardsTitle,
      logos: flat.awardsLogos,
    };
  }

  // Info section
  if (flat.infoTitle || flat.infoParagraph || flat.infoAddress) {
    nested.info = {
      title: flat.infoTitle,
      paragraph: flat.infoParagraph,
      address: flat.infoAddress,
      phone: flat.infoPhone,
      email: flat.infoEmail,
      hours: flat.infoHours,
      mapUrl: flat.infoMapUrl,
    };
  }

  // Location section
  if (flat.locationTitle || flat.locationParagraph) {
    nested.location = {
      title: flat.locationTitle,
      paragraph: flat.locationParagraph,
      imageSrc: flat.locationImageSrc,
    };
  }

  // Form section
  if (flat.formTitle || flat.formParagraph) {
    nested.form = {
      title: flat.formTitle,
      paragraph: flat.formParagraph,
      fields: flat.formFields,
    };
  }

  // Menu page specific fields (pass through)
  if (flat.menuTitle) nested.menuTitle = flat.menuTitle;
  if (flat.menuSubtitle) nested.menuSubtitle = flat.menuSubtitle;
  if (flat.categories) nested.categories = flat.categories;
  if (flat.sections) nested.sections = flat.sections;
  if (flat.activeCategory) nested.activeCategory = flat.activeCategory;

  // Hero for menu/faq pages (uses gallery images as hero images)
  if (flat.gallery && !nested.hero) {
    const galleryImages = flat.gallery as Array<{ src: string; alt: string }>;
    if (galleryImages.length > 0) {
      nested.hero = {
        images: galleryImages.slice(0, 3), // Use first 3 gallery images for hero
        heading: flat.heroHeading || flat.title || '',
      };
    }
  }

  // Hero with heading but no images (FAQ page) - provide default images
  if ((flat.heroHeading || flat.title) && nested.hero && !(nested.hero as { images?: unknown }).images) {
    (nested.hero as { images: Array<{ src: string; alt: string }>; heading?: string }).images = [
      { src: `${CDN_BASE_URL}/gallery/image-1.jpg`, alt: 'NoMad Gallery 1' },
      { src: `${CDN_BASE_URL}/gallery/image-2.jpg`, alt: 'NoMad Gallery 2' },
      { src: `${CDN_BASE_URL}/gallery/image-3.jpg`, alt: 'NoMad Gallery 3' },
    ];
    (nested.hero as { heading?: string }).heading = (flat.heroHeading || flat.title) as string;
  }

  // If hero has heading but no images, add default images (for pages like FAQ)
  if (flat.heroHeading && !nested.hero) {
    nested.hero = {
      heading: flat.heroHeading as string,
      images: [
        { src: `${CDN_BASE_URL}/gallery/image-1.jpg`, alt: 'NoMad Gallery 1' },
        { src: `${CDN_BASE_URL}/gallery/image-2.jpg`, alt: 'NoMad Gallery 2' },
        { src: `${CDN_BASE_URL}/gallery/image-3.jpg`, alt: 'NoMad Gallery 3' },
      ],
    };
  }

  // Form section for private-events page
  if (flat.formTitle || flat.formFields) {
    nested.form = {
      title: flat.formTitle,
      fields: flat.formFields,
      // Provide defaults for additional form options
      additionalOptions: (flat.formAdditionalOptions as { label: string; options: string[] }) || {
        label: 'Additional options',
        options: ['Catering', 'Bar service', 'Live music', 'AV equipment'],
      },
      additionalInfo: (flat.formAdditionalInfo as { label: string; placeholder: string }) || {
        label: 'Anything else we should know?',
        placeholder: 'Tell us more about your event...',
      },
      submitText: (flat.formSubmitText as string) || 'Submit Request',
    };
  }

  // Info section for getting-here page
  if (flat.infoHours) {
    const infoHoursData = flat.infoHours as { label?: string; times?: string[] };
    nested.info = {
      ...(nested.info as object || {}),
      hours: infoHoursData,
      // Provide default transit info
      transit: {
        label: 'Public Transit',
        content: ['Bus routes 2, 9, and 10 have stops within walking distance.'],
      },
    };
  }

  // Hero for getting-here and contact pages (uses title field)
  if (flat.title && !nested.hero) {
    nested.hero = {
      title: flat.title as string,
      subtitle: '',
      phone: '+1-877-666-2312', // Default phone for contact page
    };
  }

  // Info for contact page (needs hours, location, socials)
  if (flat.infoHours && !flat.infoAddress) {
    const infoHoursData = flat.infoHours as { label?: string; times?: string[] };
    nested.info = {
      ...(nested.info as object || {}),
      hours: infoHoursData,
      location: {
        label: '02. location',
        address: ['280 NW 27th St', 'Miami, FL 33127'],
      },
      socials: {
        label: '03. follow us',
        links: [
          { name: 'Instagram', url: 'https://instagram.com/nomadwynwood' },
          { name: 'Facebook', url: 'https://facebook.com/nomadwynwood' },
        ],
      },
    };
  }

  // Location for getting-here page (defaults)
  if (!nested.location && flat.infoHours) {
    nested.location = {
      phone: '+1-877-666-2312',
      address: ['280 NW 27th St', 'Miami, FL 33127'],
    };
  }

  // Pagination - provide defaults for programming page
  if (flat.paginationItemsPerPage || flat.paginationCurrent || flat.paginationTotal) {
    nested.pagination = {
      itemsPerPage: flat.paginationItemsPerPage,
      current: (flat.paginationCurrent as number) || 1,
      total: (flat.paginationTotal as number) || 3,
    };
  } else if (nested.events) {
    // Provide default pagination for programming page
    nested.pagination = { current: 1, total: 3 };
  }

  return nested;
}

/**
 * Check if data is in flat CMS format (has flat field names like heroLogoSrc)
 * Also returns true for pages that need transformation (even if not strictly "flat")
 */
function isFlatFormat(data: Record<string, unknown>): boolean {
  const flatIndicators = [
    // Homepage fields
    'heroLogoSrc', 'heroLeftImage', 'heroHeading', 'introHeading', 'menuHeading',
    // Common flat fields
    'instagramTitle', 'faqTitle', 'faqItems',
    // Menu page (has gallery but no hero)
    'menuTitle', 'menuSubtitle', 'categories', 'sections',
    // Private events page
    'formTitle', 'formFields',
    // Getting here page
    'infoHours',
    // About page
    'heritageTitle', 'quoteHeading',
  ];
  return flatIndicators.some(key => key in data);
}

/**
 * Fetch page content by slug
 * Returns data matching the original JSON structure (nested) for components
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

  // Transform flat CMS data to nested format for components
  if (isFlatFormat(rawData)) {
    return transformFlatToNested(rawData);
  }

  // Legacy: handle old nested format (shouldn't be needed after migration)
  const mappedData: Record<string, unknown> = { ...rawData };

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
 * Transform flat site-settings data to nested format expected by components
 */
function transformFlatSiteSettings(flat: Record<string, unknown>): SiteSettings {
  const defaults = getDefaultSiteSettings();

  // Build navigation object
  const navigation = {
    menuLabel: (flat.navMenuLabel as string) || defaults.navigation.menuLabel,
    closeLabel: (flat.navCloseLabel as string) || defaults.navigation.closeLabel,
    reserveButtonText: (flat.navReserveButtonText as string) || defaults.navigation.reserveButtonText,
    reserveButtonUrl: (flat.navReserveButtonUrl as string) || defaults.navigation.reserveButtonUrl,
    backgroundImage: (flat.navBackgroundImage as string) || defaults.navigation.backgroundImage,
    links: (flat.navLinks as NavigationLink[]) || defaults.navigation.links,
  };

  // Build location object
  const location = {
    name: (flat.locationName as string) || defaults.location.name,
    address: (flat.locationAddress as string) || defaults.location.address,
    phone: (flat.locationPhone as string) || defaults.location.phone,
  };

  // Build footer object
  const footer = {
    wordmarkImage: (flat.footerWordmarkImage as string) || defaults.footer.wordmarkImage,
    wordmarkAlt: (flat.footerWordmarkAlt as string) || defaults.footer.wordmarkAlt,
    newsletterPlaceholder: (flat.footerNewsletterPlaceholder as string) || defaults.footer.newsletterPlaceholder,
    newsletterConsentText: (flat.footerNewsletterConsentText as string) || defaults.footer.newsletterConsentText,
    links: (flat.footerLinks as NavigationLink[]) || defaults.footer.links,
    legalLinks: (flat.footerLegalLinks as NavigationLink[]) || defaults.footer.legalLinks,
  };

  // Build notFound object with fallback to defaults
  const notFoundGalleryImages = (flat.notFoundGalleryImages as ImageItem[]);
  const notFound = {
    title: (flat.notFoundTitle as string) || defaults.notFound.title,
    message: (flat.notFoundMessage as string) || defaults.notFound.message,
    buttonText: (flat.notFoundButtonText as string) || defaults.notFound.buttonText,
    buttonHref: (flat.notFoundButtonHref as string) || defaults.notFound.buttonHref,
    galleryImages: (notFoundGalleryImages && notFoundGalleryImages.length > 0)
      ? notFoundGalleryImages
      : defaults.notFound.galleryImages,
  };

  return {
    siteName: (flat.siteName as string) || defaults.siteName,
    siteDescription: (flat.siteDescription as string) || defaults.siteDescription,
    navigation,
    location,
    hours: (flat.hours as HoursEntry[]) || defaults.hours,
    footer,
    notFound,
  };
}

/**
 * Check if site-settings data is in flat format
 */
function isFlatSiteSettings(data: Record<string, unknown>): boolean {
  const flatIndicators = ['navMenuLabel', 'navLinks', 'footerLinks', 'notFoundTitle', 'locationName'];
  return flatIndicators.some(key => key in data);
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

    const rawSettings = transformImageUrls(data.contentEntryBySlug.data);

    // Transform flat data to nested format if needed
    if (isFlatSiteSettings(rawSettings)) {
      return transformFlatSiteSettings(rawSettings);
    }

    // Legacy: already nested format
    const settings = rawSettings as unknown as SiteSettings;

    // Ensure notFound has galleryImages fallback
    if (!settings.notFound?.galleryImages?.length) {
      const defaults = getDefaultSiteSettings();
      settings.notFound = {
        ...settings.notFound,
        galleryImages: defaults.notFound.galleryImages,
      };
    }

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

// ============================================================================
// Dynamic Routing Support
// ============================================================================

/**
 * Page data structure for dynamic routing
 */
export interface PageData {
  id: string;
  slug: string;
  data: Record<string, unknown>;
}

/**
 * Fetch a page by its URL slug for dynamic routing.
 * Returns the page data with id, slug, and transformed content.
 * Returns null if page doesn't exist.
 */
export async function getPageBySlug(slug: string): Promise<PageData | null> {
  const client = getServerClient();

  try {
    const typeId = await getContentTypeId('nomad-page');

    const { data, error } = await client.query<ContentEntryResponse>({
      query: GET_PAGE_CONTENT,
      variables: {
        contentTypeId: typeId,
        organizationId: CMS_ORG_ID,
        slug,
      },
    });

    if (error || !data?.contentEntryBySlug) {
      console.error(`Page not found: ${slug}`, error);
      return null;
    }

    const rawData = transformImageUrls(data.contentEntryBySlug.data || {});

    // Transform flat CMS data to nested format for components
    const transformedData = isFlatFormat(rawData)
      ? transformFlatToNested(rawData)
      : rawData;

    return {
      id: data.contentEntryBySlug.id,
      slug: data.contentEntryBySlug.slug,
      data: transformedData,
    };
  } catch (e) {
    console.error(`Failed to fetch page: ${slug}`, e);
    return null;
  }
}

/**
 * Get all page slugs for static generation.
 * Used by generateStaticParams in the catch-all route.
 */
export async function getAllPageSlugs(): Promise<string[]> {
  const client = getServerClient();

  try {
    const typeId = await getContentTypeId('nomad-page');

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

    const slugs = data?.contentEntries?.items?.map((item) => item.slug) || [];

    // Filter out homepage (handled by dedicated route) and menu (application page)
    return slugs.filter((slug) => slug !== 'homepage' && slug !== 'menu');
  } catch (e) {
    console.error('Failed to fetch page slugs', e);
    return [];
  }
}
