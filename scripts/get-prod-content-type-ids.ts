/**
 * Get production content type IDs for updating the content layer
 */

const PROD_CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORGANIZATION_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

async function main() {
  const loginRes = await fetch(PROD_CMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { login(input: { email: "dev@sphereos.local", password: "password123" }) { accessToken } }`
    })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.login?.accessToken;

  const typesRes = await fetch(PROD_CMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      query: `query { contentTypesByOrganization(organizationId: "${ORGANIZATION_ID}") { id slug isSystem } }`
    })
  });
  const typesData = await typesRes.json();

  const customTypes = typesData.data.contentTypesByOrganization.filter(
    (t: { isSystem: boolean }) => !t.isSystem
  );

  console.log('// Production Content Type IDs');
  console.log('const CONTENT_TYPE_IDS: Record<string, string> = {');
  for (const ct of customTypes.sort((a: { slug: string }, b: { slug: string }) => a.slug.localeCompare(b.slug))) {
    console.log(`  '${ct.slug}': '${ct.id}',`);
  }
  console.log('};');
}

main();
