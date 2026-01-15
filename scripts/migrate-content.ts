/**
 * Content Migration Script
 *
 * Migrates content from local JSON files to the headless CMS.
 *
 * Usage:
 *   npx ts-node --esm scripts/migrate-content.ts
 *
 * Prerequisites:
 *   - CMS backend running at http://localhost:3001
 *   - Dev user created (dev@sphereos.local / devpassword123)
 */

import { ApolloClient, InMemoryCache, HttpLink, gql, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as fs from 'fs';
import * as path from 'path';

const CMS_URL = 'http://localhost:3001/graphql';
const DEV_EMAIL = 'dev@sphereos.local';
const DEV_PASSWORD = 'devpassword123';
const ORG_SLUG = 'spherical-hospitality';

// ============================================================================
// GraphQL Mutations & Queries
// ============================================================================

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user { id email }
    }
  }
`;

const GET_ORGANIZATION = gql`
  query GetOrg($slug: String!) {
    organizationBySlug(slug: $slug) {
      id
      slug
      name
    }
  }
`;

const GET_CONTENT_TYPE_BY_SLUG = gql`
  query GetContentType($slug: String!, $organizationId: ID!) {
    contentTypeBySlug(slug: $slug, organizationId: $organizationId) {
      id
      slug
      name
    }
  }
`;

const CREATE_CONTENT_TYPE = gql`
  mutation CreateContentType($input: CreateContentTypeInput!) {
    createContentType(input: $input) {
      id
      slug
      name
    }
  }
`;

const CREATE_CONTENT_ENTRY = gql`
  mutation CreateContentEntry($input: CreateContentEntryInput!) {
    createContentEntry(input: $input) {
      id
      slug
    }
  }
`;

const GET_CONTENT_ENTRY_BY_SLUG = gql`
  query GetEntry($contentTypeId: ID!, $organizationId: ID!, $slug: String!) {
    contentEntryBySlug(
      contentTypeId: $contentTypeId
      organizationId: $organizationId
      slug: $slug
    ) {
      id
      slug
    }
  }
