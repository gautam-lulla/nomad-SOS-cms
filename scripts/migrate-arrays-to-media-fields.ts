/**
 * Migration: Convert JSON array fields to individual MEDIA fields
 *
 * This script:
 * 1. Adds new MEDIA fields to content types
 * 2. Migrates data from JSON arrays to individual MEDIA fields
 *
 * Usage:
 *   CMS_EMAIL='email' CMS_PASSWORD='password' npx tsx scripts/migrate-arrays-to-media-fields.ts
 */

const CMS_API_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORGANIZATION_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';
const CMS_EMAIL = process.env.CMS_EMAIL || '';
const CMS_PASSWORD = process.env.CMS_PASSWORD || '';

let authToken = '';

// ============================================
// AUTH
// ============================================
async function login(): Promise<string> {
  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation Login($input: LoginInput!) { login(input: $input) { accessToken user { email } } }`,
      variables: { input: { email: CMS_EMAIL, password: CMS_PASSWORD } },
    }),
  });
  const result = (await response.json()) as { data?: { login: { accessToken: string; user: { email: string } } }; errors?: unknown[] };
  if (result.errors) throw new Error(`Login failed: ${JSON.stringify(result.errors)}`);
  console.log(`Logged in as: ${result.data!.login.user.email}\n`);
  return result.data!.login.accessToken;
}

async function gqlRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const result = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (result.errors) {
    console.error('GraphQL Error:', JSON.stringify(result.errors, null, 2));
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }
  return result.data as T;
}

// ============================================
// SCHEMA UPDATES
// ============================================

interface ContentType {
  id: string;
  fields: Array<{ slug: string; name: string; type: string }>;
}

async function getContentTypeId(slug: string): Promise<string> {
  const data = await gqlRequest<{ contentTypeBySlug: { id: string } }>(
    `query($slug: String!, $orgId: ID!) { contentTypeBySlug(slug: $slug, organizationId: $orgId) { id } }`,
    { slug, orgId: ORGANIZATION_ID }
  );
  return data.contentTypeBySlug.id;
}

async function getContentTypeFields(typeId: string): Promise<string[]> {
  const data = await gqlRequest<{ contentTypeBySlug: ContentType }>(
    `query($id: ID!) { contentType(id: $id) { id fields { slug } } }`,
    { id: typeId }
  );
  // Handle potential null
  return [];
}

async function addFieldsToContentType(contentTypeId: string, fields: Array<{ slug: string; name: string; type: string; sortOrder: number }>): Promise<void> {
  const mutation = `
    mutation AddFields($input: AddFieldsInput!) {
      addFieldsToContentType(input: $input) {
        id
        fields { slug name type }
      }
    }
  `;

  await gqlRequest(mutation, {
    input: {
      contentTypeId,
      fields,
    },
  });
}

// ============================================
// DATA MIGRATION
// ============================================

interface ContentEntry {
  id: string;
  slug: string;
  data: Record<string, unknown>;
}

async function getAllEntries(contentTypeId: string): Promise<ContentEntry[]> {
  const data = await gqlRequest<{ contentEntries: { items: ContentEntry[] } }>(
    `query($filter: ContentEntryFilterInput!) { contentEntries(filter: $filter) { items { id slug data } } }`,
    { filter: { contentTypeId, organizationId: ORGANIZATION_ID, take: 100 } }
  );
  return data.contentEntries.items;
}

async function updateEntry(id: string, data: Record<string, unknown>): Promise<void> {
  await gqlRequest(
    `mutation($id: ID!, $input: UpdateContentEntryInput!) { updateContentEntry(id: $id, input: $input) { id } }`,
    { id, input: { data } }
  );
}

// ============================================
// MAIN MIGRATION
// ============================================

async function migrateNomadPage(): Promise<void> {
  console.log('=== Migrating nomad-page content type ===\n');

  const typeId = await getContentTypeId('nomad-page');
  console.log(`Content type ID: ${typeId}`);

  // Step 1: Add new MEDIA fields
  console.log('\n1. Adding new MEDIA fields...');

  const newFields = [
    // Gallery images (up to 6 for getting-here page)
    { slug: 'galleryImage1', name: 'Gallery Image 1', type: 'MEDIA', sortOrder: 100 },
    { slug: 'galleryImage2', name: 'Gallery Image 2', type: 'MEDIA', sortOrder: 101 },
    { slug: 'galleryImage3', name: 'Gallery Image 3', type: 'MEDIA', sortOrder: 102 },
    { slug: 'galleryImage4', name: 'Gallery Image 4', type: 'MEDIA', sortOrder: 103 },
    { slug: 'galleryImage5', name: 'Gallery Image 5', type: 'MEDIA', sortOrder: 104 },
    { slug: 'galleryImage6', name: 'Gallery Image 6', type: 'MEDIA', sortOrder: 105 },
    // Instagram images
    { slug: 'instagramImage1', name: 'Instagram Image 1', type: 'MEDIA', sortOrder: 110 },
    { slug: 'instagramImage2', name: 'Instagram Image 2', type: 'MEDIA', sortOrder: 111 },
    { slug: 'instagramImage3', name: 'Instagram Image 3', type: 'MEDIA', sortOrder: 112 },
    { slug: 'instagramImage4', name: 'Instagram Image 4', type: 'MEDIA', sortOrder: 113 },
    // Awards logos
    { slug: 'awardsLogo1', name: 'Awards Logo 1', type: 'MEDIA', sortOrder: 120 },
    { slug: 'awardsLogo2', name: 'Awards Logo 2', type: 'MEDIA', sortOrder: 121 },
    { slug: 'awardsLogo3', name: 'Awards Logo 3', type: 'MEDIA', sortOrder: 122 },
    { slug: 'awardsLogo4', name: 'Awards Logo 4', type: 'MEDIA', sortOrder: 123 },
  ];

  try {
    await addFieldsToContentType(typeId, newFields);
    console.log(`   Added ${newFields.length} new MEDIA fields`);
  } catch (e) {
    console.log(`   Fields may already exist: ${(e as Error).message}`);
  }

  // Step 2: Migrate data
  console.log('\n2. Migrating data from arrays to individual fields...');

  const entries = await getAllEntries(typeId);
  console.log(`   Found ${entries.length} entries to process`);

  for (const entry of entries) {
    const updates: Record<string, unknown> = { ...entry.data };
    let changed = false;

    // Migrate gallery array
    const gallery = entry.data.gallery as Array<{ src: string; alt?: string }> | undefined;
    if (gallery && Array.isArray(gallery)) {
      gallery.forEach((img, i) => {
        if (i < 6 && img.src) {
          updates[`galleryImage${i + 1}`] = [img.src]; // MEDIA fields expect arrays
          changed = true;
        }
      });
      // Keep the old field for now (will be removed later)
    }

    // Migrate instagramImages array
    const instaImages = entry.data.instagramImages as Array<{ src: string; alt?: string }> | undefined;
    if (instaImages && Array.isArray(instaImages)) {
      instaImages.forEach((img, i) => {
        if (i < 4 && img.src) {
          updates[`instagramImage${i + 1}`] = [img.src];
          changed = true;
        }
      });
    }

    // Migrate awardsLogos array
    const awardsLogos = entry.data.awardsLogos as Array<{ src: string; alt?: string }> | undefined;
    if (awardsLogos && Array.isArray(awardsLogos)) {
      awardsLogos.forEach((img, i) => {
        if (i < 4 && img.src) {
          updates[`awardsLogo${i + 1}`] = [img.src];
          changed = true;
        }
      });
    }

    if (changed) {
      try {
        await updateEntry(entry.id, updates);
        console.log(`   ✓ ${entry.slug}`);
      } catch (e) {
        console.log(`   ✗ ${entry.slug}: ${(e as Error).message}`);
      }
    } else {
      console.log(`   - ${entry.slug} (no arrays to migrate)`);
    }
  }
}

async function migrateInstagramFeed(): Promise<void> {
  console.log('\n=== Migrating instagram-feed content type ===\n');

  const typeId = await getContentTypeId('instagram-feed');
  console.log(`Content type ID: ${typeId}`);

  // Step 1: Add new MEDIA fields
  console.log('\n1. Adding new MEDIA fields...');

  const newFields = [
    { slug: 'image1', name: 'Image 1', type: 'MEDIA', sortOrder: 10 },
    { slug: 'image2', name: 'Image 2', type: 'MEDIA', sortOrder: 11 },
    { slug: 'image3', name: 'Image 3', type: 'MEDIA', sortOrder: 12 },
    { slug: 'image4', name: 'Image 4', type: 'MEDIA', sortOrder: 13 },
  ];

  try {
    await addFieldsToContentType(typeId, newFields);
    console.log(`   Added ${newFields.length} new MEDIA fields`);
  } catch (e) {
    console.log(`   Fields may already exist: ${(e as Error).message}`);
  }

  // Step 2: Migrate data
  console.log('\n2. Migrating data...');

  const entries = await getAllEntries(typeId);

  for (const entry of entries) {
    const updates: Record<string, unknown> = { ...entry.data };
    let changed = false;

    const images = entry.data.images as Array<{ src: string; alt?: string }> | undefined;
    if (images && Array.isArray(images)) {
      images.forEach((img, i) => {
        if (i < 4 && img.src) {
          updates[`image${i + 1}`] = [img.src];
          changed = true;
        }
      });
    }

    if (changed) {
      try {
        await updateEntry(entry.id, updates);
        console.log(`   ✓ ${entry.slug}`);
      } catch (e) {
        console.log(`   ✗ ${entry.slug}: ${(e as Error).message}`);
      }
    }
  }
}

async function main(): Promise<void> {
  console.log('========================================');
  console.log('Migration: Arrays to Individual MEDIA Fields');
  console.log('========================================\n');

  if (!CMS_EMAIL || !CMS_PASSWORD) {
    console.error('Error: CMS_EMAIL and CMS_PASSWORD required');
    process.exit(1);
  }

  authToken = await login();

  await migrateNomadPage();
  await migrateInstagramFeed();

  console.log('\n========================================');
  console.log('Migration Complete!');
  console.log('========================================');
  console.log('\nNext steps:');
  console.log('1. Update the content layer to use new individual fields');
  console.log('2. Test the site');
  console.log('3. Remove old JSON array fields from schema');
}

main().catch(console.error);
