/**
 * Check CMS State - debug script
 */

const CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORG_ID = 'a6c56e11-6888-41a1-b3cf-9d31bf6e3be5';

let AUTH_TOKEN = '';

async function graphql(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(CMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(AUTH_TOKEN && { 'Authorization': `Bearer ${AUTH_TOKEN}` }),
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

async function main() {
  // Login
  console.log('Logging in...');
  const loginResult = await graphql(`
    mutation {
      login(input: { email: "dev@sphereos.local", password: "password123" }) {
        accessToken
        user { id email }
      }
    }
  `);
  AUTH_TOKEN = loginResult.data?.login?.accessToken;
  console.log('User:', loginResult.data?.login?.user);

  // Check organizations
  console.log('\n=== Organizations ===');
  const orgsResult = await graphql(`
    query { organizations { id slug name } }
  `);
  console.log(JSON.stringify(orgsResult.data?.organizations, null, 2));

  // Check all content types (no org filter)
  console.log('\n=== All Content Types ===');
  const typesResult = await graphql(`
    query { contentTypes { items { id slug name organizationId } } }
  `);
  console.log(JSON.stringify(typesResult.data?.contentTypes?.items, null, 2));

  // Check content types for specific org
  console.log('\n=== Content Types for Org:', ORG_ID, '===');
  const orgTypesResult = await graphql(`
    query GetTypes($orgId: ID!) {
      contentTypes(filter: { organizationId: $orgId }) {
        items { id slug name organizationId }
      }
    }
  `, { orgId: ORG_ID });
  console.log(JSON.stringify(orgTypesResult, null, 2));
}

main().catch(console.error);
