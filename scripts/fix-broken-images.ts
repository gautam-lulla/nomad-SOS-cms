/**
 * Fix Broken Images - Update CMS Entries with Valid CDN URLs
 *
 * This script fixes all broken images identified in the Visual QA Report by
 * updating the CMS entries with the correct CDN URLs.
 *
 * Affected entries:
 * - global-settings: logoUrl (for navigation)
 * - global-footer: footerLogo, wordmark
 * - global-instagram: image1-4 with alt texts
 *
 * Usage:
 *   CMS_EMAIL='your-email' CMS_PASSWORD='your-password' npx tsx scripts/fix-broken-images.ts
 */

// Use local CMS by default for development, override with CMS_API_URL for production
const CMS_API_URL = process.env.CMS_API_URL || 'http://localhost:3001/graphql';
const ORGANIZATION_ID = process.env.CMS_ORGANIZATION_ID || '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';
// Default to local dev credentials
const CMS_EMAIL = process.env.CMS_EMAIL || 'dev@sphereos.local';
const CMS_PASSWORD = process.env.CMS_PASSWORD || 'password123';
const CDN_BASE = 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev';

// Content Type IDs from the CMS
const CONTENT_TYPE_IDS: Record<string, string> = {
  'site-settings': 'c675b32e-649c-4c6b-94db-cb57224d1a9b',
  'footer': '1ac54fb2-fed8-49d8-b483-2c1d6c1a9eff',
  'instagram-feed': '53f450dc-916c-4618-9388-e2b6cf05ab2e',
  'gallery': '7e05102c-b270-45bd-8a34-e402d63e7852',
  'hero-section': 'f568e78c-1037-40d3-8a65-4f52685a1eb2',
};

// Use local paths for logos (served by Next.js from public folder)
// These will work in development. For production, upload to R2 and update these URLs.
const LOCAL_BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// CDN Image URLs - All verified working URLs
const CDN_URLS = {
  logos: {
    // Local SVG logos (from Figma export) - use local paths for dev
    mark: `${LOCAL_BASE}/images/logos/nav-logo-emblem.svg`,
    footerMark: `${LOCAL_BASE}/images/logos/footer-mark.svg`,
    wordmark: `${LOCAL_BASE}/images/logos/footer-wordmark.svg`,
  },
  instagram: {
    image1: `${CDN_BASE}/730077ef-b5fe-40cf-9b23-0c8f887b3491/original.jpg`,
    image2: `${CDN_BASE}/1edc5e8b-c217-43ab-8931-99599a77e78b/original.jpg`,
    image3: `${CDN_BASE}/930dee05-fa68-406d-9df8-5dec2fa932fa/original.png`,
    image4: `${CDN_BASE}/311f1eeb-fff7-4cf5-8ddc-9ba38cfd031b/original.jpg`,
  },
  gallery: {
    image1: `${CDN_BASE}/5f5df1a2-d4a2-484c-bd11-fba3bc6d05ce/original.jpg`,
    image2: `${CDN_BASE}/a4751e8d-1db4-43e1-a130-f2eb61cdaab9/original.jpg`,
    image3: `${CDN_BASE}/0f56c48c-b080-4fbc-a4ee-e0d6c0c44e70/original.jpg`,
  },
};

let authToken = '';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const result = (await response.json()) as GraphQLResponse<T>;

  if (result.errors) {
    console.error('GraphQL Error:', JSON.stringify(result.errors, null, 2));
    return null;
  }

  return result.data || null;
}

