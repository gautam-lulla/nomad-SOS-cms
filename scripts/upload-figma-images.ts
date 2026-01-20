/**
 * Script to download images from Figma and upload to CMS via GraphQL
 */

const GRAPHQL_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORG_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

// Auth credentials
const AUTH_EMAIL = 'dev@sphereos.local';
const AUTH_PASSWORD = 'password123';

let accessToken: string | null = null;

async function login(): Promise<string> {
  const mutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
        user { id email }
      }
    }
  `;

  const variables = {
    input: {
      email: AUTH_EMAIL,
      password: AUTH_PASSWORD,
    },
  };

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(`Login failed: ${JSON.stringify(result.errors)}`);
  }

  console.log(`Logged in as: ${result.data.login.user.email}`);
  return result.data.login.accessToken;
}

// All unique image URLs extracted from Figma wireframes
const FIGMA_IMAGES = [
  // Homepage hero images
  { url: 'https://www.figma.com/api/mcp/asset/aa00048a-147b-44d6-82fd-8e19a4ad2701', name: 'homepage-hero-left', page: 'homepage' },
  { url: 'https://www.figma.com/api/mcp/asset/0f4a8298-7b46-4a4c-8c8d-a94267650313', name: 'homepage-hero-right', page: 'homepage' },
  { url: 'https://www.figma.com/api/mcp/asset/aad5b313-8b22-4e8e-9a5f-7bd7c950beb3', name: 'homepage-logo-hero', page: 'homepage' },

  // Homepage gallery images
  { url: 'https://www.figma.com/api/mcp/asset/f8901206-99f8-4f42-b5c9-653c373783b3', name: 'homepage-gallery-1', page: 'homepage' },
  { url: 'https://www.figma.com/api/mcp/asset/f3a4bb35-181b-49ed-a30a-36f9a94cb95d', name: 'homepage-gallery-2', page: 'homepage' },
  { url: 'https://www.figma.com/api/mcp/asset/0dd9899e-fed2-4499-97bb-e095ebe904af', name: 'homepage-gallery-3', page: 'homepage' },

  // Homepage section images
  { url: 'https://www.figma.com/api/mcp/asset/cc7a07c5-0983-44f8-8237-a4652d399d1a', name: 'homepage-section-events', page: 'homepage' },
  { url: 'https://www.figma.com/api/mcp/asset/f751e1ce-71ba-4cfd-9721-6df70807675e', name: 'homepage-section-contact', page: 'homepage' },

  // Homepage Instagram feed
  { url: 'https://www.figma.com/api/mcp/asset/ec716a4c-510c-49b0-a575-8fc1e83549f5', name: 'instagram-1', page: 'homepage' },
  { url: 'https://www.figma.com/api/mcp/asset/6aada1ea-7e15-4e5d-88b3-abe9025160ee', name: 'instagram-2', page: 'homepage' },
  { url: 'https://www.figma.com/api/mcp/asset/7dd6457e-7980-410a-bd1f-5a8ae4f9ac95', name: 'instagram-3', page: 'homepage' },
  { url: 'https://www.figma.com/api/mcp/asset/ddcb7279-b37f-43e1-ad3b-3f92bb18d11b', name: 'instagram-4', page: 'homepage' },

  // Logo assets
  { url: 'https://www.figma.com/api/mcp/asset/29a68ed0-43c8-490d-8d71-d3a7108b06da', name: 'nomad-logo-wide', page: 'global' },
  { url: 'https://www.figma.com/api/mcp/asset/2f1e845b-aaf5-4728-8981-ebdeaa4c6733', name: 'nomad-logo-mark-group', page: 'global' },
  { url: 'https://www.figma.com/api/mcp/asset/1421aa47-4720-4540-8eaf-824b2c5cf053', name: 'nomad-logo-mark-vector', page: 'global' },

  // About page images
  { url: 'https://www.figma.com/api/mcp/asset/97c2b071-a876-47f2-9c52-045f39365338', name: 'about-heritage', page: 'about' },
  { url: 'https://www.figma.com/api/mcp/asset/b5c9389a-3420-4b46-a2e4-abd83909f544', name: 'about-team-chef', page: 'about' },
  { url: 'https://www.figma.com/api/mcp/asset/456702d8-b1d5-46a9-86ad-d2ef10ac197b', name: 'about-team-bar-director', page: 'about' },
  { url: 'https://www.figma.com/api/mcp/asset/0d319183-32a0-449c-ba8b-c200ab279095', name: 'about-team-wine-director', page: 'about' },
  { url: 'https://www.figma.com/api/mcp/asset/bb54260d-03c1-48b2-84f8-881884737a52', name: 'about-dining-table', page: 'about' },

  // About page awards logos
  { url: 'https://www.figma.com/api/mcp/asset/2e19b501-d857-41b3-a222-9f87059bd075', name: 'award-iprefer', page: 'about' },
  { url: 'https://www.figma.com/api/mcp/asset/12f865af-7159-43c8-8b5f-df02b9ca0603', name: 'award-lifestyle', page: 'about' },
  { url: 'https://www.figma.com/api/mcp/asset/6add5ab3-f1ea-418e-ac7b-b7548f39984a', name: 'award-conde-nast', page: 'about' },
  { url: 'https://www.figma.com/api/mcp/asset/1a045d1f-18c7-470a-a1e8-280db7fe48aa', name: 'award-curioso', page: 'about' },

  // Private events page images
  { url: 'https://www.figma.com/api/mcp/asset/2f0b114d-aa8c-4d4b-ae53-b28c83506b52', name: 'private-events-gallery-1', page: 'private-events' },
  { url: 'https://www.figma.com/api/mcp/asset/0a54d108-159e-49d3-80fa-1c0e86ad0b60', name: 'private-events-gallery-2', page: 'private-events' },
  { url: 'https://www.figma.com/api/mcp/asset/09280b80-3129-4368-906e-5cabe3678c1d', name: 'private-events-gallery-3', page: 'private-events' },
  { url: 'https://www.figma.com/api/mcp/asset/da02dc8f-09d0-4690-9f12-68dce74e6e40', name: 'private-events-gallery-4', page: 'private-events' },

  // Menu page images
  { url: 'https://www.figma.com/api/mcp/asset/0609ddfd-b43a-4e29-a101-b9441c16c74a', name: 'menu-hero-left', page: 'menu' },
  { url: 'https://www.figma.com/api/mcp/asset/5de656a7-7915-4eed-892e-7f168b4190aa', name: 'menu-hero-right', page: 'menu' },
  { url: 'https://www.figma.com/api/mcp/asset/9c1e6f83-b4ba-4ff2-8b18-c7d1778f6e62', name: 'menu-instagram-1', page: 'menu' },
  { url: 'https://www.figma.com/api/mcp/asset/57086400-ce66-47a1-8f61-8e6fb1205685', name: 'menu-instagram-2', page: 'menu' },
  { url: 'https://www.figma.com/api/mcp/asset/48236ae6-5141-4e1b-8360-0a84413b42f9', name: 'menu-gallery-1', page: 'menu' },
  { url: 'https://www.figma.com/api/mcp/asset/13b4bafd-dcc3-4eba-bb8e-badeea9bfc8b', name: 'menu-gallery-2', page: 'menu' },
];

async function downloadImage(url: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || 'image/png';
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  return { base64, mimeType: contentType };
}

async function uploadToGraphQL(
  filename: string,
  base64Data: string,
  mimeType: string,
  alt: string
): Promise<{ id: string; url: string }> {
  const mutation = `
    mutation UploadMedia($input: UploadMediaInput!) {
      uploadMedia(input: $input) {
        id
        filename
        variants {
          original
          thumbnail
          medium
          large
        }
      }
    }
  `;

  const variables = {
    input: {
      organizationId: ORG_ID,
      propertyId: null,
      filename: `${filename}.${mimeType.split('/')[1] || 'png'}`,
      mimeType,
      alt,
      base64Data,
    },
  };

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return {
    id: result.data.uploadMedia.id,
    url: result.data.uploadMedia.variants.original,
  };
}

async function main() {
  console.log('Starting Figma image extraction and CMS upload...\n');

  // Login first to get access token
  console.log('Authenticating with CMS...');
  accessToken = await login();
  console.log('Authentication successful!\n');

  const results: Array<{ name: string; page: string; cmsUrl: string; cmsId: string }> = [];
  const errors: Array<{ name: string; error: string }> = [];

  for (const image of FIGMA_IMAGES) {
    try {
      console.log(`Processing: ${image.name} (${image.page})`);

      // Download from Figma
      const { base64, mimeType } = await downloadImage(image.url);
      console.log(`  Downloaded: ${(base64.length / 1024).toFixed(1)}KB`);

      // Upload to CMS
      const { id, url } = await uploadToGraphQL(
        image.name,
        base64,
        mimeType,
        `NoMad Wynwood - ${image.name.replace(/-/g, ' ')}`
      );

      console.log(`  Uploaded: ${url}`);
      results.push({ name: image.name, page: image.page, cmsUrl: url, cmsId: id });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`  ERROR: ${errorMessage}`);
      errors.push({ name: image.name, error: errorMessage });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`\nSuccess: ${results.length}/${FIGMA_IMAGES.length}`);
  console.log(`Failed: ${errors.length}/${FIGMA_IMAGES.length}`);

  if (results.length > 0) {
    console.log('\nUploaded Images:');
    results.forEach(r => {
      console.log(`  [${r.page}] ${r.name}: ${r.cmsUrl}`);
    });
  }

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => {
      console.log(`  ${e.name}: ${e.error}`);
    });
  }

  // Output JSON mapping for easy reference
  const outputPath = './figma-cms-image-mapping.json';
  const mapping = Object.fromEntries(results.map(r => [r.name, { url: r.cmsUrl, id: r.cmsId, page: r.page }]));
  require('fs').writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  console.log(`\nImage mapping saved to: ${outputPath}`);
}

main().catch(console.error);
