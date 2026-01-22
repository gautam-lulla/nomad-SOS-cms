/**
 * Fix Migration Script
 *
 * The initial migration created wrong content types (system ones instead of custom).
 * This script:
 * 1. Deletes the incorrectly created custom types from production
 * 2. Creates the correct custom types with proper fields
 * 3. Creates the missing content entries
 */

const LOCAL_CMS_URL = 'http://localhost:3001/graphql';
const PROD_CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORGANIZATION_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';
const CMS_EMAIL = 'dev@sphereos.local';
const CMS_PASSWORD = 'password123';

// Content type IDs in local that we need (the custom ones with more fields)
const LOCAL_CUSTOM_CONTENT_TYPES = {
  // Custom page with 14 fields
  'page': '54d15929-4f6a-4939-9423-338d7f9fd21f',
  // Custom event with 10 fields
  'event': '23d0f666-0a0e-465f-80ba-6cf396c2447c',
};

interface ContentType {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  isSystem?: boolean;
  fields: Array<{
    slug: string;
    name: string;
    type: string;
    required?: boolean;
    sortOrder?: number;
    validation?: unknown;
    uiConfig?: unknown;
  }>;
}

interface ContentEntry {
  id: string;
  slug: string;
  data: Record<string, unknown>;
  contentType: { id: string; slug: string };
}

let localToken = '';
let prodToken = '';

async function graphqlRequest<T>(
  url: string,
  query: string,
  variables?: Record<string, unknown>,
  token?: string
): Promise<T | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error('GraphQL Error:', JSON.stringify(result.errors, null, 2));
      return null;
    }
    return result.data || null;
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}

async function login(url: string, label: string): Promise<string> {
  console.log(`🔐 Authenticating with ${label}...`);
  const result = await graphqlRequest<{ login: { accessToken: string } }>(
    url,
    `mutation { login(input: { email: "${CMS_EMAIL}", password: "${CMS_PASSWORD}" }) { accessToken } }`
  );
  if (!result?.login?.accessToken) throw new Error(`Failed to auth with ${label}`);
  console.log(`   ✅ Authenticated`);
  return result.login.accessToken;
}

async function getContentTypeById(url: string, token: string, id: string): Promise<ContentType | null> {
  const result = await graphqlRequest<{ contentType: ContentType }>(
    url,
    `query GetContentType($id: ID!) {
      contentType(id: $id) {
        id slug name description icon isSystem
        fields { slug name type required sortOrder validation uiConfig }
      }
    }`,
    { id },
    token
  );
  return result?.contentType || null;
}

async function getContentTypeBySlug(url: string, token: string, slug: string): Promise<ContentType[]> {
  const result = await graphqlRequest<{ contentTypesByOrganization: ContentType[] }>(
    url,
    `query {
      contentTypesByOrganization(organizationId: "${ORGANIZATION_ID}") {
        id slug name isSystem fields { slug name type required sortOrder }
      }
    }`,
    {},
    token
  );
  return (result?.contentTypesByOrganization || []).filter(t => t.slug === slug);
}

async function deleteContentType(url: string, token: string, id: string): Promise<boolean> {
  const result = await graphqlRequest<{ deleteContentType: boolean }>(
    url,
    `mutation DeleteContentType($id: ID!) { deleteContentType(id: $id) }`,
    { id },
    token
  );
  return result?.deleteContentType === true;
}

async function createContentType(url: string, token: string, ct: ContentType): Promise<string | null> {
  const fields = ct.fields.map(f => ({
    slug: f.slug,
    name: f.name,
    type: f.type,
    required: f.required,
    sortOrder: f.sortOrder,
    validation: f.validation,
    uiConfig: f.uiConfig,
  }));

  const result = await graphqlRequest<{ createContentType: { id: string } }>(
    url,
    `mutation CreateContentType($input: CreateContentTypeInput!) {
      createContentType(input: $input) { id slug }
    }`,
    {
      input: {
        organizationId: ORGANIZATION_ID,
        slug: ct.slug,
        name: ct.name,
        description: ct.description,
        icon: ct.icon,
        fields,
      },
    },
    token
  );
  return result?.createContentType?.id || null;
}

