/**
 * Upload Images to Cloudflare R2
 *
 * This script uploads all images from /public/images/ to Cloudflare R2
 * and generates a mapping file with old -> new URLs.
 *
 * Usage: npx ts-node scripts/upload-images-to-r2.ts
 */

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

// Configuration from environment variables
const config = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || '',
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || '',
};

// Create S3 client configured for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

// MIME type mapping
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

interface UploadResult {
  localPath: string;
  r2Key: string;
  publicUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Get all files recursively from a directory
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Skip .DS_Store and other hidden files
      if (!file.startsWith('.')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

/**
 * Upload a single file to R2
 */
async function uploadFile(filePath: string, baseDir: string): Promise<UploadResult> {
  // Calculate R2 key (path within bucket)
  const relativePath = path.relative(baseDir, filePath);
  const r2Key = `nomad/${relativePath}`;

  // Get file extension and MIME type
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Read file
  const fileContent = fs.readFileSync(filePath);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: r2Key,
        Body: fileContent,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    const publicUrl = `${config.publicUrl}/${r2Key}`;

    return {
      localPath: `/images/${relativePath}`,
      r2Key,
      publicUrl,
      success: true,
    };
  } catch (error) {
    return {
      localPath: `/images/${relativePath}`,
      r2Key,
      publicUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main upload function
 */
async function main() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');

  console.log('='.repeat(60));
  console.log('Cloudflare R2 Image Upload');
  console.log('='.repeat(60));
  console.log(`Source directory: ${imagesDir}`);
  console.log(`Target bucket: ${config.bucketName}`);
  console.log(`Public URL: ${config.publicUrl}`);
  console.log('='.repeat(60));

  // Check if source directory exists
  if (!fs.existsSync(imagesDir)) {
    console.error(`Error: Directory not found: ${imagesDir}`);
    process.exit(1);
  }

  // Get all files
  const files = getAllFiles(imagesDir);
  console.log(`Found ${files.length} files to upload\n`);

  // Upload results
  const results: UploadResult[] = [];
  const urlMapping: Record<string, string> = {};

  // Upload files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = path.relative(imagesDir, file);
    process.stdout.write(`[${i + 1}/${files.length}] Uploading ${relativePath}... `);

    const result = await uploadFile(file, imagesDir);
    results.push(result);

    if (result.success) {
      console.log('✓');
      urlMapping[result.localPath] = result.publicUrl;
    } else {
      console.log(`✗ (${result.error})`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Upload Summary');
  console.log('='.repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`Total files: ${results.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed uploads:');
    failed.forEach((r) => {
      console.log(`  - ${r.localPath}: ${r.error}`);
    });
  }

  // Write mapping file
  const mappingPath = path.join(process.cwd(), 'image-url-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(urlMapping, null, 2));
  console.log(`\nURL mapping saved to: ${mappingPath}`);

  // Print sample mappings
  console.log('\nSample URL mappings:');
  const sampleKeys = Object.keys(urlMapping).slice(0, 5);
  sampleKeys.forEach((key) => {
    console.log(`  ${key}`);
    console.log(`    → ${urlMapping[key]}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('Upload complete!');
  console.log('='.repeat(60));
}

main().catch(console.error);
