/**
 * Migrate CMS Image URLs to Cloudflare R2
 *
 * This script updates all content entries in the CMS to use
 * Cloudflare R2 URLs instead of local image paths.
 *
 * Usage: npx tsx scripts/migrate-cms-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration from environment variables
const config = {
  cmsUrl: process.env.CMS_GRAPHQL_URL || '',
  organizationId: process.env.CMS_ORGANIZATION_ID || '',
  adminToken: process.env.CMS_ADMIN_TOKEN || '',
};

// Load URL mapping
const mappingPath = path.join(process.cwd(), 'image-url-mapping.json');
const urlMapping: Record<string, string> = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

/**
 * Execute GraphQL query
 */
async function graphqlQuery(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(config.cmsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.adminToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
  }
  return result;
}

/**
 * Recursively replace image URLs in an object
 */
function replaceImageUrls(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // Check if this string is an image path that needs replacing
    if (urlMapping[obj]) {
      return urlMapping[obj];
    }
    // Also check without leading slash
    if (obj.startsWith('/images/') && urlMapping[obj]) {
      return urlMapping[obj];
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(replaceImageUrls);
  }

  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceImageUrls(value);
    }
    return result;
  }

  return obj;
}

/**
 * Main migration function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('CMS Image URL Migration');
  console.log('='.repeat(60));
  console.log(`CMS URL: ${config.cmsUrl}`);
  console.log(`Organization ID: ${config.organizationId}`);
  console.log(`URL mappings loaded: ${Object.keys(urlMapping).length}`);
  console.log('='.repeat(60));

  // Step 1: Get all content types
  console.log('\n1. Fetching content types...');
  const contentTypesResult = await graphqlQuery(`
    query {
      contentTypes {
        items {
          id
          slug
          name
        }
      }
    }
  `);

  const contentTypes = contentTypesResult.data?.contentTypes?.items || [];
  console.log(`Found ${contentTypes.length} content types`);

  // Step 2: For each content type, get all entries
  const updatedEntries: { id: string; slug: string; contentType: string }[] = [];
  const failedEntries: { id: string; slug: string; error: string }[] = [];

  for (const contentType of contentTypes) {
    console.log(`\n2. Processing content type: ${contentType.name} (${contentType.slug})`);

    // Get all entries for this content type
    const entriesResult = await graphqlQuery(`
      query GetEntries($filter: ContentEntryFilterInput!) {
        contentEntries(filter: $filter) {
          items {
            id
            slug
            data
          }
        }
      }
    `, {
      filter: {
        contentTypeId: contentType.id,
        organizationId: config.organizationId,
        take: 100,
      },
    });

    const entries = entriesResult.data?.contentEntries?.items || [];
    console.log(`   Found ${entries.length} entries`);

    // Step 3: Update each entry with new URLs
    for (const entry of entries) {
      const originalData = entry.data;
      const updatedData = replaceImageUrls(originalData);

      // Check if any changes were made
      const originalJson = JSON.stringify(originalData);
      const updatedJson = JSON.stringify(updatedData);

      if (originalJson !== updatedJson) {
        console.log(`   Updating entry: ${entry.slug}`);

        try {
          const updateResult = await graphqlQuery(`
            mutation UpdateEntry($id: ID!, $input: UpdateContentEntryInput!) {
              updateContentEntry(id: $id, input: $input) {
                id
                slug
              }
            }
          `, {
            id: entry.id,
            input: {
              data: updatedData,
            },
          });

          if (updateResult.data?.updateContentEntry) {
            updatedEntries.push({
              id: entry.id,
              slug: entry.slug,
              contentType: contentType.slug,
            });
            console.log(`   ✓ Updated: ${entry.slug}`);
          } else {
            failedEntries.push({
              id: entry.id,
              slug: entry.slug,
              error: JSON.stringify(updateResult.errors),
            });
            console.log(`   ✗ Failed: ${entry.slug}`);
          }
        } catch (error) {
          failedEntries.push({
            id: entry.id,
            slug: entry.slug,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          console.log(`   ✗ Error: ${entry.slug}`);
        }
      } else {
        console.log(`   - No changes needed: ${entry.slug}`);
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  console.log(`Total entries updated: ${updatedEntries.length}`);
  console.log(`Failed updates: ${failedEntries.length}`);

  if (updatedEntries.length > 0) {
    console.log('\nUpdated entries:');
    updatedEntries.forEach((entry) => {
      console.log(`  - [${entry.contentType}] ${entry.slug}`);
    });
  }

  if (failedEntries.length > 0) {
    console.log('\nFailed entries:');
    failedEntries.forEach((entry) => {
      console.log(`  - ${entry.slug}: ${entry.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('Migration complete!');
  console.log('='.repeat(60));
}

main().catch(console.error);
