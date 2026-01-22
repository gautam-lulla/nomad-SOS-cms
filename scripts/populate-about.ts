/**
 * Populate About Page Content in CMS
 *
 * This script creates content entries for the About page:
 * - Heritage content section
 * - Team members
 * - Awards
 * - FAQ items (for About page)
 *
 * Run with: npx tsx scripts/populate-about.ts
 */

import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const CMS_URL = process.env.CMS_GRAPHQL_URL || 'http://localhost:3001/graphql';
const ORG_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

// Content Type IDs from content-model.md
const CONTENT_TYPE_IDS = {
  contentSection: 'bd2974d6-39ad-44bc-8beb-ee4b5c25811c',
  faqItem: '1cf0fa5e-59b3-46dc-9ea2-a45aee6b2ac3',
  award: '4db4496a-a5d8-4300-ad60-fba0202b2a7e',
  page: '54d15929-4f6a-4939-9423-338d7f9fd21f',
};

let authClient: ApolloClient<unknown>;

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

const CREATE_CONTENT_ENTRY = gql`
  mutation CreateContentEntry($input: CreateContentEntryInput!) {
    createContentEntry(input: $input) {
      id
      slug
      data
    }
  }
`;

const UPDATE_CONTENT_ENTRY = gql`
  mutation UpdateContentEntry($id: ID!, $input: UpdateContentEntryInput!) {
    updateContentEntry(id: $id, input: $input) {
      id
      slug
      data
    }
  }
`;

const GET_CONTENT_ENTRY_BY_SLUG = gql`
  query GetContentEntryBySlug($slug: String!, $contentTypeId: ID!, $organizationId: ID!) {
    contentEntryBySlug(slug: $slug, contentTypeId: $contentTypeId, organizationId: $organizationId) {
      id
      slug
      data
    }
  }
`;

// Data from Figma PDF
const heritageSection = {
  slug: 'section-about-heritage',
  variant: 'image-right',
  heading: 'Heritage',
  bodyText: 'Bibendum quis dui eros felis est cursus justo ridiculus id. In tempor arcu blandit orci. Lectus pellentesque nec convallis adipiscing libero odio. Sed lectus sed fermentum et arcu aliquam scelerisque. Facilisis mauris viverra varius purus lacus sit ultrices consequat proin. Sagittis neque neque in est.',
  image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', // Placeholder
  imageAlt: 'Heritage interior',
};

const teamQuoteSection = {
  slug: 'section-about-team-quote',
  variant: 'text-only',
  heading: 'Arcu feugiat vitae arcu et justo tortor. Natoque sit cras.',
  bodyText: 'Risus pretium massa et eu dignissim. Non non ligula lacus velit mi aliquet neque. Enim a commodo lacus cras adipiscing aliquam enim. Consectetur aliquet nibh metus morbi viverra aliquam. Etiam nascetur urna faucibus platea placerat nunc placerat.',
};

const teamMembers = [
  {
    name: 'Marta Jones',
    title: 'Executive Chef',
    bio: 'Odio neque enim leo egestas aliquam quisque. Convallis phasellus sed viverra arcu nec et ullamcorper. Aenean sem tortor tincidunt viverra in lacus.',
    image: 'https://images.unsplash.com/photo-1583394293214-28ez158ae4ab?w=400', // Placeholder
  },
  {
    name: 'Elias Berg',
    title: 'Bar Director',
    bio: 'Odio neque enim leo egestas aliquam quisque. Convallis phasellus sed viverra arcu nec et ullamcorper. Aenean sem tortor tincidunt viverra in lacus.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', // Placeholder
  },
  {
    name: 'Liam Foster',
    title: 'Wine Director',
    bio: 'Odio neque enim leo egestas aliquam quisque. Convallis phasellus sed viverra arcu nec et ullamcorper. Aenean sem tortor tincidunt viverra in lacus.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', // Placeholder
  },
];

const awards = [
  { slug: 'award-i-prefer', name: 'I Prefer', organization: 'Hotels & Resorts', sortOrder: 1 },
  { slug: 'award-lifestyle', name: 'Lifestyle', organization: 'Magazine', sortOrder: 2 },
  { slug: 'award-traveler', name: 'Traveler', organization: 'CN Traveler', sortOrder: 3 },
  { slug: 'award-curioso', name: 'Curioso', organization: 'Travel Awards', sortOrder: 4 },
];

const aboutFaqs = [
  {
    slug: 'faq-about-1',
    question: 'Turpis adipiscing mi tincidunt ultricies nunc. At enim metus quis?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'about',
    sortOrder: 1,
  },
  {
    slug: 'faq-about-2',
    question: 'Morbi mauris pharetra nisi sed massa. Nec sit lobortis bibendum?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'about',
    sortOrder: 2,
  },
  {
    slug: 'faq-about-3',
    question: 'Nibh diam amet nulla consectetur nulla id pulvinar enim?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'about',
    sortOrder: 3,
  },
  {
    slug: 'faq-about-4',
    question: 'Fringilla dictumst mauris laoreet ac aliquam integer consectetur?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'about',
    sortOrder: 4,
  },
  {
    slug: 'faq-about-5',
    question: 'Nunc odio ut magna lectus eget accumsan turpis. Bibendum neque?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'about',
    sortOrder: 5,
  },
];