`;

// ============================================================================
// Content Type Definitions
// ============================================================================

const CONTENT_TYPES = [
  {
    slug: 'faq-item',
    name: 'FAQ Item',
    description: 'Question and answer pair',
    fields: [
      { slug: 'question', name: 'Question', type: 'TEXT', required: true },
      { slug: 'answer', name: 'Answer', type: 'RICH_TEXT', required: true },
    ],
  },
  {
    slug: 'team-member',
    name: 'Team Member',
    description: 'Staff member profile',
    fields: [
      { slug: 'name', name: 'Name', type: 'TEXT', required: true },
      { slug: 'title', name: 'Title', type: 'TEXT', required: true },
      { slug: 'description', name: 'Description', type: 'RICH_TEXT' },
      { slug: 'imageSrc', name: 'Image URL', type: 'TEXT' },
    ],
  },
  {
    slug: 'event',
    name: 'Event',
    description: 'Event listing',
    fields: [
      { slug: 'title', name: 'Title', type: 'TEXT', required: true },
      { slug: 'description', name: 'Description', type: 'RICH_TEXT' },
      { slug: 'imageSrc', name: 'Image URL', type: 'TEXT' },
      { slug: 'date', name: 'Date', type: 'DATE' },
    ],
  },
  {
    slug: 'instagram-feed',
    name: 'Instagram Feed',
    description: 'Global Instagram section content',
    fields: [
      { slug: 'title', name: 'Title', type: 'TEXT', required: true },
      { slug: 'handle', name: 'Handle', type: 'TEXT', required: true },
      { slug: 'handleUrl', name: 'Handle URL', type: 'TEXT', required: true },
      { slug: 'images', name: 'Images', type: 'JSON' },
    ],
  },
  {
    slug: 'menu-item',
    name: 'Menu Item',
    description: 'Individual menu item',
    fields: [
      { slug: 'name', name: 'Name', type: 'TEXT', required: true },
      { slug: 'price', name: 'Price', type: 'TEXT', required: true },
      { slug: 'description', name: 'Description', type: 'TEXT' },
      { slug: 'sortOrder', name: 'Sort Order', type: 'NUMBER' },
      { slug: 'sectionSlug', name: 'Section Slug', type: 'TEXT' },
      { slug: 'categorySlug', name: 'Category Slug', type: 'TEXT' },
    ],
  },
  {
    slug: 'menu-section',
    name: 'Menu Section',
    description: 'Group of menu items (e.g., Appetizers)',
    fields: [
      { slug: 'name', name: 'Name', type: 'TEXT', required: true },
      { slug: 'sortOrder', name: 'Sort Order', type: 'NUMBER' },
      { slug: 'categorySlug', name: 'Category Slug', type: 'TEXT' },
    ],
  },
  {
    slug: 'menu-category',
    name: 'Menu Category',
    description: 'Menu category (e.g., Brunch, All Day)',
    fields: [
      { slug: 'name', name: 'Name', type: 'TEXT', required: true },
      { slug: 'subtitle', name: 'Subtitle', type: 'TEXT' },
      { slug: 'sortOrder', name: 'Sort Order', type: 'NUMBER' },
      { slug: 'isActive', name: 'Is Active', type: 'BOOLEAN' },
    ],
  },
  {
    slug: 'nomad-page',
    name: 'NoMad Page',
    description: 'Generic page with flexible content blocks',
    fields: [
      { slug: 'title', name: 'Title', type: 'TEXT', required: true },
      { slug: 'hero', name: 'Hero Section', type: 'JSON' },
      { slug: 'introSection', name: 'Intro Section', type: 'JSON' },
      { slug: 'gallery', name: 'Gallery Images', type: 'JSON' },
      { slug: 'sections', name: 'Content Sections', type: 'JSON' },
      { slug: 'faq', name: 'FAQ Section', type: 'JSON' },
      { slug: 'form', name: 'Form Configuration', type: 'JSON' },
      { slug: 'location', name: 'Location Info', type: 'JSON' },
      { slug: 'info', name: 'Info Section', type: 'JSON' },
      { slug: 'heritage', name: 'Heritage Section', type: 'JSON' },
      { slug: 'quote', name: 'Quote Section', type: 'JSON' },
      { slug: 'awards', name: 'Awards Section', type: 'JSON' },
      { slug: 'team', name: 'Team Section', type: 'JSON' },
      { slug: 'events', name: 'Events Section', type: 'JSON' },
      { slug: 'menu', name: 'Menu Section', type: 'JSON' },
      { slug: 'contact', name: 'Contact Section', type: 'JSON' },
      { slug: 'pagination', name: 'Pagination', type: 'JSON' },
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

function createClient(token?: string) {
  const httpLink = new HttpLink({ uri: CMS_URL, fetch });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  }));

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache' },
      mutate: { fetchPolicy: 'no-cache' },
    },
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================================
// Main Migration Functions
// ============================================================================

async function login(): Promise<string> {
  console.log('Logging in to CMS...');
  const client = createClient();

  const { data, errors } = await client.mutate({
    mutation: LOGIN,
    variables: { email: DEV_EMAIL, password: DEV_PASSWORD },
  });

  if (errors || !data?.login?.accessToken) {
    throw new Error(`Login failed: ${errors?.[0]?.message || 'Unknown error'}`);
  }

  console.log(`  Logged in as ${data.login.user.email}`);
  return data.login.accessToken;
}

async function getOrganization(client: ApolloClient<unknown>): Promise<string> {
  console.log(`Getting organization: ${ORG_SLUG}...`);

  const { data, errors } = await client.query({
    query: GET_ORGANIZATION,
    variables: { slug: ORG_SLUG },
  });

  if (errors || !data?.organizationBySlug) {
    throw new Error(`Organization not found: ${errors?.[0]?.message || ORG_SLUG}`);
  }

  console.log(`  Found organization: ${data.organizationBySlug.name} (${data.organizationBySlug.id})`);
  return data.organizationBySlug.id;
}

async function createContentTypes(
  client: ApolloClient<unknown>,
  orgId: string
): Promise<Map<string, string>> {
  console.log('\nCreating content types...');
  const typeIds = new Map<string, string>();

  for (const typeDef of CONTENT_TYPES) {
    // Check if type already exists
    const { data: existing } = await client.query({
      query: GET_CONTENT_TYPE_BY_SLUG,
      variables: { slug: typeDef.slug, organizationId: orgId },
    });

    if (existing?.contentTypeBySlug) {
      console.log(`  [SKIP] ${typeDef.name} already exists`);
      typeIds.set(typeDef.slug, existing.contentTypeBySlug.id);
      continue;
    }

    // Create the content type
    const { data, errors } = await client.mutate({
      mutation: CREATE_CONTENT_TYPE,
      variables: {
        input: {
          organizationId: orgId,
          slug: typeDef.slug,
          name: typeDef.name,
          description: typeDef.description,
          fields: typeDef.fields,
        },
      },
    });

    if (errors) {
      console.error(`  [ERROR] Failed to create ${typeDef.name}: ${errors[0].message}`);
      continue;
    }

    console.log(`  [CREATE] ${typeDef.name} (${data.createContentType.id})`);
    typeIds.set(typeDef.slug, data.createContentType.id);
  }

  return typeIds;
}

async function createEntry(
  client: ApolloClient<unknown>,
  typeId: string,
  orgId: string,
  slug: string,
  data: Record<string, unknown>
): Promise<string | null> {
  // Check if entry already exists
  const { data: existing } = await client.query({
    query: GET_CONTENT_ENTRY_BY_SLUG,
    variables: { contentTypeId: typeId, organizationId: orgId, slug },
  });

  if (existing?.contentEntryBySlug) {
    return existing.contentEntryBySlug.id;
  }

  // Create new entry
  const { data: result, errors } = await client.mutate({
    mutation: CREATE_CONTENT_ENTRY,
    variables: {
      input: {
        contentTypeId: typeId,
        organizationId: orgId,
        slug,
        data,
      },
    },
  });

  if (errors) {
    console.error(`    [ERROR] ${slug}: ${errors[0].message}`);
    return null;
  }

  return result.createContentEntry.id;
}

async function migrateInstagram(
  client: ApolloClient<unknown>,
  typeId: string,
  orgId: string
): Promise<void> {
  console.log('\nMigrating Instagram feed...');

  const contentPath = path.join(process.cwd(), 'src/content/global/instagram.json');
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  const id = await createEntry(client, typeId, orgId, 'global-instagram', content);
  console.log(`  [${id ? 'OK' : 'SKIP'}] global-instagram`);
}

async function migrateMenu(
  client: ApolloClient<unknown>,
  typeIds: Map<string, string>,
  orgId: string
): Promise<void> {
  console.log('\nMigrating menu content...');

  const contentPath = path.join(process.cwd(), 'src/content/pages/menu.json');
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  const categoryTypeId = typeIds.get('menu-category')!;
  const sectionTypeId = typeIds.get('menu-section')!;
  const itemTypeId = typeIds.get('menu-item')!;

  // Create categories
  for (let i = 0; i < content.categories.length; i++) {
    const categoryName = content.categories[i];
    const categorySlug = slugify(categoryName);
    const isActive = categoryName === content.activeCategory;

    await createEntry(client, categoryTypeId, orgId, categorySlug, {
      name: categoryName,
      subtitle: isActive ? content.menuSubtitle : '',
      sortOrder: i,
      isActive,
    });
    console.log(`  [CATEGORY] ${categoryName}`);
  }

  // Create sections and items for the active category
  if (content.sections) {
    for (let i = 0; i < content.sections.length; i++) {
      const section = content.sections[i];
      const sectionSlug = slugify(`${content.activeCategory}-${section.name}`);

      await createEntry(client, sectionTypeId, orgId, sectionSlug, {
        name: section.name,
        sortOrder: i,
        categorySlug: slugify(content.activeCategory),
      });
      console.log(`  [SECTION] ${section.name}`);

      // Create items
      if (section.items) {
        for (let j = 0; j < section.items.length; j++) {
          const item = section.items[j];
          const itemSlug = slugify(`${sectionSlug}-${item.name}`);

          await createEntry(client, itemTypeId, orgId, itemSlug, {
            name: item.name,
            price: item.price,
            description: item.description || '',
            sortOrder: j,
            sectionSlug,
            categorySlug: slugify(content.activeCategory),
          });
          console.log(`    [ITEM] ${item.name}`);
        }
      }
    }
  }
}

async function migratePages(
  client: ApolloClient<unknown>,
  typeId: string,
  orgId: string
): Promise<void> {
  console.log('\nMigrating page content...');

  const pagesDir = path.join(process.cwd(), 'src/content/pages');
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const slug = file.replace('.json', '');
    const contentPath = path.join(pagesDir, file);
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

    // Map JSON structure to page fields
    const pageData: Record<string, unknown> = {
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
    };

    // Copy all top-level sections as JSON fields
    const sectionKeys = [
      'hero', 'introSection', 'gallery', 'sections', 'faq', 'form',
      'location', 'info', 'heritage', 'quote', 'awards', 'team',
      'events', 'menu', 'contact', 'pagination', 'categories',
      'activeCategory', 'menuTitle', 'menuSubtitle', 'eventsSection',
      'contactSection', 'menuSection', 'awardSection', 'quoteSection'
    ];

    for (const key of sectionKeys) {
      if (content[key] !== undefined) {
        // Map to the correct field name
        const fieldKey = key.replace(/Section$/, '');
        pageData[fieldKey] = content[key];
      }
    }

    const id = await createEntry(client, typeId, orgId, slug, pageData);
    console.log(`  [${id ? 'OK' : 'SKIP'}] ${slug}`);
  }
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('NoMad Wynwood Content Migration');
  console.log('='.repeat(60));

  try {
    // Step 1: Login
    const token = await login();
    const client = createClient(token);

    // Step 2: Get organization
    const orgId = await getOrganization(client);

    // Step 3: Create content types
    const typeIds = await createContentTypes(client, orgId);

    // Step 4: Migrate content
    const instagramTypeId = typeIds.get('instagram-feed');
    const pageTypeId = typeIds.get('nomad-page');

    if (instagramTypeId) {
      await migrateInstagram(client, instagramTypeId, orgId);
    }

    await migrateMenu(client, typeIds, orgId);

    if (pageTypeId) {
      await migratePages(client, pageTypeId, orgId);
    }

    // Output configuration
    console.log('\n' + '='.repeat(60));
    console.log('Migration Complete!');
    console.log('='.repeat(60));
    console.log('\nAdd these to your .env.local:\n');
    console.log(`NEXT_PUBLIC_CMS_GRAPHQL_URL=http://localhost:3001/graphql`);
    console.log(`CMS_ORGANIZATION_ID=${orgId}`);
    for (const [slug, id] of typeIds) {
      const envKey = `CMS_${slug.toUpperCase().replace(/-/g, '_')}_TYPE_ID`;
      console.log(`${envKey}=${id}`);
    }

  } catch (error) {
    console.error('\nMigration failed:', error);
    process.exit(1);
  }
}

main();
