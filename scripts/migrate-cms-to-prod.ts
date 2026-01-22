/**
 * CMS Migration Script - Local to Production
 *
 * This script:
 * 1. Authenticates with both local and production CMS
 * 2. Exports all content types from local
 * 3. Exports all content entries from local
 * 4. Deletes all content entries from production
 * 5. Deletes all content types from production
 * 6. Creates all content types in production
 * 7. Creates all content entries in production
 */

const LOCAL_CMS_URL = 'http://localhost:3001/graphql';
const PROD_CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORGANIZATION_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';
const CMS_EMAIL = 'dev@sphereos.local';
const CMS_PASSWORD = 'password123';

interface ContentType {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  fields: Array<{
    id?: string;
    slug: string;
    name: string;
    type: string;
    required?: boolean;
    localized?: boolean;
    unique?: boolean;
    sortOrder?: number;
    description?: string;
    defaultValue?: unknown;
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

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; extensions?: { code: string } }>;
}

let localToken = '';
let prodToken = '';

// Content type ID mapping: local ID -> production ID
const contentTypeIdMap = new Map<string, string>();

async function graphqlRequest<T>(
  url: string,
  query: string,
  variables?: Record<string, unknown>,
  token?: string
): Promise<T | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
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
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}

async function login(url: string, label: string): Promise<string | null> {
  console.log(`\n🔐 Authenticating with ${label}...`);

  const mutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
        user { id email }
      }
    }
  `;

  const result = await graphqlRequest<{ login: { accessToken: string; user: { email: string } } }>(
    url,
    mutation,
    { input: { email: CMS_EMAIL, password: CMS_PASSWORD } }
  );

  if (!result?.login?.accessToken) {
    console.error(`   ❌ Failed to authenticate with ${label}`);
    return null;
  }

  console.log(`   ✅ Logged in as: ${result.login.user.email}`);
  return result.login.accessToken;
}

async function getContentTypes(url: string, token: string, label: string): Promise<ContentType[]> {
  console.log(`\n📋 Fetching content types from ${label}...`);

  const query = `
    query GetContentTypesByOrganization($organizationId: ID!) {
      contentTypesByOrganization(organizationId: $organizationId) {
        id
        slug
        name
        description
        icon
        fields {
          id
          slug
          name
          type
          required
          localized
          unique
          sortOrder
          description
          defaultValue
          validation
          uiConfig
        }
      }
    }
  `;

  const result = await graphqlRequest<{ contentTypesByOrganization: ContentType[] }>(
    url,
    query,
    { organizationId: ORGANIZATION_ID },
    token
  );

  const types = result?.contentTypesByOrganization || [];
  console.log(`   Found ${types.length} content types`);
  types.forEach(t => console.log(`      - ${t.slug} (${t.fields.length} fields)`));

  return types;
}

async function getContentEntries(url: string, token: string, label: string): Promise<ContentEntry[]> {
  console.log(`\n📋 Fetching content entries from ${label}...`);

  const query = `
    query GetContentEntries($filter: ContentEntryFilterInput!) {
      contentEntries(filter: $filter) {
        items {
          id
          slug
          data
          contentType { id slug }
        }
        pagination { total hasMore }
      }
    }
  `;

  let allEntries: ContentEntry[] = [];
  let skip = 0;
  const take = 100;
  let hasMore = true;

  while (hasMore) {
    const result = await graphqlRequest<{
      contentEntries: {
        items: ContentEntry[];
        pagination: { total: number; hasMore: boolean }
      }
    }>(
      url,
      query,
      { filter: { organizationId: ORGANIZATION_ID, skip, take } },
      token
    );

    if (!result?.contentEntries) {
      break;
    }

    allEntries = [...allEntries, ...result.contentEntries.items];
    hasMore = result.contentEntries.pagination.hasMore;
    skip += take;
  }

  console.log(`   Found ${allEntries.length} content entries`);

  // Group by content type
  const byType = new Map<string, number>();
  allEntries.forEach(e => {
    const count = byType.get(e.contentType.slug) || 0;
    byType.set(e.contentType.slug, count + 1);
  });
  byType.forEach((count, slug) => console.log(`      - ${slug}: ${count} entries`));

  return allEntries;
}

async function deleteContentEntry(url: string, token: string, id: string): Promise<boolean> {
  const mutation = `
    mutation DeleteContentEntry($id: ID!) {
      deleteContentEntry(id: $id)
    }
  `;

  const result = await graphqlRequest<{ deleteContentEntry: boolean }>(
    url,
    mutation,
    { id },
    token
  );

  return result?.deleteContentEntry === true;
}

async function deleteContentType(url: string, token: string, id: string): Promise<boolean> {
  const mutation = `
    mutation DeleteContentType($id: ID!) {
      deleteContentType(id: $id)
    }
  `;

  const result = await graphqlRequest<{ deleteContentType: boolean }>(
    url,
    mutation,
    { id },
    token
  );

  return result?.deleteContentType === true;
}

async function createContentType(
  url: string,
  token: string,
  contentType: ContentType
): Promise<string | null> {
  const mutation = `
    mutation CreateContentType($input: CreateContentTypeInput!) {
      createContentType(input: $input) {
        id
        slug
      }
    }
  `;

  // Remove field IDs for creation
  const fields = contentType.fields.map(f => ({
    slug: f.slug,
    name: f.name,
    type: f.type,
    required: f.required,
    localized: f.localized,
    unique: f.unique,
    sortOrder: f.sortOrder,
    description: f.description,
    defaultValue: f.defaultValue,
    validation: f.validation,
    uiConfig: f.uiConfig,
  }));

  const result = await graphqlRequest<{ createContentType: { id: string; slug: string } }>(
    url,
    mutation,
    {
      input: {
        organizationId: ORGANIZATION_ID,
        slug: contentType.slug,
        name: contentType.name,
        description: contentType.description,
        icon: contentType.icon,
        fields,
      },
    },
    token
  );

  return result?.createContentType?.id || null;
}

async function createContentEntry(
  url: string,
  token: string,
  entry: ContentEntry,
  newContentTypeId: string
): Promise<string | null> {
  const mutation = `
    mutation CreateContentEntry($input: CreateContentEntryInput!) {
      createContentEntry(input: $input) {
        id
        slug
      }
    }
  `;

  const result = await graphqlRequest<{ createContentEntry: { id: string; slug: string } }>(
    url,
    mutation,
    {
      input: {
        organizationId: ORGANIZATION_ID,
        contentTypeId: newContentTypeId,
        slug: entry.slug,
        data: entry.data,
      },
    },
    token
  );

  return result?.createContentEntry?.id || null;
}

async function deleteAllEntries(url: string, token: string, entries: ContentEntry[]): Promise<void> {
  console.log(`\n🗑️  Deleting ${entries.length} content entries from production...`);

  let deleted = 0;
  let failed = 0;

  for (const entry of entries) {
    const success = await deleteContentEntry(url, token, entry.id);
    if (success) {
      deleted++;
      process.stdout.write(`\r   Deleted: ${deleted}/${entries.length}`);
    } else {
      failed++;
      console.log(`\n   ❌ Failed to delete entry: ${entry.slug}`);
    }
  }

  console.log(`\n   ✅ Deleted ${deleted} entries, ${failed} failed`);
}

async function deleteAllContentTypes(url: string, token: string, types: ContentType[]): Promise<void> {
  console.log(`\n🗑️  Deleting ${types.length} content types from production...`);

  let deleted = 0;
  let failed = 0;

  for (const type of types) {
    const success = await deleteContentType(url, token, type.id);
    if (success) {
      deleted++;
      console.log(`   ✅ Deleted: ${type.slug}`);
    } else {
      failed++;
      console.log(`   ❌ Failed to delete: ${type.slug}`);
    }
  }

  console.log(`   Total: ${deleted} deleted, ${failed} failed`);
}

async function createAllContentTypes(
  url: string,
  token: string,
  types: ContentType[]
): Promise<void> {
  console.log(`\n📝 Creating ${types.length} content types in production...`);

  let created = 0;
  let failed = 0;

  for (const type of types) {
    const newId = await createContentType(url, token, type);
    if (newId) {
      created++;
      contentTypeIdMap.set(type.id, newId);
      console.log(`   ✅ Created: ${type.slug} (${newId})`);
    } else {
      failed++;
      console.log(`   ❌ Failed to create: ${type.slug}`);
    }
  }

  console.log(`   Total: ${created} created, ${failed} failed`);
}

async function createAllContentEntries(
  url: string,
  token: string,
  entries: ContentEntry[]
): Promise<void> {
  console.log(`\n📝 Creating ${entries.length} content entries in production...`);

  let created = 0;
  let failed = 0;

  for (const entry of entries) {
    const newContentTypeId = contentTypeIdMap.get(entry.contentType.id);

    if (!newContentTypeId) {
      console.log(`   ⚠️  Skipping ${entry.slug}: content type ${entry.contentType.slug} not mapped`);
      failed++;
      continue;
    }

    const newId = await createContentEntry(url, token, entry, newContentTypeId);
    if (newId) {
      created++;
      process.stdout.write(`\r   Created: ${created}/${entries.length}`);
    } else {
      failed++;
      console.log(`\n   ❌ Failed to create: ${entry.slug}`);
    }
  }

  console.log(`\n   Total: ${created} created, ${failed} failed`);
}

async function main(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('         CMS MIGRATION - Local to Production               ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Local:  ${LOCAL_CMS_URL}`);
  console.log(`Prod:   ${PROD_CMS_URL}`);
  console.log(`Org ID: ${ORGANIZATION_ID}`);

  // Step 1: Authenticate with both
  localToken = await login(LOCAL_CMS_URL, 'LOCAL CMS') || '';
  prodToken = await login(PROD_CMS_URL, 'PRODUCTION CMS') || '';

  if (!localToken || !prodToken) {
    console.error('\n❌ Authentication failed. Aborting.');
    process.exit(1);
  }

  // Step 2: Export from local
  const localContentTypes = await getContentTypes(LOCAL_CMS_URL, localToken, 'local');
  const localContentEntries = await getContentEntries(LOCAL_CMS_URL, localToken, 'local');

  if (localContentTypes.length === 0) {
    console.log('\n⚠️  No content types found in local. Nothing to migrate.');
    process.exit(0);
  }

  // Step 3: Get current production data (for deletion)
  const prodContentTypes = await getContentTypes(PROD_CMS_URL, prodToken, 'production');
  const prodContentEntries = await getContentEntries(PROD_CMS_URL, prodToken, 'production');

  // Step 4: Delete all entries from production first (due to foreign key constraints)
  if (prodContentEntries.length > 0) {
    await deleteAllEntries(PROD_CMS_URL, prodToken, prodContentEntries);
  } else {
    console.log('\n✅ No content entries to delete in production');
  }

  // Step 5: Delete all content types from production
  if (prodContentTypes.length > 0) {
    await deleteAllContentTypes(PROD_CMS_URL, prodToken, prodContentTypes);
  } else {
    console.log('\n✅ No content types to delete in production');
  }

  // Step 6: Create content types in production
  await createAllContentTypes(PROD_CMS_URL, prodToken, localContentTypes);

  // Step 7: Create content entries in production
  await createAllContentEntries(PROD_CMS_URL, prodToken, localContentEntries);

  // Verification
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    VERIFICATION                            ');
  console.log('═══════════════════════════════════════════════════════════');

  const finalTypes = await getContentTypes(PROD_CMS_URL, prodToken, 'production (final)');
  const finalEntries = await getContentEntries(PROD_CMS_URL, prodToken, 'production (final)');

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                      SUMMARY                               ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n   Local content types:     ${localContentTypes.length}`);
  console.log(`   Local content entries:   ${localContentEntries.length}`);
  console.log(`   Production content types:  ${finalTypes.length}`);
  console.log(`   Production content entries: ${finalEntries.length}`);

  if (finalTypes.length === localContentTypes.length &&
      finalEntries.length === localContentEntries.length) {
    console.log('\n🎉 Migration completed successfully!');
  } else {
    console.log('\n⚠️  Migration completed with discrepancies. Please verify manually.');
  }

  console.log('\n═══════════════════════════════════════════════════════════');
}

main().catch((error) => {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
});
