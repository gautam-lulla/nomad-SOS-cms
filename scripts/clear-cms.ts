/**
 * Clear all CMS content types and entries for fresh figma-to-code run
 */

const CMS_API_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORGANIZATION_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

const CMS_EMAIL = process.env.CMS_EMAIL || 'dev@sphereos.local';
const CMS_PASSWORD = process.env.CMS_PASSWORD || 'password123';

let authToken = '';

async function login(): Promise<string> {
  const response = await fetch(CMS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { login(input: { email: "${CMS_EMAIL}", password: "${CMS_PASSWORD}" }) { accessToken user { email } } }`,
    }),
  });
  const result = (await response.json()) as { data?: { login: { accessToken: string } }; errors?: unknown[] };
  if (result.errors) throw new Error(`Login failed: ${JSON.stringify(result.errors)}`);
  console.log('✓ Authenticated with CMS\n');
  return result.data!.login.accessToken;
}

async function gqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
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
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }
  return result.data as T;
}

interface ContentType {
  id: string;
  slug: string;
  name: string;
  organization: { id: string };
}

interface ContentEntry {
  id: string;
  slug: string;
}

async function getContentTypes(): Promise<ContentType[]> {
  const data = await gqlRequest<{ contentTypes: { items: ContentType[] } }>(
    `query { contentTypes { items { id slug name organization { id } } } }`
  );
  return data.contentTypes.items.filter(ct => ct.organization?.id === ORGANIZATION_ID);
}

async function getEntries(contentTypeId: string): Promise<ContentEntry[]> {
  const data = await gqlRequest<{ contentEntries: { items: ContentEntry[] } }>(
    `query($filter: ContentEntryFilterInput!) { contentEntries(filter: $filter) { items { id slug } } }`,
    { filter: { contentTypeId, organizationId: ORGANIZATION_ID, take: 100 } }
  );
  return data.contentEntries.items;
}

async function deleteEntry(id: string): Promise<void> {
  await gqlRequest(
    `mutation($id: ID!) { deleteContentEntry(id: $id) }`,
    { id }
  );
}

async function deleteContentType(id: string): Promise<void> {
  await gqlRequest(
    `mutation($id: ID!) { deleteContentType(id: $id) }`,
    { id }
  );
}

async function main() {
  console.log('========================================');
  console.log('Clearing CMS for Fresh Figma-to-Code Run');
  console.log('========================================\n');

  authToken = await login();

  // Get all content types for this organization
  const contentTypes = await getContentTypes();
  console.log(`Found ${contentTypes.length} content types to delete:\n`);

  for (const ct of contentTypes) {
    console.log(`  - ${ct.name} (${ct.slug})`);
  }
  console.log('');

  // Delete all entries first
  console.log('Step 1: Deleting all content entries...\n');

  for (const ct of contentTypes) {
    const entries = await getEntries(ct.id);
    if (entries.length > 0) {
      console.log(`  ${ct.name}: ${entries.length} entries`);
      for (const entry of entries) {
        try {
          await deleteEntry(entry.id);
          process.stdout.write('.');
        } catch (e) {
          process.stdout.write('x');
        }
      }
      console.log(' ✓');
    } else {
      console.log(`  ${ct.name}: 0 entries`);
    }
  }

  // Delete content types
  console.log('\nStep 2: Deleting content types...\n');

  for (const ct of contentTypes) {
    try {
      await deleteContentType(ct.id);
      console.log(`  ✓ Deleted ${ct.name}`);
    } catch (e) {
      console.log(`  ✗ Failed to delete ${ct.name}: ${(e as Error).message}`);
    }
  }

  console.log('\n========================================');
  console.log('CMS Cleared Successfully!');
  console.log('========================================');
  console.log('\nReady for fresh figma-to-code run.');
}

main().catch(console.error);
