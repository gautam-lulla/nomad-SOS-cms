/**
 * Populate Menu Categories in CMS
 *
 * This script creates the menu-category content type and entries with all items from Figma.
 * Run with: npx tsx scripts/populate-menu.ts
 */

import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const CMS_URL = process.env.CMS_GRAPHQL_URL || 'http://localhost:3001/graphql';
const ORG_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

let authClient: ApolloClient<unknown>;

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

const CREATE_CONTENT_TYPE = gql`
  mutation CreateContentType($input: CreateContentTypeInput!) {
    createContentType(input: $input) {
      id
      slug
      name
      fields { slug name type }
    }
  }
`;

const GET_CONTENT_TYPE_BY_SLUG = gql`
  query GetContentTypeBySlug($slug: String!, $organizationId: ID!) {
    contentTypeBySlug(slug: $slug, organizationId: $organizationId) {
      id
      slug
      name
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

// Menu data extracted from Figma PDF
const menuCategories = [
  {
    slug: 'menu-appetizers',
    name: 'Appetizers',
    availability: 'Available Every Day, 11 AM – 3 PM',
    sortOrder: 1,
    items: [
      { name: 'Yoghurt & Berries', description: 'NoMad Granola, Honey, Mint', price: '$14' },
      { name: 'Kale Salad', description: 'Pear, Pevensey Blue, Sourdough Crisps', price: '$17' },
      { name: 'Raw Farm Vegetables', description: 'Sesame Carrot Dip, Sunflower Seeds', price: '$18' },
      { name: 'Cacio e Pepe', description: 'Black Pepper, Pecorino, Confit Egg Yolk', price: '$22' },
      { name: 'Butternut Soup', description: 'Lime Creme, Croutons', price: '$11' },
      { name: 'Mushroom Flatbread', description: 'Fresh Mozzarella, Pickled Onions', price: '$16' },
    ],
  },
  {
    slug: 'menu-mains',
    name: 'Mains',
    sortOrder: 2,
    items: [
      { name: 'Seared Salmon', description: 'Quinoa, Roasted Vegetables', price: '$28' },
      { name: 'Steak Frites', description: 'Garlic Butter, Rosemary', price: '$35' },
      { name: 'Pasta Primavera', description: 'Seasonal Vegetables, Pesto Cream', price: '$24' },
      { name: 'Chicken Pot Pie', description: 'Root Vegetables, Flaky Crust', price: '$26' },
      { name: 'Lentil Shepherd\'s Pie', description: 'Mashed Potatoes, Crispy Onions', price: '$22' },
      { name: 'Pork Tenderloin', description: 'Apple Chutney, Sage', price: '$30' },
      { name: 'Vegetable Stir Fry', description: 'Broccoli, Bell Peppers, Carrots', price: '$18' },
      { name: 'Mushroom Risotto', description: 'Arborio Rice, Parmesan, Fresh Herbs', price: '$24' },
    ],
  },
  {
    slug: 'menu-sides',
    name: 'Sides',
    sortOrder: 3,
    items: [
      { name: 'Grilled Asparagus', description: 'Lemon Aioli', price: '$12' },
      { name: 'Truffle Fries', description: 'Parmesan, Herbs', price: '$15' },
      { name: 'Mac & Cheese', description: 'Cheddar, Gruyere, Breadcrumbs', price: '$14' },
      { name: 'Roasted Carrots', description: 'Maple Glaze, Pistachios', price: '$10' },
    ],
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
    variables: {
      input: { email, password },
    },
  });

  return (result.data as { login: { accessToken: string } }).login.accessToken;
}

async function getOrCreateContentType(token: string): Promise<string> {
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

  // Check if content type exists
  try {
    const result = await authClient.query({
      query: GET_CONTENT_TYPE_BY_SLUG,
      variables: {
        slug: 'menu-category',
        organizationId: ORG_ID,
      },
    });

    const existing = (result.data as { contentTypeBySlug: { id: string } | null }).contentTypeBySlug;
    if (existing) {
      console.log(`  ✓ Content type exists: menu-category (${existing.id})`);
      return existing.id;
    }
  } catch {
    // Content type doesn't exist, create it
  }

  // Create content type
  console.log('  Creating content type: menu-category...');
  const createResult = await authClient.mutate({
    mutation: CREATE_CONTENT_TYPE,
    variables: {
      input: {
        organizationId: ORG_ID,
        slug: 'menu-category',
        name: 'Menu Category',
        description: 'Restaurant menu categories with items',
        icon: 'restaurant',
        fields: [
          { slug: 'name', name: 'Category Name', type: 'TEXT', required: true, sortOrder: 0 },
          { slug: 'availability', name: 'Availability', type: 'TEXT', sortOrder: 1 },
          { slug: 'sortOrder', name: 'Sort Order', type: 'NUMBER', sortOrder: 2 },
          { slug: 'items', name: 'Menu Items', type: 'JSON', required: true, sortOrder: 3 },
        ],
      },
    },
  });

  const created = (createResult.data as { createContentType: { id: string } }).createContentType;
  console.log(`  ✓ Created content type: menu-category (${created.id})`);
  return created.id;
}

async function createMenuCategory(
  contentTypeId: string,
  category: typeof menuCategories[0]
): Promise<void> {
  try {
    await authClient.mutate({
      mutation: CREATE_CONTENT_ENTRY,
      variables: {
        input: {
          organizationId: ORG_ID,
          contentTypeId: contentTypeId,
          slug: category.slug,
          data: {
            name: category.name,
            availability: category.availability,
            sortOrder: category.sortOrder,
            items: category.items,
          },
        },
      },
    });
    console.log(`  ✓ Created: ${category.name} (${category.items.length} items)`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('duplicate') || message.includes('already exists') || message.includes('Unique constraint')) {
      console.log(`  ⚠ Already exists: ${category.name}`);
    } else {
      throw error;
    }
  }
}

async function main() {
  console.log('🍽️  Populating Menu Categories\n');

  console.log('🔐 Authenticating...');
  const token = await authenticate();
  console.log('✓ Authenticated\n');

  console.log('📋 Ensuring content type exists...');
  const contentTypeId = await getOrCreateContentType(token);
  console.log('');

  console.log('📝 Creating menu categories...');
  for (const category of menuCategories) {
    await createMenuCategory(contentTypeId, category);
  }

  console.log('\n✅ Menu population complete!');
  console.log('\nCreated categories:');
  menuCategories.forEach(cat => {
    console.log(`  - ${cat.name}: ${cat.items.length} items`);
  });
}

main().catch(console.error);
