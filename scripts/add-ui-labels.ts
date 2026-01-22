/**
 * Add UI Labels to CMS Entries
 *
 * This script adds the UI label fields to existing CMS entries
 * to fix the hardcoded content violations.
 */

import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const CMS_URL = process.env.CMS_GRAPHQL_URL || 'http://localhost:3001/graphql';

// Content Entry IDs from content-model.md
const ENTRY_IDS = {
  siteSettings: '3db16075-f42e-4463-8d32-b832aa1a8ece',
  navigation: '70ecfeb2-46fb-45c4-b04b-3f3cd4543625',
  footer: '556cad9c-cd16-4487-aa63-d1a22d0113dc',
};

// Content Type IDs from content-model.md
const CONTENT_TYPE_IDS = {
  page: '54d15929-4f6a-4939-9423-338d7f9fd21f',
};

const ORG_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

const client = new ApolloClient({
  link: new HttpLink({ uri: CMS_URL }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: { fetchPolicy: 'no-cache' },
    mutate: { fetchPolicy: 'no-cache' },
  },
});

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
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

const GET_CONTENT_ENTRY_BY_ID = gql`
  query GetContentEntry($id: ID!) {
    contentEntry(id: $id) {
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

async function authenticate(): Promise<string> {
  const email = process.env.CMS_ADMIN_EMAIL || 'dev@sphereos.local';
  const password = process.env.CMS_ADMIN_PASSWORD;

  if (!password) {
    throw new Error('CMS_ADMIN_PASSWORD environment variable is required');
  }

  const { data } = await client.mutate({
    mutation: LOGIN,
    variables: {
      input: { email, password },
    },
  });

  return data.login.accessToken;
}

async function getEntryById(id: string): Promise<{ id: string; data: Record<string, unknown> } | null> {
  try {
    const { data } = await client.query({
      query: GET_CONTENT_ENTRY_BY_ID,
      variables: { id },
    });
    return data.contentEntry;
  } catch (error) {
    console.error(`Error fetching entry ${id}:`, error);
    return null;
  }
}

async function getEntryBySlug(
  contentTypeId: string,
  slug: string
): Promise<{ id: string; data: Record<string, unknown> } | null> {
  try {
    const { data } = await client.query({
      query: GET_CONTENT_ENTRY_BY_SLUG,
      variables: {
        slug,
        contentTypeId,
        organizationId: ORG_ID,
      },
    });
    return data.contentEntryBySlug;
  } catch (error) {
    console.error(`Error fetching entry ${slug}:`, error);
    return null;
  }
}

async function updateEntry(
  token: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const authClient = new ApolloClient({
    link: new HttpLink({
      uri: CMS_URL,
      headers: { Authorization: `Bearer ${token}` },
    }),
    cache: new InMemoryCache(),
  });

  await authClient.mutate({
    mutation: UPDATE_CONTENT_ENTRY,
    variables: {
      id,
      input: { data },
    },
  });
}

async function main() {
  console.log('🔐 Authenticating...');
  const token = await authenticate();
  console.log('✓ Authenticated\n');

  // 1. Update site-settings with UI labels
  console.log('📝 Updating site-settings...');
  const settings = await getEntryById(ENTRY_IDS.siteSettings);
  if (settings) {
    await updateEntry(token, settings.id, {
      ...settings.data,
      addressLabel: 'Address',
      contactLabel: 'Contact',
      hoursLabel: 'Hours',
      reservationsLabel: 'Reservations',
      reserveButtonText: 'Reserve a Table',
      closedDayLabel: 'Closed',
    });
    console.log('✓ Updated site-settings with UI labels');
  } else {
    console.log('✗ site-settings entry not found');
  }

  // 2. Update navigation with UI labels
  console.log('\n📝 Updating navigation...');
  const navigation = await getEntryById(ENTRY_IDS.navigation);
  if (navigation) {
    await updateEntry(token, navigation.id, {
      ...navigation.data,
      menuButtonOpenLabel: 'Menu',
      menuButtonCloseLabel: 'Close',
      locationSectionLabel: '01. Location',
      hoursSectionLabel: '02. Hours',
    });
    console.log('✓ Updated navigation with UI labels');
  } else {
    console.log('✗ navigation entry not found');
  }

  // 3. Update footer with privacy policy label
  console.log('\n📝 Updating footer...');
  const footer = await getEntryById(ENTRY_IDS.footer);
  if (footer) {
    await updateEntry(token, footer.id, {
      ...footer.data,
      privacyPolicyLabel: 'I agree to the Privacy Policy',
    });
    console.log('✓ Updated footer with privacy policy label');
  } else {
    console.log('✗ footer entry not found');
  }

  // 4. Update programming page with events section label
  console.log('\n📝 Updating programming page...');
  const programmingPage = await getEntryBySlug(CONTENT_TYPE_IDS.page, 'programming');
  if (programmingPage) {
    await updateEntry(token, programmingPage.id, {
      ...programmingPage.data,
      eventsSectionLabel: 'Upcoming Events',
    });
    console.log('✓ Updated programming page with events section label');
  } else {
    console.log('✗ programming page entry not found');
  }

  console.log('\n✅ All UI labels have been added to CMS entries!');
}

main().catch(console.error);
