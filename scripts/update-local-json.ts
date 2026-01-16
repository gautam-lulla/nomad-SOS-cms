/**
 * Update Local JSON Files with R2 URLs
 *
 * This script updates all local JSON content files to use
 * Cloudflare R2 URLs instead of local image paths.
 *
 * Usage: npx tsx scripts/update-local-json.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Load URL mapping
const mappingPath = path.join(process.cwd(), 'image-url-mapping.json');
const urlMapping: Record<string, string> = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

/**
 * Recursively replace image URLs in an object
 */
function replaceImageUrls(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // Check if this string is an image path that needs replacing
    if (urlMapping[obj]) {
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
 * Update a single JSON file
 */
function updateJsonFile(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const updatedData = replaceImageUrls(data);

    // Check if changes were made
    if (JSON.stringify(data) !== JSON.stringify(updatedData)) {
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2) + '\n');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Local JSON URL Migration');
  console.log('='.repeat(60));

  const contentDirs = [
    path.join(process.cwd(), 'src', 'content', 'pages'),
    path.join(process.cwd(), 'src', 'content', 'global'),
  ];

  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const dir of contentDirs) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory not found: ${dir}`);
      continue;
    }

    console.log(`\nProcessing: ${dir}`);

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(dir, file);
      process.stdout.write(`  ${file}... `);

      const updated = updateJsonFile(filePath);
      if (updated) {
        console.log('✓ Updated');
        totalUpdated++;
      } else {
        console.log('- No changes');
        totalSkipped++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Files updated: ${totalUpdated}`);
  console.log(`Files unchanged: ${totalSkipped}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