async function getEntriesByContentType(url: string, token: string, contentTypeId: string): Promise<ContentEntry[]> {
  const result = await graphqlRequest<{ contentEntries: { items: ContentEntry[] } }>(
    url,
    `query GetEntries($filter: ContentEntryFilterInput!) {
      contentEntries(filter: $filter) {
        items { id slug data contentType { id slug } }
      }
    }`,
    { filter: { organizationId: ORGANIZATION_ID, contentTypeId, take: 100 } },
    token
  );
  return result?.contentEntries?.items || [];
}

async function createContentEntry(
  url: string,
  token: string,
  contentTypeId: string,
  slug: string,
  data: Record<string, unknown>
): Promise<string | null> {
  const result = await graphqlRequest<{ createContentEntry: { id: string } }>(
    url,
    `mutation CreateContentEntry($input: CreateContentEntryInput!) {
      createContentEntry(input: $input) { id slug }
    }`,
    {
      input: {
        organizationId: ORGANIZATION_ID,
        contentTypeId,
        slug,
        data,
      },
    },
    token
  );
  return result?.createContentEntry?.id || null;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           FIX MIGRATION - Correct Content Types           ');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Authenticate
  localToken = await login(LOCAL_CMS_URL, 'LOCAL');
  prodToken = await login(PROD_CMS_URL, 'PRODUCTION');

  // For each content type that needs fixing (page, event)
  for (const [slug, localId] of Object.entries(LOCAL_CUSTOM_CONTENT_TYPES)) {
    console.log(`\n━━━ Fixing "${slug}" content type ━━━\n`);

    // 1. Get the correct content type from local
    const localType = await getContentTypeById(LOCAL_CMS_URL, localToken, localId);
    if (!localType) {
      console.log(`   ❌ Could not find local content type ${slug} (${localId})`);
      continue;
    }
    console.log(`   Local "${slug}" has ${localType.fields.length} fields`);

    // 2. Get all matching content types in production
    const prodTypes = await getContentTypeBySlug(PROD_CMS_URL, prodToken, slug);
    console.log(`   Found ${prodTypes.length} "${slug}" types in production`);

    // 3. Delete non-system custom types from production
    for (const pt of prodTypes) {
      if (!pt.isSystem) {
        console.log(`   Deleting custom "${slug}" (${pt.id})...`);
        const deleted = await deleteContentType(PROD_CMS_URL, prodToken, pt.id);
        console.log(`   ${deleted ? '✅ Deleted' : '❌ Failed to delete'}`);
      } else {
        console.log(`   Keeping system "${slug}" (${pt.id})`);
      }
    }

    // 4. Create the correct content type in production
    console.log(`   Creating correct "${slug}" with ${localType.fields.length} fields...`);
    const newProdId = await createContentType(PROD_CMS_URL, prodToken, localType);
    if (!newProdId) {
      console.log(`   ❌ Failed to create "${slug}"`);
      continue;
    }
    console.log(`   ✅ Created "${slug}" (${newProdId})`);

    // 5. Get entries from local that use this content type
    const localEntries = await getEntriesByContentType(LOCAL_CMS_URL, localToken, localId);
    console.log(`   Found ${localEntries.length} entries to migrate`);

    // 6. Create entries in production
    for (const entry of localEntries) {
      console.log(`   Creating entry "${entry.slug}"...`);
      const entryId = await createContentEntry(PROD_CMS_URL, prodToken, newProdId, entry.slug, entry.data);
      console.log(`   ${entryId ? '✅' : '❌'} ${entry.slug}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    FIX COMPLETE                            ');
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Fix failed:', err);
  process.exit(1);
});
