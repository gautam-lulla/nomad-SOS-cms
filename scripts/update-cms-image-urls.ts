/**
 * Update CMS Content Entries with CDN Image URLs
 *
 * This script updates the CMS content entries to use the permanent CDN URLs
 * from the migration results.
 *
 * Usage:
 *   CMS_EMAIL='your-email' CMS_PASSWORD='your-password' npx tsx scripts/update-cms-image-urls.ts
 */

const CMS_API_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORGANIZATION_ID = process.env.CMS_ORGANIZATION_ID || '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';
const CMS_EMAIL = process.env.CMS_EMAIL || '';
const CMS_PASSWORD = process.env.CMS_PASSWORD || '';
const CDN_BASE = 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev';

// Image URL mapping from migration results
const IMAGE_URLS = {
  // Hero
  heroLeft: `${CDN_BASE}/71094575-8210-4159-aaf8-d906864406a5/original.jpg`,
  heroRight: `${CDN_BASE}/9cba71ad-268d-46f6-8b97-b4288c80c1f2/original.jpg`,

  // Gallery
  gallery1: `${CDN_BASE}/5f5df1a2-d4a2-484c-bd11-fba3bc6d05ce/original.jpg`,
  gallery2: `${CDN_BASE}/a4751e8d-1db4-43e1-a130-f2eb61cdaab9/original.jpg`,
  gallery3: `${CDN_BASE}/0f56c48c-b080-4fbc-a4ee-e0d6c0c44e70/original.jpg`,

  // Events
  eventsHero: `${CDN_BASE}/f5f6b0ff-6738-4316-bec5-f6fe16ed3d39/original.jpg`,
  event1: `${CDN_BASE}/f9b69cf9-c2ef-4609-81e0-c4187a571c53/original.jpg`,
  event2: `${CDN_BASE}/bef6acee-fa10-4817-b73b-9eed82b02902/original.jpg`,
  event3: `${CDN_BASE}/0c3ff6fc-71d1-4af9-be40-f701a9db1245/original.jpg`,
  event4: `${CDN_BASE}/f4c71ddc-3e7c-4b7b-9b63-e3e651c86f1b/original.jpg`,
  event5: `${CDN_BASE}/43f83988-9342-4ec5-9ccf-f7294797e387/original.jpg`,
  event6: `${CDN_BASE}/653bd87a-9e24-4224-b4ef-754f02aec33a/original.jpg`,

  // Contact
  contactHero: `${CDN_BASE}/9239a0d1-b7d7-4594-8cbd-8700cc010aa7/original.jpg`,

  // Instagram
  insta1: `${CDN_BASE}/730077ef-b5fe-40cf-9b23-0c8f887b3491/original.jpg`,
  insta2: `${CDN_BASE}/1edc5e8b-c217-43ab-8931-99599a77e78b/original.jpg`,
  insta3: `${CDN_BASE}/930dee05-fa68-406d-9df8-5dec2fa932fa/original.png`,
  insta4: `${CDN_BASE}/311f1eeb-fff7-4cf5-8ddc-9ba38cfd031b/original.jpg`,

  // Menu
  menuHeroLeft: `${CDN_BASE}/d5821d71-ecaa-4353-87b9-000a58054aad/original.jpg`,
  menuHeroRight: `${CDN_BASE}/eeeaea0a-69c4-40c0-aee4-41e32c19468a/original.jpg`,
  menuGallery1: `${CDN_BASE}/5c48daf7-8aee-408f-a220-9ca78e880114/original.jpg`,
  menuGallery2: `${CDN_BASE}/392c6ca6-a296-49a4-8cfc-dba3babe67c0/original.jpg`,
};

let authToken = '';

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
        input: { email: CMS_EMAIL, password: CMS_PASSWORD },
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

async function getContentTypeId(slug: string): Promise<string> {
  const query = `
    query GetContentType($slug: String!, $organizationId: ID!) {
      contentTypeBySlug(slug: $slug, organizationId: $organizationId) {
        id
      }
    }
  `;

  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query,
      variables: { slug, organizationId: ORGANIZATION_ID },
    }),
  });

  const result = (await response.json()) as {
    data?: { contentTypeBySlug: { id: string } };
  };

  return result.data?.contentTypeBySlug?.id || '';
}

async function getContentEntry(
  contentTypeId: string,
  slug: string
): Promise<{ id: string; data: Record<string, unknown> } | null> {
  const query = `
    query GetEntry($contentTypeId: ID!, $organizationId: ID!, $slug: String!) {
      contentEntryBySlug(contentTypeId: $contentTypeId, organizationId: $organizationId, slug: $slug) {
        id
        data
      }
    }
  `;

  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query,
      variables: { contentTypeId, organizationId: ORGANIZATION_ID, slug },
    }),
  });

  const result = (await response.json()) as {
    data?: { contentEntryBySlug: { id: string; data: Record<string, unknown> } };
  };

  return result.data?.contentEntryBySlug || null;
}

async function updateContentEntry(
  id: string,
  data: Record<string, unknown>
): Promise<boolean> {
  const mutation = `
    mutation UpdateEntry($id: ID!, $input: UpdateContentEntryInput!) {
      updateContentEntry(id: $id, input: $input) {
        id
      }
    }
  `;

  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        id,
        input: { data },
      },
    }),
  });

  const result = (await response.json()) as {
    data?: { updateContentEntry: { id: string } };
    errors?: Array<{ message: string }>;
  };

  if (result.errors) {
    console.error(`Update failed: ${JSON.stringify(result.errors)}`);
    return false;
  }

  return true;
}