async function login(): Promise<boolean> {
  console.log('\n📋 Authenticating with CMS...');

  const mutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
        user { id email }
      }
    }
  `;

  const result = await graphqlRequest<{ login: { accessToken: string; user: { email: string } } }>(
    mutation,
    { input: { email: CMS_EMAIL, password: CMS_PASSWORD } }
  );

  if (!result?.login?.accessToken) {
    console.error('Failed to authenticate');
    return false;
  }

  authToken = result.login.accessToken;
  console.log(`   Logged in as: ${result.login.user.email}`);
  return true;
}

async function getContentEntry(
  contentTypeId: string,
  slug: string
): Promise<{ id: string; data: Record<string, unknown> } | null> {
  const query = `
    query GetEntry($contentTypeId: ID!, $organizationId: ID!, $slug: String!) {
      contentEntryBySlug(contentTypeId: $contentTypeId, organizationId: $organizationId, slug: $slug) {
        id
        slug
        data
      }
    }
  `;

  const result = await graphqlRequest<{ contentEntryBySlug: { id: string; slug: string; data: Record<string, unknown> } }>(
    query,
    { contentTypeId, organizationId: ORGANIZATION_ID, slug }
  );

  return result?.contentEntryBySlug || null;
}

async function updateContentEntry(
  id: string,
  data: Record<string, unknown>
): Promise<boolean> {
  const mutation = `
    mutation UpdateEntry($id: ID!, $input: UpdateContentEntryInput!) {
      updateContentEntry(id: $id, input: $input) {
        id
        slug
      }
    }
  `;

  const result = await graphqlRequest<{ updateContentEntry: { id: string } }>(
    mutation,
    { id, input: { data } }
  );

  return !!result?.updateContentEntry?.id;
}

async function fixGlobalSettings(): Promise<boolean> {
  console.log('\n🔧 Fixing global-settings (navigation logo)...');

  const entry = await getContentEntry(CONTENT_TYPE_IDS['site-settings'], 'global-settings');

  if (!entry) {
    console.log('   ⚠️  Entry not found');
    return false;
  }

  const updatedData = {
    ...entry.data,
    // MEDIA fields require arrays - using local paths for development
    logoUrl: [CDN_URLS.logos.mark],
  };

  const success = await updateContentEntry(entry.id, updatedData);
  console.log(`   ${success ? '✅' : '❌'} global-settings updated`);

  if (success) {
    console.log(`      - logoUrl: ${CDN_URLS.logos.mark}`);
  }

  return success;
}

async function fixGlobalFooter(): Promise<boolean> {
  console.log('\n🔧 Fixing global-footer (footer logo and wordmark)...');

  const entry = await getContentEntry(CONTENT_TYPE_IDS['footer'], 'global-footer');

  if (!entry) {
    console.log('   ⚠️  Entry not found');
    return false;
  }

  const updatedData = {
    ...entry.data,
    // MEDIA fields require arrays - using local paths for development
    footerLogo: [CDN_URLS.logos.footerMark],
    wordmark: [CDN_URLS.logos.wordmark],
  };

  const success = await updateContentEntry(entry.id, updatedData);
  console.log(`   ${success ? '✅' : '❌'} global-footer updated`);

  if (success) {
    console.log(`      - footerLogo: ${CDN_URLS.logos.footerMark}`);
    console.log(`      - wordmark: ${CDN_URLS.logos.wordmark}`);
  }

  return success;
}

async function fixGlobalInstagram(): Promise<boolean> {
  console.log('\n🔧 Fixing global-instagram (4 feed images)...');

  const entry = await getContentEntry(CONTENT_TYPE_IDS['instagram-feed'], 'global-instagram');

  if (!entry) {
    console.log('   ⚠️  Entry not found');
    return false;
  }

  const updatedData = {
    ...entry.data,
    // Individual MEDIA fields for each image
    image1: [CDN_URLS.instagram.image1],
    image1Alt: 'NoMad Wynwood atmosphere',
    image2: [CDN_URLS.instagram.image2],
    image2Alt: 'NoMad Wynwood dining',
    image3: [CDN_URLS.instagram.image3],
    image3Alt: 'NoMad Wynwood cuisine',
    image4: [CDN_URLS.instagram.image4],
    image4Alt: 'NoMad Wynwood cocktails',
  };

  const success = await updateContentEntry(entry.id, updatedData);
  console.log(`   ${success ? '✅' : '❌'} global-instagram updated`);

  if (success) {
    console.log(`      - image1: ${CDN_URLS.instagram.image1}`);
    console.log(`      - image2: ${CDN_URLS.instagram.image2}`);
    console.log(`      - image3: ${CDN_URLS.instagram.image3}`);
    console.log(`      - image4: ${CDN_URLS.instagram.image4}`);
  }

  return success;
}

async function createPrivateEventsGallery(): Promise<boolean> {
  console.log('\n🔧 Creating private-events-gallery entry...');

  // First check if it already exists
  const existing = await getContentEntry(CONTENT_TYPE_IDS['gallery'], 'private-events-gallery');
  if (existing) {
    console.log('   ℹ️  Entry already exists, updating...');
  }

  const galleryData = {
    name: 'Private Events Gallery',
    sectionLabel: 'Our Spaces',
    image1: [CDN_URLS.gallery.image1],
    image1Alt: 'NoMad Wynwood private dining room',
    image2: [CDN_URLS.gallery.image2],
    image2Alt: 'NoMad Wynwood bar area',
    image3: [CDN_URLS.gallery.image3],
    image3Alt: 'NoMad Wynwood lounge',
  };

  if (existing) {
    const success = await updateContentEntry(existing.id, galleryData);
    console.log(`   ${success ? '✅' : '❌'} private-events-gallery updated`);
    return success;
  }

  // Create new entry
  const mutation = `
    mutation CreateEntry($input: CreateContentEntryInput!) {
      createContentEntry(input: $input) {
        id
        slug
      }
    }
  `;

  const result = await graphqlRequest<{ createContentEntry: { id: string; slug: string } }>(
    mutation,
    {
      input: {
        contentTypeId: CONTENT_TYPE_IDS['gallery'],
        organizationId: ORGANIZATION_ID,
        slug: 'private-events-gallery',
        data: galleryData,
      },
    }
  );

  const success = !!result?.createContentEntry?.id;
  console.log(`   ${success ? '✅' : '❌'} private-events-gallery created`);
  return success;
}

async function verifyFixes(): Promise<void> {
  console.log('\n📋 Verifying fixes...');

  // Verify global-settings
  const settings = await getContentEntry(CONTENT_TYPE_IDS['site-settings'], 'global-settings');
  if (settings) {
    const logoUrl = settings.data.logoUrl;
    const hasLogo = Array.isArray(logoUrl) ? logoUrl[0] : logoUrl;
    console.log(`   global-settings.logoUrl: ${hasLogo ? '✅ Set' : '❌ Missing'}`);
  }

  // Verify global-footer
  const footer = await getContentEntry(CONTENT_TYPE_IDS['footer'], 'global-footer');
  if (footer) {
    const footerLogo = footer.data.footerLogo;
    const wordmark = footer.data.wordmark;
    const hasFooterLogo = Array.isArray(footerLogo) ? footerLogo[0] : footerLogo;
    const hasWordmark = Array.isArray(wordmark) ? wordmark[0] : wordmark;
    console.log(`   global-footer.footerLogo: ${hasFooterLogo ? '✅ Set' : '❌ Missing'}`);
    console.log(`   global-footer.wordmark: ${hasWordmark ? '✅ Set' : '❌ Missing'}`);
  }

  // Verify global-instagram
  const instagram = await getContentEntry(CONTENT_TYPE_IDS['instagram-feed'], 'global-instagram');
  if (instagram) {
    for (let i = 1; i <= 4; i++) {
      const img = instagram.data[`image${i}`];
      const hasImage = Array.isArray(img) ? img[0] : img;
      console.log(`   global-instagram.image${i}: ${hasImage ? '✅ Set' : '❌ Missing'}`);
    }
  }

  // Verify private-events-gallery
  const gallery = await getContentEntry(CONTENT_TYPE_IDS['gallery'], 'private-events-gallery');
  if (gallery) {
    console.log(`   private-events-gallery: ✅ Exists`);
  } else {
    console.log(`   private-events-gallery: ❌ Missing`);
  }
}

async function main(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           FIX BROKEN IMAGES - CMS Update Script           ');
  console.log('═══════════════════════════════════════════════════════════');

  // Validate credentials
  if (!CMS_EMAIL || !CMS_PASSWORD) {
    console.error('\n❌ Error: CMS_EMAIL and CMS_PASSWORD environment variables are required');
    console.log('\nUsage:');
    console.log('  CMS_EMAIL="your@email.com" CMS_PASSWORD="password" npx tsx scripts/fix-broken-images.ts');
    process.exit(1);
  }

  // Authenticate
  const loggedIn = await login();
  if (!loggedIn) {
    console.error('\n❌ Authentication failed. Please check your credentials.');
    process.exit(1);
  }

  // Track results
  const results: { name: string; success: boolean }[] = [];

  // Fix each entry
  results.push({ name: 'global-settings', success: await fixGlobalSettings() });
  results.push({ name: 'global-footer', success: await fixGlobalFooter() });
  results.push({ name: 'global-instagram', success: await fixGlobalInstagram() });

  // Create missing entries
  results.push({ name: 'private-events-gallery', success: await createPrivateEventsGallery() });

  // Verify
  await verifyFixes();

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                        SUMMARY                             ');
  console.log('═══════════════════════════════════════════════════════════');

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log(`\n   Total entries processed: ${results.length}`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);

  if (failCount === 0) {
    console.log('\n🎉 All image URLs have been updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Restart the dev server: npm run dev');
    console.log('   2. Clear browser cache and refresh');
    console.log('   3. Verify images load correctly in the browser');
    console.log('   4. Run QA screenshot capture: npx tsx qa/screenshot-capture.ts');
  } else {
    console.log('\n⚠️  Some updates failed. Please check the errors above.');
  }

  console.log('\n═══════════════════════════════════════════════════════════');
}

main().catch((error) => {
  console.error('\n❌ Script failed:', error.message);
  process.exit(1);
});
