/**
 * Content Migration Script (ESM JavaScript)
 *
 * Migrates content from local JSON files to the headless CMS.
 *
 * Usage:
 *   node scripts/migrate-content.mjs
 *
 * Prerequisites:
 *   - CMS backend running at http://localhost:3001
 *   - Dev user created (dev@sphereos.local / devpassword123)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CMS_URL = 'http://localhost:3001/graphql';
const DEV_EMAIL = 'dev@sphereos.local';
const DEV_PASSWORD = 'password123';
const ORG_SLUG = 'spherical-hospitality';

// ============================================================================
// GraphQL Queries
// ============================================================================

const LOGIN = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user { id email }
    }
  }
`;

const GET_ORGANIZATION = `
  query GetOrg($slug: String!) {
    organizationBySlug(slug: $slug) {
      id
      slug
      name
    }
  }
`;

const GET_CONTENT_TYPE_BY_SLUG = `
  query GetContentType($slug: String!, $organizationId: ID!) {
    contentTypeBySlug(slug: $slug, organizationId: $organizationId) {
      id
      slug
      name
    }
  }
`;

const CREATE_CONTENT_TYPE = `
  mutation CreateContentType($input: CreateContentTypeInput!) {
    createContentType(input: $input) {
      id
      slug
      name
    }
  }
`;

const CREATE_CONTENT_ENTRY = `
  mutation CreateContentEntry($input: CreateContentEntryInput!) {
    createContentEntry(input: $input) {
      id
      slug
    }
  }
`;

const GET_CONTENT_ENTRY_BY_SLUG = `
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

async function graphqlRequest(query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(CMS_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================================
// Main Migration Functions
// ============================================================================

async function login() {
  console.log('Logging in to CMS...');
  const data = await graphqlRequest(LOGIN, {
    input: {
      email: DEV_EMAIL,
      password: DEV_PASSWORD,
    },
  });

  console.log(`  Logged in as ${data.login.user.email}`);
  return data.login.accessToken;
}

async function getOrganization(token) {
  console.log(`Getting organization: ${ORG_SLUG}...`);
  const data = await graphqlRequest(GET_ORGANIZATION, { slug: ORG_SLUG }, token);

  if (!data.organizationBySlug) {
    throw new Error(`Organization not found: ${ORG_SLUG}`);
  }

  console.log(`  Found organization: ${data.organizationBySlug.name} (${data.organizationBySlug.id})`);
  return data.organizationBySlug.id;
}

async function createContentTypes(token, orgId) {
  console.log('\nCreating content types...');
  const typeIds = new Map();

  for (const typeDef of CONTENT_TYPES) {
    // Check if type already exists
    try {
      const existing = await graphqlRequest(
        GET_CONTENT_TYPE_BY_SLUG,
        { slug: typeDef.slug, organizationId: orgId },
        token
      );

      if (existing?.contentTypeBySlug) {
        console.log(`  [SKIP] ${typeDef.name} already exists`);
        typeIds.set(typeDef.slug, existing.contentTypeBySlug.id);
        continue;
      }
    } catch (e) {
      // Type doesn't exist, will create it
    }

    // Create the content type
    try {
      const data = await graphqlRequest(
        CREATE_CONTENT_TYPE,
        {
          input: {
            organizationId: orgId,
            slug: typeDef.slug,
            name: typeDef.name,
            description: typeDef.description,
            fields: typeDef.fields,
          },
        },
        token
      );

      console.log(`  [CREATE] ${typeDef.name} (${data.createContentType.id})`);
      typeIds.set(typeDef.slug, data.createContentType.id);
    } catch (e) {
      console.error(`  [ERROR] Failed to create ${typeDef.name}: ${e.message}`);
    }
  }

  return typeIds;
}

async function createEntry(token, typeId, orgId, slug, entryData) {
  // Check if entry already exists
  try {
    const existing = await graphqlRequest(
      GET_CONTENT_ENTRY_BY_SLUG,
      { contentTypeId: typeId, organizationId: orgId, slug },
      token
    );

    if (existing?.contentEntryBySlug) {
      return existing.contentEntryBySlug.id;
    }
  } catch (e) {
    // Entry doesn't exist, will create it
  }

  // Create new entry
  try {
    const result = await graphqlRequest(
      CREATE_CONTENT_ENTRY,
      {
        input: {
          contentTypeId: typeId,
          organizationId: orgId,
          slug,
          data: entryData,
        },
      },
      token
    );

    return result.createContentEntry.id;
  } catch (e) {
    console.error(`    [ERROR] ${slug}: ${e.message}`);
    return null;
  }
}

async function migrateInstagram(token, typeId, orgId) {
  console.log('\nMigrating Instagram feed...');

  const contentPath = path.join(process.cwd(), 'src/content/global/instagram.json');
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  const id = await createEntry(token, typeId, orgId, 'global-instagram', content);
  console.log(`  [${id ? 'OK' : 'SKIP'}] global-instagram`);
}

async function migrateMenu(token, typeIds, orgId) {
  console.log('\nMigrating menu content...');

  const contentPath = path.join(process.cwd(), 'src/content/pages/menu.json');
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  const categoryTypeId = typeIds.get('menu-category');
  const sectionTypeId = typeIds.get('menu-section');
  const itemTypeId = typeIds.get('menu-item');

  // Create categories
  for (let i = 0; i < content.categories.length; i++) {
    const categoryName = content.categories[i];
    const categorySlug = slugify(categoryName);
    const isActive = categoryName === content.activeCategory;

    await createEntry(token, categoryTypeId, orgId, categorySlug, {
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

      await createEntry(token, sectionTypeId, orgId, sectionSlug, {
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

          await createEntry(token, itemTypeId, orgId, itemSlug, {
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

async function migratePages(token, typeId, orgId) {
  console.log('\nMigrating page content...');

  const pagesDir = path.join(process.cwd(), 'src/content/pages');
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const slug = file.replace('.json', '');
    const contentPath = path.join(pagesDir, file);
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

    // Map JSON structure to page fields
    const pageData = {
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
    };

    // Copy all top-level sections as JSON fields
    const sectionKeys = [
      'hero', 'intro', 'introSection', 'gallery', 'sections', 'faq', 'form',
      'location', 'info', 'heritage', 'quote', 'awards', 'team',
      'events', 'menu', 'contact', 'pagination', 'categories',
      'activeCategory', 'menuTitle', 'menuSubtitle', 'eventsSection',
      'contactSection', 'menuSection', 'awardSection', 'quoteSection'
    ];

    for (const key of sectionKeys) {
      if (content[key] !== undefined) {
        // Preserve original field names to match page expectations
        pageData[key] = content[key];
      }
    }

    const id = await createEntry(token, typeId, orgId, slug, pageData);
    console.log(`  [${id ? 'OK' : 'SKIP'}] ${slug}`);
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('='.repeat(60));
  console.log('NoMad Wynwood Content Migration');
  console.log('='.repeat(60));

  try {
    // Step 1: Login
    const token = await login();

    // Step 2: Get organization
    const orgId = await getOrganization(token);

    // Step 3: Create content types
    const typeIds = await createContentTypes(token, orgId);

    // Step 4: Migrate content
    const instagramTypeId = typeIds.get('instagram-feed');
    const pageTypeId = typeIds.get('nomad-page');

    if (instagramTypeId) {
      await migrateInstagram(token, instagramTypeId, orgId);
    }

    await migrateMenu(token, typeIds, orgId);

    if (pageTypeId) {
      await migratePages(token, pageTypeId, orgId);
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
