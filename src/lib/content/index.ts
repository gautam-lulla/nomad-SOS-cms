/**
 * Content Abstraction Layer
 *
 * Fetches content from the CMS and transforms it to match
 * the existing JSON structure so components remain unchanged.
 */

import { getServerClient } from '../apollo-client';
import {
  GET_PAGE_CONTENT,
  GET_ALL_ENTRIES_BY_TYPE,
  GET_CONTENT_TYPE_BY_SLUG,
} from '../queries';

// Environment configuration
const CMS_ORG_ID = process.env.CMS_ORGANIZATION_ID || '';

// Cache for content type IDs (populated on first use)
const typeIdCache: Map<string, string> = new Map();

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

  const rawData = data.contentEntryBySlug.data || {};
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

  const entryData = data.contentEntryBySlug.data as {
    title: string;
    handle: string;
    handleUrl: string;
    images: Array<{ src: string; alt: string }>;
  };

  return entryData;
}

/**
 * Fetch menu content with full hierarchy
 * Returns data matching the original menu.json structure
 */
export async function getMenuContent(): Promise<{
  categories: string[];
  activeCategory: string;
  menuTitle: string;
  menuSubtitle: string;
  sections: Array<{
    name: string;
    items: Array<{
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

  // Build sections with their items
  const sectionsWithItems = sections.map(section => {
    const sectionItems = [...allItems]
      .filter(item => item.data.sectionSlug === section.slug)
      .sort((a, b) =>
        ((a.data.sortOrder as number) || 0) - ((b.data.sortOrder as number) || 0)
      )
      .map(item => ({
        name: item.data.name as string,
        price: item.data.price as string,
        description: (item.data.description as string) || '',
      }));

    return {
      name: section.data.name as string,
      items: sectionItems,
    };
  });

  return {
    categories: categories.map(c => c.data.name as string),
    activeCategory: (activeCategory?.data.name as string) || '',
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

  return (data?.contentEntries?.items || []).map(item => ({
    name: item.data.name as string,
    title: item.data.title as string,
    description: (item.data.description as string) || '',
    imageSrc: (item.data.imageSrc as string) || '',
  }));
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

  return (data?.contentEntries?.items || []).map(item => ({
    title: item.data.title as string,
    description: (item.data.description as string) || '',
    imageSrc: (item.data.imageSrc as string) || '',
  }));
}

// Helper function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
