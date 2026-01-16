/**
 * Register Images in CMS Media Library
 *
 * This script downloads images from R2 and uploads them via the CMS
 * uploadMedia mutation to populate the Media Library with proper
 * thumbnails and variants.
 *
 * Usage: npx tsx scripts/register-media-library.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORG_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

let AUTH_TOKEN = '';

/**
 * Execute GraphQL query
 */
async function graphql(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(CMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
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
  const result = await graphql(
    `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
      }
    }
  `,
    {
      input: {
        email: 'dev@sphereos.local',
        password: 'password123',
      },
    }
  );

  if (result.data?.login?.accessToken) {
    return result.data.login.accessToken;
  }
  throw new Error('Login failed');
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Upload media to CMS
 */
async function uploadMedia(
  filename: string,
  base64Data: string,
  mimeType: string
): Promise<{ id: string; url: string } | null> {
  const result = await graphql(
    `
    mutation UploadMedia($input: UploadMediaInput!) {
      uploadMedia(input: $input) {
        id
        filename
        variants {
          original
          thumbnail
          medium
          large
        }
      }
    }
  `,
    {
      input: {
        organizationId: ORG_ID,
        filename,
        mimeType,
        base64Data,
        alt: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      },
    }
  );

  if (result.data?.uploadMedia) {
    return {
      id: result.data.uploadMedia.id,
      url: result.data.uploadMedia.variants?.original || '',
    };
  }
  return null;
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Register Images in CMS Media Library');
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

  // Load URL mapping
  const mappingPath = path.join(process.cwd(), 'image-url-mapping.json');
  const urlMapping: Record<string, string> = JSON.parse(
    fs.readFileSync(mappingPath, 'utf-8')
  );

  const images = Object.entries(urlMapping);
  console.log(`\n2. Processing ${images.length} images...`);

  const results: {
    uploaded: string[];
    failed: string[];
    skipped: string[];
  } = {
    uploaded: [],
    failed: [],
    skipped: [],
  };

  for (const [localPath, r2Url] of images) {
    const filename = path.basename(localPath);
    const mimeType = getMimeType(filename);

    // Skip non-image files
    if (!mimeType.startsWith('image/')) {
      console.log(`   - Skipping ${filename}: not an image`);
      results.skipped.push(filename);
      continue;
    }

    process.stdout.write(`   ${filename}... `);

    try {
      // Fetch image from R2
      const response = await fetch(r2Url);
      if (!response.ok) {
        console.log(`✗ Failed to fetch (${response.status})`);
        results.failed.push(filename);
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const base64Data = buffer.toString('base64');

      // Upload to CMS
      const result = await uploadMedia(filename, base64Data, mimeType);

      if (result) {
        console.log(`✓ Uploaded (ID: ${result.id})`);
        results.uploaded.push(filename);
      } else {
        console.log('✗ Upload failed');
        results.failed.push(filename);
      }
    } catch (error) {
      console.log(`✗ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
      results.failed.push(filename);
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Uploaded: ${results.uploaded.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Skipped: ${results.skipped.length}`);

  if (results.uploaded.length > 0) {
    console.log('\nUploaded images:');
    results.uploaded.forEach((f) => console.log(`  + ${f}`));
  }

  if (results.failed.length > 0) {
    console.log('\nFailed images:');
    results.failed.forEach((f) => console.log(`  ✗ ${f}`));
  }

  console.log('\n' + '='.repeat(60));
  console.log('Done! Images are now visible in the CMS Media Library.');
  console.log('='.repeat(60));
}

main().catch(console.error);
