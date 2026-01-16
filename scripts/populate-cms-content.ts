/**
 * Populate CMS Content Entries
 *
 * This script creates content entries in SphereOS CMS from local JSON files.
 * It populates all pages with their content and R2 image URLs.
 *
 * Usage: npx tsx scripts/populate-cms-content.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORG_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

// We'll get token at runtime
let AUTH_TOKEN = '';

/**
 * Execute GraphQL query
 */
async function graphql(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(CMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(AUTH_TOKEN && { 'Authorization': `Bearer ${AUTH_TOKEN}` }),
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (result.errors) {
    console.error('GraphQL errors:', JSON.stringify(result.errors, null, 2));
  }
  return result;
}

/**
 * Login and get access token
 */
async function login(): Promise<string> {
  const result = await graphql(`
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
      }
    }
  `, {
    input: {
      email: 'dev@sphereos.local',
      password: 'password123',
    },
  });

  if (result.data?.login?.accessToken) {
    return result.data.login.accessToken;
  }
  throw new Error('Login failed');
}

/**
 * Get content type ID by slug
 */
async function getContentTypeId(slug: string): Promise<string | null> {
  const result = await graphql(`
    query GetContentType($slug: String!, $organizationId: ID!) {
      contentTypeBySlug(slug: $slug, organizationId: $organizationId) {
        id
        slug
        name
      }
    }
  `, {
    slug,
    organizationId: ORG_ID,
  });

  return result.data?.contentTypeBySlug?.id || null;
}

/**
 * Check if content entry exists by slug
 */
async function getContentEntry(contentTypeId: string, slug: string): Promise<{ id: string; data: unknown } | null> {
  const result = await graphql(`
    query GetEntry($contentTypeId: ID!, $organizationId: ID!, $slug: String!) {
      contentEntryBySlug(
        contentTypeId: $contentTypeId
        organizationId: $organizationId
        slug: $slug
      ) {
        id
        slug
        data
      }
    }
  `, {
    contentTypeId,
    organizationId: ORG_ID,
    slug,
  });

  return result.data?.contentEntryBySlug || null;
}

/**
 * Create content entry
 */
async function createContentEntry(contentTypeId: string, slug: string, data: unknown): Promise<boolean> {
  const result = await graphql(`
    mutation CreateEntry($input: CreateContentEntryInput!) {
      createContentEntry(input: $input) {
        id
        slug
      }
    }
  `, {
    input: {
      contentTypeId,
      organizationId: ORG_ID,
      slug,
      data,
    },
  });

  return !!result.data?.createContentEntry?.id;
}

/**
 * Update content entry
 */
async function updateContentEntry(id: string, data: unknown): Promise<boolean> {
  const result = await graphql(`
    mutation UpdateEntry($id: ID!, $input: UpdateContentEntryInput!) {
      updateContentEntry(id: $id, input: $input) {
        id
        slug
      }
    }
  `, {
    id,
    input: { data },
  });

  return !!result.data?.updateContentEntry?.id;
}

/**
 * Create or update content entry
 */
async function upsertContentEntry(
  contentTypeSlug: string,
  entrySlug: string,
  data: unknown
): Promise<{ action: 'created' | 'updated' | 'failed'; slug: string }> {
  const contentTypeId = await getContentTypeId(contentTypeSlug);
  if (!contentTypeId) {
    console.error(`  Content type not found: ${contentTypeSlug}`);
    return { action: 'failed', slug: entrySlug };
  }

  const existing = await getContentEntry(contentTypeId, entrySlug);

  if (existing) {
    const success = await updateContentEntry(existing.id, data);
    return { action: success ? 'updated' : 'failed', slug: entrySlug };
  } else {
    const success = await createContentEntry(contentTypeId, entrySlug, data);
    return { action: success ? 'created' : 'failed', slug: entrySlug };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Populate CMS Content Entries');
  console.log('='.repeat(60));
  console.log(`CMS URL: ${CMS_URL}`);
  console.log(`Organization ID: ${ORG_ID}`);
  console.log('='.repeat(60));

  // Login
  console.log('\n1. Logging in...');
  try {
    AUTH_TOKEN = await login();
    console.log('   ✓ Login successful');
  } catch (error) {
    console.error('   ✗ Login failed:', error);
    process.exit(1);
  }

  // Define content to create
  const contentDir = path.join(process.cwd(), 'src', 'content');

  // Page content entries (nomad-page type)
  const pages = [
    { slug: 'homepage', file: 'pages/homepage.json' },
    { slug: 'about', file: 'pages/about.json' },
    { slug: 'menu', file: 'pages/menu.json' },
    { slug: 'private-events', file: 'pages/private-events.json' },
    { slug: 'programming', file: 'pages/programming.json' },
    { slug: 'contact', file: 'pages/contact.json' },
    { slug: 'faq', file: 'pages/faq.json' },
    { slug: 'getting-here', file: 'pages/getting-here.json' },
  ];

  // Global content
  const globals = [
    { slug: 'global-instagram', file: 'global/instagram.json', type: 'instagram-feed' },
  ];

  const results: { created: string[]; updated: string[]; failed: string[] } = {
    created: [],
    updated: [],
    failed: [],
  };

  // Create page entries
  console.log('\n2. Creating page entries (nomad-page)...');
  for (const page of pages) {
    const filePath = path.join(contentDir, page.file);
    if (!fs.existsSync(filePath)) {
      console.log(`   - Skipping ${page.slug}: file not found`);
      continue;
    }

    process.stdout.write(`   ${page.slug}... `);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const result = await upsertContentEntry('nomad-page', page.slug, data);

    if (result.action === 'created') {
      console.log('✓ Created');
      results.created.push(result.slug);
    } else if (result.action === 'updated') {
      console.log('↻ Updated');
      results.updated.push(result.slug);
    } else {
      console.log('✗ Failed');
      results.failed.push(result.slug);
    }
  }

  // Create global entries
  console.log('\n3. Creating global entries...');
  for (const global of globals) {
    const filePath = path.join(contentDir, global.file);
    if (!fs.existsSync(filePath)) {
      console.log(`   - Skipping ${global.slug}: file not found`);
      continue;
    }

    process.stdout.write(`   ${global.slug} (${global.type})... `);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const result = await upsertContentEntry(global.type, global.slug, data);

    if (result.action === 'created') {
      console.log('✓ Created');
      results.created.push(result.slug);
    } else if (result.action === 'updated') {
      console.log('↻ Updated');
      results.updated.push(result.slug);
    } else {
      console.log('✗ Failed');
      results.failed.push(result.slug);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Created: ${results.created.length}`);
  console.log(`Updated: ${results.updated.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.created.length > 0) {
    console.log('\nCreated entries:');
    results.created.forEach((s) => console.log(`  + ${s}`));
  }

  if (results.updated.length > 0) {
    console.log('\nUpdated entries:');
    results.updated.forEach((s) => console.log(`  ↻ ${s}`));
  }

  if (results.failed.length > 0) {
    console.log('\nFailed entries:');
    results.failed.forEach((s) => console.log(`  ✗ ${s}`));
  }

  console.log('\n' + '='.repeat(60));
  console.log('Done!');
  console.log('='.repeat(60));
}

main().catch(console.error);
