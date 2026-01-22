const PROD_CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORGANIZATION_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

interface ContentType {
  id: string;
  slug: string;
  name: string;
  isSystem: boolean;
  fields: Array<{ slug: string; name: string; type: string }>;
}

async function main() {
  // Login
  const loginRes = await fetch(PROD_CMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { login(input: { email: "dev@sphereos.local", password: "password123" }) { accessToken } }`
    })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.login?.accessToken;

  if (!token) {
    console.error('Login failed');
    return;
  }

  // Get content types
  const typesRes = await fetch(PROD_CMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      query: `query { contentTypesByOrganization(organizationId: "${ORGANIZATION_ID}") { id slug name isSystem fields { slug name type } } }`
    })
  });
  const typesData = await typesRes.json();

  console.log('\nContent Types in Production:\n');
  const types = typesData.data?.contentTypesByOrganization as ContentType[];

  // Find the page content type that has our fields
  const pageTypes = types.filter(ct => ct.slug === 'page');
  console.log('PAGE CONTENT TYPES:');
  for (const ct of pageTypes) {
    const label = ct.isSystem ? '[SYSTEM]' : '[CUSTOM]';
    console.log(`\n${label} ${ct.slug} (${ct.id})`);
    console.log(`   Fields (${ct.fields.length}): ${ct.fields.map(f => f.slug).join(', ')}`);
  }

  const eventTypes = types.filter(ct => ct.slug === 'event');
  console.log('\n\nEVENT CONTENT TYPES:');
  for (const ct of eventTypes) {
    const label = ct.isSystem ? '[SYSTEM]' : '[CUSTOM]';
    console.log(`\n${label} ${ct.slug} (${ct.id})`);
    console.log(`   Fields (${ct.fields.length}): ${ct.fields.map(f => f.slug).join(', ')}`);
  }
}
main();