async function authenticate(): Promise<string> {
  const client = new ApolloClient({
    link: new HttpLink({ uri: CMS_URL }),
    cache: new InMemoryCache(),
  });

  const email = process.env.CMS_ADMIN_EMAIL || 'dev@sphereos.local';
  const password = process.env.CMS_ADMIN_PASSWORD;

  if (!password) {
    throw new Error('CMS_ADMIN_PASSWORD environment variable is required');
  }

  const result = await client.mutate({
    mutation: LOGIN,
    variables: { input: { email, password } },
  });

  const token = (result.data as { login: { accessToken: string } }).login.accessToken;

  authClient = new ApolloClient({
    link: new HttpLink({
      uri: CMS_URL,
      headers: { Authorization: `Bearer ${token}` },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache' },
      mutate: { fetchPolicy: 'no-cache' },
    },
  });

  return token;
}

async function createOrUpdateEntry(
  contentTypeId: string,
  slug: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    // Check if entry exists
    const existingResult = await authClient.query({
      query: GET_CONTENT_ENTRY_BY_SLUG,
      variables: { slug, contentTypeId, organizationId: ORG_ID },
    });

    const existing = (existingResult.data as { contentEntryBySlug: { id: string } | null }).contentEntryBySlug;

    if (existing) {
      // Update existing
      await authClient.mutate({
        mutation: UPDATE_CONTENT_ENTRY,
        variables: { id: existing.id, input: { data } },
      });
      console.log(`  ✓ Updated: ${slug}`);
    } else {
      // Create new
      await authClient.mutate({
        mutation: CREATE_CONTENT_ENTRY,
        variables: {
          input: {
            organizationId: ORG_ID,
            contentTypeId,
            slug,
            data,
          },
        },
      });
      console.log(`  ✓ Created: ${slug}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('not found')) {
      // Entry doesn't exist, create it
      await authClient.mutate({
        mutation: CREATE_CONTENT_ENTRY,
        variables: {
          input: {
            organizationId: ORG_ID,
            contentTypeId,
            slug,
            data,
          },
        },
      });
      console.log(`  ✓ Created: ${slug}`);
    } else {
      console.error(`  ✗ Error with ${slug}: ${message}`);
    }
  }
}

async function updateAboutPage(): Promise<void> {
  // Get the about page entry
  const result = await authClient.query({
    query: GET_CONTENT_ENTRY_BY_SLUG,
    variables: {
      slug: 'about',
      contentTypeId: CONTENT_TYPE_IDS.page,
      organizationId: ORG_ID,
    },
  });

  const aboutPage = (result.data as { contentEntryBySlug: { id: string; data: Record<string, unknown> } | null }).contentEntryBySlug;

  if (aboutPage) {
    // Update sections to include heritage, team-quote, team, awards, faq
    await authClient.mutate({
      mutation: UPDATE_CONTENT_ENTRY,
      variables: {
        id: aboutPage.id,
        input: {
          data: {
            ...aboutPage.data,
            sections: [
              { type: 'content-section', slug: 'section-about-heritage' },
              { type: 'content-section', slug: 'section-about-team-quote' },
              { type: 'team', slug: 'about-team' },
              { type: 'awards', slug: 'about-awards' },
              { type: 'faq', slug: 'about-faq' },
            ],
            showFaq: true,
            faqCategory: 'about',
            showTeam: true,
            showAwards: true,
            teamHeading: 'Arcu feugiat vitae arcu et justo tortor. Natoque sit cras.',
            teamSubheading: 'Risus pretium massa et eu dignissim. Non non ligula lacus velit mi aliquet neque. Enim a commodo lacus cras adipiscing aliquam enim. Consectetur aliquet nibh metus morbi viverra aliquam. Etiam nascetur urna faucibus platea placerat nunc placerat.',
            teamMembers: teamMembers,
            awardsHeading: 'Awards & Recognitions',
          },
        },
      },
    });
    console.log('  ✓ Updated about page with sections');
  }
}

async function main() {
  console.log('📄 Populating About Page Content\n');

  console.log('🔐 Authenticating...');
  await authenticate();
  console.log('✓ Authenticated\n');

  // Create heritage section
  console.log('📝 Creating heritage section...');
  await createOrUpdateEntry(CONTENT_TYPE_IDS.contentSection, heritageSection.slug, {
    variant: heritageSection.variant,
    heading: heritageSection.heading,
    bodyText: heritageSection.bodyText,
    image: heritageSection.image,
    imageAlt: heritageSection.imageAlt,
  });

  // Create team quote section
  console.log('\n📝 Creating team quote section...');
  await createOrUpdateEntry(CONTENT_TYPE_IDS.contentSection, teamQuoteSection.slug, {
    variant: teamQuoteSection.variant,
    heading: teamQuoteSection.heading,
    bodyText: teamQuoteSection.bodyText,
  });

  // Create awards
  console.log('\n📝 Creating awards...');
  for (const award of awards) {
    await createOrUpdateEntry(CONTENT_TYPE_IDS.award, award.slug, {
      name: award.name,
      organization: award.organization,
      sortOrder: award.sortOrder,
    });
  }

  // Create FAQ items for about page
  console.log('\n📝 Creating FAQ items for about page...');
  for (const faq of aboutFaqs) {
    await createOrUpdateEntry(CONTENT_TYPE_IDS.faqItem, faq.slug, {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sortOrder: faq.sortOrder,
    });
  }

  // Update about page
  console.log('\n📝 Updating about page entry...');
  await updateAboutPage();

  console.log('\n✅ About page content population complete!');
}

main().catch(console.error);
