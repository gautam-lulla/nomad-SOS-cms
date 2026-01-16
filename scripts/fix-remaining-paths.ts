/**
 * Fix remaining local image paths in CMS entries
 */

const CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORG_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';
const R2_BASE = 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/nomad';

let AUTH_TOKEN = '';

async function graphql(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(CMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

function replaceLocalPaths(obj: unknown): unknown {
  if (typeof obj === 'string') {
    if (obj.startsWith('/images/')) {
      const filename = obj.replace('/images/', '');
      return `${R2_BASE}/${filename}`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(replaceLocalPaths);
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceLocalPaths(value);
    }
    return result;
  }
  return obj;
}

async function main() {
  // Login
  const loginRes = await graphql(`
    mutation {
      login(input: { email: "dev@sphereos.local", password: "password123" }) {
        accessToken
      }
    }
  `);
  AUTH_TOKEN = loginRes.data?.login?.accessToken;
  console.log('Logged in');

  // Get content type ID
  const typeRes = await graphql(`
    query {
      contentTypeBySlug(slug: "nomad-page", organizationId: "${ORG_ID}") {
        id
      }
    }
  `);
  const typeId = typeRes.data?.contentTypeBySlug?.id;
  console.log('Content type ID:', typeId);

  // Get all entries
  const entriesRes = await graphql(`
    query {
      contentEntries(filter: { contentTypeId: "${typeId}", organizationId: "${ORG_ID}" }) {
        items { id slug data }
      }
    }
  `);

  const entries = entriesRes.data?.contentEntries?.items || [];
  console.log(`Found ${entries.length} entries\n`);

  for (const entry of entries) {
    const originalJson = JSON.stringify(entry.data);
    const updatedData = replaceLocalPaths(entry.data);
    const updatedJson = JSON.stringify(updatedData);

    if (originalJson !== updatedJson) {
      process.stdout.write(`${entry.slug}... `);

      const updateRes = await graphql(
        `
        mutation UpdateEntry($id: ID!, $input: UpdateContentEntryInput!) {
          updateContentEntry(id: $id, input: $input) { id slug }
        }
      `,
        { id: entry.id, input: { data: updatedData } }
      );

      if (updateRes.data?.updateContentEntry) {
        console.log('✓ Updated');
      } else {
        console.log('✗ Failed:', JSON.stringify(updateRes.errors));
      }
    } else {
      console.log(`${entry.slug} - no local paths`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