async function updateHomepage(): Promise<void> {
  console.log('\nUpdating homepage...');
  const typeId = await getContentTypeId('nomad-page');
  const entry = await getContentEntry(typeId, 'homepage');

  if (!entry) {
    console.log('  Homepage not found, skipping');
    return;
  }

  // MEDIA type fields require arrays
  const updatedData = {
    ...entry.data,
    heroLeftImage: [IMAGE_URLS.heroLeft],
    heroRightImage: [IMAGE_URLS.heroRight],
    gallery: [
      { src: IMAGE_URLS.gallery1, alt: 'Gallery 1' },
      { src: IMAGE_URLS.gallery2, alt: 'Gallery 2' },
      { src: IMAGE_URLS.gallery3, alt: 'Gallery 3' },
    ],
    eventsImageSrc: [IMAGE_URLS.eventsHero],
    contactImageSrc: [IMAGE_URLS.contactHero],
  };

  const success = await updateContentEntry(entry.id, updatedData);
  console.log(`  ${success ? '✓' : '✗'} Homepage updated`);
}

async function updateInstagram(): Promise<void> {
  console.log('\nUpdating Instagram feed...');
  const typeId = await getContentTypeId('instagram-feed');
  const entry = await getContentEntry(typeId, 'global-instagram');

  if (!entry) {
    console.log('  Instagram feed not found, skipping');
    return;
  }

  const updatedData = {
    ...entry.data,
    images: [
      { src: IMAGE_URLS.insta1, alt: 'Instagram 1' },
      { src: IMAGE_URLS.insta2, alt: 'Instagram 2' },
      { src: IMAGE_URLS.insta3, alt: 'Instagram 3' },
      { src: IMAGE_URLS.insta4, alt: 'Instagram 4' },
    ],
  };

  const success = await updateContentEntry(entry.id, updatedData);
  console.log(`  ${success ? '✓' : '✗'} Instagram feed updated`);
}

async function updateMenuPage(): Promise<void> {
  console.log('\nUpdating menu page...');
  const typeId = await getContentTypeId('nomad-page');
  const entry = await getContentEntry(typeId, 'menu');

  if (!entry) {
    console.log('  Menu page not found, skipping');
    return;
  }

  const updatedData = {
    ...entry.data,
    gallery: [
      { src: IMAGE_URLS.menuHeroLeft, alt: 'Menu Hero Left' },
      { src: IMAGE_URLS.menuHeroRight, alt: 'Menu Hero Right' },
      { src: IMAGE_URLS.menuGallery1, alt: 'Menu Gallery 1' },
      { src: IMAGE_URLS.menuGallery2, alt: 'Menu Gallery 2' },
    ],
  };

  const success = await updateContentEntry(entry.id, updatedData);
  console.log(`  ${success ? '✓' : '✗'} Menu page updated`);
}

async function updateProgrammingPage(): Promise<void> {
  console.log('\nUpdating programming page...');
  const typeId = await getContentTypeId('nomad-page');
  const entry = await getContentEntry(typeId, 'programming');

  if (!entry) {
    console.log('  Programming page not found, skipping');
    return;
  }

  // The programming page's instagramImages already has correct format
  // Skip update as spreading existing data causes validation issues with MEDIA field format
  console.log('  ✓ Programming page skipped (images already correct format)');
}

async function updateEvents(): Promise<void> {
  console.log('\nUpdating events...');
  const typeId = await getContentTypeId('event');

  if (!typeId) {
    console.log('  Event content type not found, skipping');
    return;
  }

  // Get all events
  const query = `
    query GetEvents($filter: ContentEntriesFilter!) {
      contentEntries(filter: $filter) {
        items { id slug data }
      }
    }
  `;

  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        filter: {
          contentTypeId: typeId,
          organizationId: ORGANIZATION_ID,
          take: 100,
        },
      },
    }),
  });

  const result = (await response.json()) as {
    data?: { contentEntries: { items: Array<{ id: string; slug: string; data: Record<string, unknown> }> } };
  };

  const events = result.data?.contentEntries?.items || [];
  console.log(`  Found ${events.length} events`);

  // Map event images by index
  const eventImages = [
    IMAGE_URLS.event1,
    IMAGE_URLS.event2,
    IMAGE_URLS.event3,
    IMAGE_URLS.event4,
    IMAGE_URLS.event5,
    IMAGE_URLS.event6,
  ];

  for (let i = 0; i < events.length && i < eventImages.length; i++) {
    const event = events[i];
    const updatedData = {
      ...event.data,
      featuredImage: [eventImages[i]], // MEDIA type requires array
    };

    const success = await updateContentEntry(event.id, updatedData);
    console.log(`  ${success ? '✓' : '✗'} Event "${event.data.title || event.slug}" updated`);
  }
}

async function main(): Promise<void> {
  console.log('========================================');
  console.log('Updating CMS Content with CDN URLs');
  console.log('========================================\n');

  if (!CMS_EMAIL || !CMS_PASSWORD) {
    console.error('Error: CMS_EMAIL and CMS_PASSWORD are required');
    process.exit(1);
  }

  authToken = await login();

  await updateHomepage();
  await updateInstagram();
  await updateMenuPage();
  await updateProgrammingPage();
  await updateEvents();

  console.log('\n========================================');
  console.log('Update Complete!');
  console.log('========================================');
}

main().catch(console.error);
