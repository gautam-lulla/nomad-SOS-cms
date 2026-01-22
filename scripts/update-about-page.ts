/**
 * Update About Page with Team, Awards, and FAQ
 * Run with: npx tsx scripts/update-about-page.ts
 */

import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const CMS_URL = process.env.CMS_GRAPHQL_URL || 'http://localhost:3001/graphql';
const ORG_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';
const PAGE_TYPE_ID = '54d15929-4f6a-4939-9423-338d7f9fd21f';
const FAQ_TYPE_ID = '1cf0fa5e-59b3-46dc-9ea2-a45aee6b2ac3';
const AWARD_TYPE_ID = '4db4496a-a5d8-4300-ad60-fba0202b2a7e';

let authClient: ApolloClient<unknown>;

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
    }
  }
`;

const GET_ENTRY_BY_SLUG = gql`
  query GetEntry($slug: String!, $contentTypeId: ID!, $organizationId: ID!) {
    contentEntryBySlug(slug: $slug, contentTypeId: $contentTypeId, organizationId: $organizationId) {
      id
      data
    }
  }
`;

const UPDATE_ENTRY = gql`
  mutation UpdateEntry($id: ID!, $input: UpdateContentEntryInput!) {
    updateContentEntry(id: $id, input: $input) {
      id
      data
    }
  }
`;

const CREATE_ENTRY = gql`
  mutation CreateEntry($input: CreateContentEntryInput!) {
    createContentEntry(input: $input) {
      id
      slug
    }
  }
`;

// Team data from Figma
const teamMembers = [
  {
    name: 'Marta Jones',
    title: 'Executive Chef',
    bio: 'Odio neque enim leo egestas aliquam quisque. Convallis phasellus sed viverra arcu nec et ullamcorper. Aenean sem tortor tincidunt viverra in lacus.',
  },
  {
    name: 'Elias Berg',
    title: 'Bar Director',
    bio: 'Odio neque enim leo egestas aliquam quisque. Convallis phasellus sed viverra arcu nec et ullamcorper. Aenean sem tortor tincidunt viverra in lacus.',
  },
  {
    name: 'Liam Foster',
    title: 'Wine Director',
    bio: 'Odio neque enim leo egestas aliquam quisque. Convallis phasellus sed viverra arcu nec et ullamcorper. Aenean sem tortor tincidunt viverra in lacus.',
  },
];

// Awards data from Figma
const awards = [
  { slug: 'award-i-prefer', name: 'I Prefer', organization: 'Hotels & Resorts', sortOrder: 1 },
  { slug: 'award-lifestyle', name: 'Lifestyle', organization: 'Travel Magazine', sortOrder: 2 },
  { slug: 'award-traveler', name: 'Traveler', organization: 'CN Traveler', sortOrder: 3 },
  { slug: 'award-curioso', name: 'Curioso', organization: 'Travel Awards', sortOrder: 4 },
];

// FAQ items for About page
const aboutFaqs = [
  { slug: 'faq-about-1', question: 'Turpis adipiscing mi tincidunt ultricies nunc. At enim metus quis?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', category: 'about', sortOrder: 1 },
  { slug: 'faq-about-2', question: 'Morbi mauris pharetra nisi sed massa. Nec sit lobortis bibendum?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', category: 'about', sortOrder: 2 },
  { slug: 'faq-about-3', question: 'Nibh diam amet nulla consectetur nulla id pulvinar enim?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', category: 'about', sortOrder: 3 },
  { slug: 'faq-about-4', question: 'Fringilla dictumst mauris laoreet ac aliquam integer consectetur?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', category: 'about', sortOrder: 4 },
  { slug: 'faq-about-5', question: 'Nunc odio ut magna lectus eget accumsan turpis. Bibendum neque?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', category: 'about', sortOrder: 5 },
];

async function authenticate(): Promise<void> {
  const client = new ApolloClient({
    link: new HttpLink({ uri: CMS_URL }),
    cache: new InMemoryCache(),
  });

  const password = process.env.CMS_ADMIN_PASSWORD;
  if (!password) throw new Error('CMS_ADMIN_PASSWORD required');

  const result = await client.mutate({
    mutation: LOGIN,
    variables: { input: { email: 'dev@sphereos.local', password } },
  });

  const token = (result.data as { login: { accessToken: string } }).login.accessToken;

  authClient = new ApolloClient({
    link: new HttpLink({
      uri: CMS_URL,
      headers: { Authorization: `Bearer ${token}` },
    }),
    cache: new InMemoryCache(),
    defaultOptions: { query: { fetchPolicy: 'no-cache' }, mutate: { fetchPolicy: 'no-cache' } },
  });
}

async function createEntryIfNotExists(contentTypeId: string, slug: string, data: Record<string, unknown>): Promise<void> {
  try {
    const result = await authClient.query({
      query: GET_ENTRY_BY_SLUG,
      variables: { slug, contentTypeId, organizationId: ORG_ID },
    });
    if ((result.data as { contentEntryBySlug: unknown }).contentEntryBySlug) {
      console.log(`  ✓ Exists: ${slug}`);
      return;
    }
  } catch {
    // Entry doesn't exist
  }

  await authClient.mutate({
    mutation: CREATE_ENTRY,
    variables: { input: { organizationId: ORG_ID, contentTypeId, slug, data } },
  });
  console.log(`  ✓ Created: ${slug}`);
}

async function main() {
  console.log('📄 Updating About Page\n');

  console.log('🔐 Authenticating...');
  await authenticate();
  console.log('✓ Authenticated\n');

  // Create award entries
  console.log('📝 Creating awards...');
  for (const award of awards) {
    await createEntryIfNotExists(AWARD_TYPE_ID, award.slug, {
      name: award.name,
      organization: award.organization,
      sortOrder: award.sortOrder,
    });
  }

  // Create FAQ entries for about page
  console.log('\n📝 Creating FAQ items for about page...');
  for (const faq of aboutFaqs) {
    await createEntryIfNotExists(FAQ_TYPE_ID, faq.slug, {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sortOrder: faq.sortOrder,
    });
  }

  // Update the about page entry
  console.log('\n📝 Updating about page entry...');
  const pageResult = await authClient.query({
    query: GET_ENTRY_BY_SLUG,
    variables: { slug: 'about', contentTypeId: PAGE_TYPE_ID, organizationId: ORG_ID },
  });

  const aboutPage = (pageResult.data as { contentEntryBySlug: { id: string; data: Record<string, unknown> } }).contentEntryBySlug;

  if (aboutPage) {
    await authClient.mutate({
      mutation: UPDATE_ENTRY,
      variables: {
        id: aboutPage.id,
        input: {
          data: {
            ...aboutPage.data,
            showTeam: true,
            showAwards: true,
            showFaq: true,
            faqCategory: 'about',
            teamHeading: 'Arcu feugiat vitae arcu et justo tortor. Natoque sit cras.',
            teamSubheading: 'Risus pretium massa et eu dignissim. Non non ligula lacus velit mi aliquet neque. Enim a commodo lacus cras adipiscing aliquam enim. Consectetur aliquet nibh metus morbi viverra aliquam. Etiam nascetur urna faucibus platea placerat nunc placerat.',
            teamMembers: teamMembers,
            awardsHeading: 'Awards & Recognitions',
            faqHeading: 'Frequently Asked Questions',
          },
        },
      },
    });
    console.log('  ✓ Updated about page with team, awards, and FAQ settings');
  }

  console.log('\n✅ About page update complete!');
}

main().catch(console.error);
