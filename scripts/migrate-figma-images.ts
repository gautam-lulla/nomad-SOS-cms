/**
 * Figma Image Migration Script
 *
 * This script migrates images from temporary Figma MCP URLs to permanent CDN storage.
 * Run BEFORE production deployment to ensure all images are permanently hosted.
 *
 * Usage:
 *   CMS_AUTH_TOKEN='your-token' npx tsx scripts/migrate-figma-images.ts
 *
 * Prerequisites:
 *   - CMS_AUTH_TOKEN environment variable (get via login mutation)
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// CONFIGURATION
// ============================================
const CMS_API_URL = 'https://backend-production-162b.up.railway.app/graphql';
let CMS_AUTH_TOKEN = process.env.CMS_AUTH_TOKEN || '';
const ORGANIZATION_ID = process.env.CMS_ORGANIZATION_ID || '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';
const CMS_EMAIL = process.env.CMS_EMAIL || '';
const CMS_PASSWORD = process.env.CMS_PASSWORD || '';

// Local download directory for backup
const DOWNLOAD_DIR = path.join(__dirname, '../public/images-backup');

// ============================================
// IMAGE MANIFEST - All images from Figma design
// ============================================
const IMAGES_TO_MIGRATE = [
  // Hero images
  {
    name: 'hero-left-image',
    figmaAssetId: '7fe0b754-5344-4ed6-a095-f5a9ae29ca1b',
    cdnPath: 'hero/hero-left.jpg',
    cmsFieldPath: 'heroLeftImage',
    pages: ['homepage'],
  },
  {
    name: 'hero-right-image',
    figmaAssetId: '53e297aa-5da8-4d03-91d3-ed9b0539f6c4',
    cdnPath: 'hero/hero-right.jpg',
    cmsFieldPath: 'heroRightImage',
    pages: ['homepage'],
  },

  // Gallery images
  {
    name: 'gallery-image-1',
    figmaAssetId: '334c5e9c-bb31-416c-b7ee-753c8ed2609c',
    cdnPath: 'gallery/image-1.jpg',
    cmsFieldPath: 'gallery[0].src',
    pages: ['homepage'],
  },
  {
    name: 'gallery-image-2',
    figmaAssetId: '7dd6a2ee-ac6e-4333-8831-2f4a23e1138e',
    cdnPath: 'gallery/image-2.jpg',
    cmsFieldPath: 'gallery[1].src',
    pages: ['homepage'],
  },
  {
    name: 'gallery-image-3',
    figmaAssetId: '6fae012b-a5ad-4863-8647-da8ea6d60051',
    cdnPath: 'gallery/image-3.jpg',
    cmsFieldPath: 'gallery[2].src',
    pages: ['homepage'],
  },

  // Section images
  {
    name: 'events-section-image',
    figmaAssetId: 'da93f456-344d-4dea-90da-d754dfe756cc',
    cdnPath: 'events/events-hero.jpg',
    cmsFieldPath: 'eventsImageSrc',
    pages: ['homepage'],
  },
  {
    name: 'contact-section-image',
    figmaAssetId: '02f0fa22-d234-40ea-8a51-181204230ee0',
    cdnPath: 'contact/contact-hero.jpg',
    cmsFieldPath: 'contactImageSrc',
    pages: ['homepage'],
  },

  // Instagram feed images
  {
    name: 'instagram-feed-1',
    figmaAssetId: '325d6570-4f9f-44f4-a48a-d3dbb1f96f57',
    cdnPath: 'instagram/insta-1.jpg',
    cmsFieldPath: 'images[0].src',
    pages: ['global-instagram'],
  },
  {
    name: 'instagram-feed-2',
    figmaAssetId: 'bf2c6c2d-5163-4d23-a35d-b82b59f7847a',
    cdnPath: 'instagram/insta-2.jpg',
    cmsFieldPath: 'images[1].src',
    pages: ['global-instagram'],
  },
  {
    name: 'instagram-feed-3',
    figmaAssetId: '4f62737c-2f6e-4207-abf2-acdd1e113409',
    cdnPath: 'instagram/insta-3.jpg',
    cmsFieldPath: 'images[2].src',
    pages: ['global-instagram'],
  },
  {
    name: 'instagram-feed-4',
    figmaAssetId: '59f2439c-190b-4d62-b8ca-a6ef6b416648',
    cdnPath: 'instagram/insta-4.jpg',
    cmsFieldPath: 'images[3].src',
    pages: ['global-instagram'],
  },

  // Menu page images
  {
    name: 'menu-hero-left',
    figmaAssetId: '07ea88b9-f2fb-435f-ab9f-bdf0af593241',
    cdnPath: 'menu/hero-left.jpg',
    cmsFieldPath: 'gallery[0].src',
    pages: ['menu'],
  },
  {
    name: 'menu-hero-right',
    figmaAssetId: 'eca0b4ad-119d-400c-840c-815ff04ca51c',
    cdnPath: 'menu/hero-right.jpg',
    cmsFieldPath: 'gallery[1].src',
    pages: ['menu'],
  },
  {
    name: 'menu-gallery-1',
    figmaAssetId: '07d7f4e9-3cfb-4110-9539-65a7f3b7203e',
    cdnPath: 'menu/gallery-1.jpg',
    cmsFieldPath: 'gallery[2].src',
    pages: ['menu'],
  },
  {
    name: 'menu-gallery-2',
    figmaAssetId: 'cdc86313-d36c-49de-a8d2-27f69ecd49dd',
    cdnPath: 'menu/gallery-2.jpg',
    cmsFieldPath: 'gallery[3].src',
    pages: ['menu'],
  },

  // Programming/Events page images
  {
    name: 'event-card-1',
    figmaAssetId: 'ca258667-f35b-4b75-9138-1cd493302a32',
    cdnPath: 'events/event-1.jpg',
    cmsFieldPath: 'events[0].imageSrc',
    pages: ['programming'],
  },
  {
    name: 'event-card-2',
    figmaAssetId: 'f1c9ccb4-8b6e-4396-83a2-c9c6e29f672d',
    cdnPath: 'events/event-2.jpg',
    cmsFieldPath: 'events[1].imageSrc',
    pages: ['programming'],
  },
  {
    name: 'event-card-3',
    figmaAssetId: 'f5631492-e6f2-4405-b2ee-3b2ec3779aa1',
    cdnPath: 'events/event-3.jpg',
    cmsFieldPath: 'events[2].imageSrc',
    pages: ['programming'],
  },
  {
    name: 'event-card-4',
    figmaAssetId: 'a80c082a-0d41-4502-bbfa-205edb639c8f',
    cdnPath: 'events/event-4.jpg',
    cmsFieldPath: 'events[3].imageSrc',
    pages: ['programming'],
  },
  {
    name: 'event-card-5',
    figmaAssetId: 'd3f39ab6-8123-4ed2-adfd-6dfca32ebcb8',
    cdnPath: 'events/event-5.jpg',
    cmsFieldPath: 'events[4].imageSrc',
    pages: ['programming'],
  },
  {
    name: 'event-card-6',
    figmaAssetId: 'ffbbb4c3-525b-4118-af74-d0a55b2800a9',
    cdnPath: 'events/event-6.jpg',
    cmsFieldPath: 'events[5].imageSrc',
    pages: ['programming'],
  },
];

// ============================================
// TYPES
// ============================================
interface ImageToMigrate {
  name: string;
  figmaAssetId: string;
  cdnPath: string;
  cmsFieldPath: string;
  pages: string[];
}

interface MediaUploadResponse {
  uploadMedia: {
    id: string;
    url: string;
    filename: string;
    mimeType: string;
  };
}

interface MigrationResult {
  name: string;
  success: boolean;
  cdnUrl?: string;
  error?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function login(): Promise<string> {
  const mutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
        user { id email }
      }
    }
  `;

  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          email: CMS_EMAIL,
          password: CMS_PASSWORD,
        },
      },
    }),
  });

  const result = (await response.json()) as {
    data?: { login: { accessToken: string; user: { email: string } } };
    errors?: Array<{ message: string }>;
  };

  if (result.errors) {
    throw new Error(`Login failed: ${JSON.stringify(result.errors)}`);
  }

  console.log(`Logged in as: ${result.data!.login.user.email}`);
  return result.data!.login.accessToken;
}

async function downloadFigmaImage(
  assetId: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  const url = `https://www.figma.com/api/mcp/asset/${assetId}`;
  console.log(`  Downloading from: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'image/jpeg';

  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType: contentType,
  };
}

async function uploadToCMS(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  alt: string
): Promise<string> {
  const base64 = buffer.toString('base64');

  const mutation = `
    mutation UploadMedia($input: UploadMediaInput!) {
      uploadMedia(input: $input) {
        id
        filename
        mimeType
        size
        variants {
          original
          thumbnail
          medium
          large
        }
      }
    }
  `;

  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CMS_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          organizationId: ORGANIZATION_ID,
          filename,
          mimeType,
          alt,
          base64Data: base64,
        },
      },
    }),
  });

  const result = (await response.json()) as {
    data?: { uploadMedia: { id: string; variants: { original: string } } };
    errors?: Array<{ message: string }>;
  };

  if (result.errors) {
    throw new Error(`Upload failed: ${JSON.stringify(result.errors)}`);
  }

  return result.data!.uploadMedia.variants.original;
}

function saveLocally(buffer: Buffer, cdnPath: string): void {
  const localPath = path.join(DOWNLOAD_DIR, cdnPath);
  const dir = path.dirname(localPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(localPath, buffer);
  console.log(`  Saved locally to: ${localPath}`);
}

// ============================================
// MAIN MIGRATION FUNCTION
// ============================================
async function migrateImages(): Promise<void> {
  console.log('\n========================================');
  console.log('Figma Image Migration');
  console.log('========================================\n');

  // Login if credentials provided but no token
  if (!CMS_AUTH_TOKEN && CMS_EMAIL && CMS_PASSWORD) {
    console.log('Logging in to CMS...');
    CMS_AUTH_TOKEN = await login();
    console.log('');
  }

  if (!CMS_AUTH_TOKEN) {
    console.log('No CMS credentials provided. Running in DOWNLOAD-ONLY mode.');
    console.log('Images will be saved locally to:', DOWNLOAD_DIR);
    console.log('\nTo upload to CDN, set CMS_EMAIL and CMS_PASSWORD environment variables.\n');
  }

  const results: MigrationResult[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < IMAGES_TO_MIGRATE.length; i++) {
    const image = IMAGES_TO_MIGRATE[i];

    console.log(`[${i + 1}/${IMAGES_TO_MIGRATE.length}] ${image.name}`);
    console.log(`  CDN Path: ${image.cdnPath}`);

    try {
      // 1. Download from Figma
      const { buffer, mimeType } = await downloadFigmaImage(image.figmaAssetId);
      console.log(`  Downloaded: ${(buffer.length / 1024).toFixed(1)} KB (${mimeType})`);

      // 2. Save locally as backup
      saveLocally(buffer, image.cdnPath);

      // 3. Upload to CMS if token provided
      if (CMS_AUTH_TOKEN && ORGANIZATION_ID) {
        console.log('  Uploading to CDN...');
        const cdnUrl = await uploadToCMS(buffer, image.cdnPath, mimeType, image.name);
        console.log(`  ✓ CDN URL: ${cdnUrl}\n`);

        results.push({ name: image.name, success: true, cdnUrl });
      } else {
        console.log('  ✓ Downloaded (no CDN upload - missing credentials)\n');
        results.push({ name: image.name, success: true });
      }

      successCount++;

      // Rate limit to avoid overwhelming APIs
      await new Promise((r) => setTimeout(r, 500));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`  ✗ FAILED: ${errorMessage}\n`);
      results.push({ name: image.name, success: false, error: errorMessage });
      failCount++;
    }
  }

  // Summary
  console.log('\n========================================');
  console.log('Migration Summary');
  console.log('========================================');
  console.log(`Total: ${IMAGES_TO_MIGRATE.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  if (failCount > 0) {
    console.log('\nFailed images:');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  - ${r.name}: ${r.error}`));
  }

  // Write results to file
  const resultsPath = path.join(__dirname, '../docs/migration-results.json');
  fs.writeFileSync(
    resultsPath,
    JSON.stringify(
      {
        migratedAt: new Date().toISOString(),
        totalImages: IMAGES_TO_MIGRATE.length,
        success: successCount,
        failed: failCount,
        results,
      },
      null,
      2
    )
  );
  console.log(`\nResults saved to: ${resultsPath}`);
}

// ============================================
// RUN
// ============================================
migrateImages().catch(console.error);
