/**
 * Phase 8: Populate Page Content in CMS
 *
 * This script creates all hero sections, content sections, galleries,
 * and page entries for the NoMad Wynwood website.
 */

import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';

const CMS_URL = 'http://localhost:3001/graphql';
const ORG_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

// Content Type IDs from content-model.md
const CONTENT_TYPES: Record<string, string> = {
  'site-settings': 'c675b32e-649c-4c6b-94db-cb57224d1a9b',
  'navigation': '4744dd96-44f1-42e1-8b42-f7e437db2d35',
  'footer': '1ac54fb2-fed8-49d8-b483-2c1d6c1a9eff',
  'hero-section': 'f568e78c-1037-40d3-8a65-4f52685a1eb2',
  'content-section': 'bd2974d6-39ad-44bc-8beb-ee4b5c25811c',
  'gallery': '7e05102c-b270-45bd-8a34-e402d63e7852',
  'instagram-feed': '53f450dc-916c-4618-9388-e2b6cf05ab2e',
  'faq-item': '1cf0fa5e-59b3-46dc-9ea2-a45aee6b2ac3',
  'event': '23d0f666-0a0e-465f-80ba-6cf396c2447c',
  'menu-category': '3a4388ed-9fb2-4351-ba40-0c4d05c4b804',
  'award': '4db4496a-a5d8-4300-ad60-fba0202b2a7e',
  'page': '54d15929-4f6a-4939-9423-338d7f9fd21f',
};

// CDN URLs from cdn-image-urls.json
const CDN = {
  hero: {
    left: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/71094575-8210-4159-aaf8-d906864406a5/original.jpg',
    right: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/9cba71ad-268d-46f6-8b97-b4288c80c1f2/original.jpg',
  },
  gallery: {
    image1: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/5f5df1a2-d4a2-484c-bd11-fba3bc6d05ce/original.jpg',
    image2: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/a4751e8d-1db4-43e1-a130-f2eb61cdaab9/original.jpg',
    image3: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/0f56c48c-b080-4fbc-a4ee-e0d6c0c44e70/original.jpg',
  },
  events: {
    hero: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/f5f6b0ff-6738-4316-bec5-f6fe16ed3d39/original.jpg',
    card1: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/f9b69cf9-c2ef-4609-81e0-c4187a571c53/original.jpg',
    card2: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/bef6acee-fa10-4817-b73b-9eed82b02902/original.jpg',
    card3: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/0c3ff6fc-71d1-4af9-be40-f701a9db1245/original.jpg',
    card4: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/f4c71ddc-3e7c-4b7b-9b63-e3e651c86f1b/original.jpg',
    card5: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/43f83988-9342-4ec5-9ccf-f7294797e387/original.jpg',
    card6: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/653bd87a-9e24-4224-b4ef-754f02aec33a/original.jpg',
  },
  contact: {
    hero: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/9239a0d1-b7d7-4594-8cbd-8700cc010aa7/original.jpg',
  },
  instagram: {
    image1: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/730077ef-b5fe-40cf-9b23-0c8f887b3491/original.jpg',
    image2: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/1edc5e8b-c217-43ab-8931-99599a77e78b/original.jpg',
    image3: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/930dee05-fa68-406d-9df8-5dec2fa932fa/original.png',
    image4: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/311f1eeb-fff7-4cf5-8ddc-9ba38cfd031b/original.jpg',
  },
  menu: {
    heroLeft: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/d5821d71-ecaa-4353-87b9-000a58054aad/original.jpg',
    heroRight: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/eeeaea0a-69c4-40c0-aee4-41e32c19468a/original.jpg',
    gallery1: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/5c48daf7-8aee-408f-a220-9ca78e880114/original.jpg',
    gallery2: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/392c6ca6-a296-49a4-8cfc-dba3babe67c0/original.jpg',
  },
  logos: {
    mark: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/0e43ef01-0f8c-4e79-88f7-cfcc0f93ff75/original.png',
    wordmark: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/e88fe3b9-2c00-4e36-9a7b-6e240cd5d82c/original.png',
    wordmarkDark: 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/aae73ef9-7d3d-4758-b0f9-dc6a1b67d2ca/original.png',
  },
};

// GraphQL mutations
const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
    }
  }
`;

const CREATE_CONTENT_ENTRY = gql`
  mutation CreateContentEntry($input: CreateContentEntryInput!) {
    createContentEntry(input: $input) {
      id
      slug
    }
  }
`;

async function main() {
  // Create unauthenticated client for login
  const publicClient = new ApolloClient({
    link: new HttpLink({ uri: CMS_URL }),
    cache: new InMemoryCache(),
  });

  // Login
  console.log('Authenticating...');
  const { data: loginData } = await publicClient.mutate({
    mutation: LOGIN,
    variables: {
      input: {
        email: 'dev@sphereos.local',
        password: 'password123',
      },
    },
  });

  const token = loginData.login.accessToken;
  console.log('✓ Authenticated\n');

  // Create authenticated client
  const client = new ApolloClient({
    link: new HttpLink({
      uri: CMS_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    cache: new InMemoryCache(),
  });

  // Helper to create entry
  async function createEntry(contentTypeSlug: string, slug: string, data: Record<string, unknown>) {
    const contentTypeId = CONTENT_TYPES[contentTypeSlug];
    if (!contentTypeId) {
      console.error(`✗ Unknown content type: ${contentTypeSlug}`);
      return null;
    }
    try {
      const { data: result } = await client.mutate({
        mutation: CREATE_CONTENT_ENTRY,
        variables: {
          input: {
            contentTypeId,
            organizationId: ORG_ID,
            slug,
            data,
          },
        },
      });
      console.log(`✓ Created ${contentTypeSlug}/${slug} (${result.createContentEntry.id})`);
      return result.createContentEntry.id;
    } catch (error: any) {
      console.error(`✗ Failed to create ${contentTypeSlug}/${slug}:`, error.message);
      return null;
    }
  }

  // ===========================================
  // HOMEPAGE CONTENT
  // ===========================================
  console.log('\n--- HOMEPAGE ---\n');

  // Homepage Hero (split-screen)
  await createEntry('hero-section', 'hero-homepage', {
    variant: 'split-screen',
    leftImage: [CDN.hero.left],
    leftImageAlt: 'NoMad Wynwood interior',
    rightImage: [CDN.hero.right],
    rightImageAlt: 'NoMad Wynwood dining',
    logoImage: [CDN.logos.wordmark],
    logoImageAlt: 'NoMad Wynwood',
  });

  // Homepage Intro Section
  await createEntry('content-section', 'section-homepage-intro', {
    variant: 'text-only',
    heading: 'Leo bibendum sem urna fringilla quisque malesuada non facilisi.',
    bodyText: 'Risus pretium massa et eu dignissim. Non non ligula lacus velit mi aliquet neque. Enim a commodo lacus cras adipiscing aliquam enim. Consectetur aliquet nibh metus morbi viverra aliquam. Etiam nascetur urna faucibus platea placerat nunc placerat.',
    ctaText: 'Reserve a Table',
    ctaUrl: 'https://resy.com/cities/mia/nomad-wynwood',
    ctaAriaLabel: 'Reserve a table at NoMad Wynwood',
    backgroundColor: 'dark',
  });

  // Homepage Gallery
  await createEntry('gallery', 'gallery-homepage', {
    name: 'Homepage Gallery',
    image1: [CDN.gallery.image1],
    image1Alt: 'NoMad Wynwood dishes',
    image2: [CDN.gallery.image2],
    image2Alt: 'NoMad Wynwood cocktails',
    image3: [CDN.gallery.image3],
    image3Alt: 'NoMad Wynwood ambiance',
  });

  // Homepage Menu Section
  await createEntry('content-section', 'section-homepage-menu', {
    variant: 'text-only',
    heading: 'Every dish tells a story of spice, care, and heritage.',
    bodyText: 'Risus pretium massa et eu dignissim. Non non ligula lacus velit mi aliquet neque. Enim a commodo lacus cras adipiscing aliquam enim. Consectetur aliquet nibh metus morbi viverra aliquam. Etiam nascetur urna faucibus platea placerat nunc placerat.',
    ctaText: 'See Our Menu',
    ctaUrl: '/menu',
    ctaAriaLabel: 'View our full menu',
    backgroundColor: 'dark',
  });

  // Homepage Events Section
  await createEntry('content-section', 'section-homepage-events', {
    variant: 'image-right',
    heading: 'Risus viverra enim vitae commodo. Cras natoque sollicitudin urna.',
    bodyText: 'Bibendum quis dui eros felis est cursus justo ridiculus id. In tempor arcu blandit orci. Lectus pellentesque nec convallis adipiscing libero odio. Sed lectus sed fermentum et arcu aliquam scelerisque. Facilisis mauris viverra varius purus lacus sit ultrices consequat proin. Sagittis neque neque in est.',
    ctaText: 'See Upcoming Events',
    ctaUrl: '/programming',
    ctaAriaLabel: 'View upcoming events',
    image: [CDN.events.hero],
    imageAlt: 'NoMad Wynwood events',
    backgroundColor: 'dark',
  });

  // Homepage Contact Section
  await createEntry('content-section', 'section-homepage-contact', {
    variant: 'image-left',
    heading: 'Enim ac in leo cursus. Amet risus elementum velit leo aenean.',
    bodyText: 'Bibendum quis dui eros felis est cursus justo ridiculus id. In tempor arcu blandit orci. Lectus pellentesque nec convallis adipiscing libero odio. Sed lectus sed fermentum et arcu aliquam scelerisque. Facilisis mauris viverra varius purus lacus sit ultrices consequat proin. Sagittis neque neque in est. Nisi sit orci amet.',
    ctaText: 'Contact Us',
    ctaUrl: '/getting-here',
    ctaAriaLabel: 'Contact NoMad Wynwood',
    image: [CDN.contact.hero],
    imageAlt: 'NoMad Wynwood interior',
    backgroundColor: 'dark',
  });

  // Homepage Page Entry
  await createEntry('page', 'home', {
    title: 'Home',
    urlSlug: '/',
    metaTitle: 'NoMad Wynwood | Restaurant & Bar in Miami',
    metaDescription: 'Experience exceptional dining at NoMad Wynwood in Miami. Enjoy our seasonally inspired menu and curated cocktails in a vibrant atmosphere.',
    heroSlug: 'hero-homepage',
    sections: [
      { type: 'content-section', slug: 'section-homepage-intro' },
      { type: 'gallery', slug: 'gallery-homepage' },
      { type: 'content-section', slug: 'section-homepage-menu' },
      { type: 'content-section', slug: 'section-homepage-events' },
      { type: 'content-section', slug: 'section-homepage-contact' },
    ],
    showInstagram: true,
  });

  // ===========================================
  // MENU PAGE CONTENT
  // ===========================================
  console.log('\n--- MENU PAGE ---\n');

  // Menu Hero
  await createEntry('hero-section', 'hero-menu', {
    variant: 'split-screen',
    leftImage: [CDN.menu.heroLeft],
    leftImageAlt: 'NoMad Wynwood culinary',
    rightImage: [CDN.menu.heroRight],
    rightImageAlt: 'NoMad Wynwood dishes',
    logoImage: [CDN.logos.wordmark],
    logoImageAlt: 'NoMad Wynwood',
  });

  // Menu Page Entry
  await createEntry('page', 'menu', {
    title: 'Menu',
    urlSlug: '/menu',
    metaTitle: 'Menu | NoMad Wynwood',
    metaDescription: 'Explore the menu at NoMad Wynwood featuring seasonally inspired dishes and innovative cocktails.',
    heroSlug: 'hero-menu',
    showInstagram: true,
  });

  // ===========================================
  // PROGRAMMING PAGE CONTENT
  // ===========================================
  console.log('\n--- PROGRAMMING PAGE ---\n');

  // Programming Hero
  await createEntry('hero-section', 'hero-programming', {
    variant: 'full-screen',
    headline: 'Programming & Events',
    subtitle: 'Join us for live music, special dinners, and seasonal celebrations',
    backgroundImage: [CDN.events.hero],
    backgroundImageAlt: 'NoMad Wynwood events',
    overlayOpacity: 40,
    textAlignment: 'center',
  });

  // Sample Events
  await createEntry('event', 'event-jazz-night', {
    title: 'Live Jazz Night',
    date: '2026-01-25',
    time: '8:00 PM - 11:00 PM',
    description: 'Enjoy an evening of live jazz with acclaimed local musicians while savoring our signature cocktails.',
    image: [CDN.events.card1],
    imageAlt: 'Jazz night at NoMad Wynwood',
    category: 'Live Music',
    isFeatured: true,
    sortOrder: 1,
  });

  await createEntry('event', 'event-wine-dinner', {
    title: 'Winemaker Dinner',
    date: '2026-02-01',
    time: '7:00 PM - 10:00 PM',
    description: 'A curated five-course dinner paired with exclusive wines from our featured winery.',
    image: [CDN.events.card2],
    imageAlt: 'Wine dinner at NoMad Wynwood',
    category: 'Special Dinner',
    isFeatured: true,
    sortOrder: 2,
  });

  await createEntry('event', 'event-valentines', {
    title: "Valentine's Day Prix Fixe",
    date: '2026-02-14',
    time: '6:00 PM - 10:00 PM',
    description: 'Celebrate love with a romantic multi-course dinner featuring seasonal ingredients and champagne pairings.',
    image: [CDN.events.card3],
    imageAlt: 'Valentines dinner at NoMad Wynwood',
    category: 'Holiday',
    isFeatured: true,
    sortOrder: 3,
  });

  // Programming Page Entry
  await createEntry('page', 'programming', {
    title: 'Programming',
    urlSlug: '/programming',
    metaTitle: 'Events & Programming | NoMad Wynwood',
    metaDescription: 'Discover upcoming events at NoMad Wynwood including live music, wine dinners, and seasonal celebrations.',
    heroSlug: 'hero-programming',
    showInstagram: false,
  });

  // ===========================================
  // PRIVATE EVENTS PAGE
  // ===========================================
  console.log('\n--- PRIVATE EVENTS PAGE ---\n');

  await createEntry('hero-section', 'hero-private-events', {
    variant: 'full-screen',
    headline: 'Private Events',
    subtitle: 'Host your next celebration with us',
    bodyText: 'From intimate gatherings to grand celebrations, our versatile spaces and dedicated team will create an unforgettable experience.',
    backgroundImage: [CDN.events.hero],
    backgroundImageAlt: 'Private events at NoMad Wynwood',
    ctaText: 'Inquire Now',
    ctaUrl: '/getting-here',
    ctaAriaLabel: 'Inquire about private events',
    overlayOpacity: 50,
    textAlignment: 'center',
  });

  await createEntry('page', 'private-events', {
    title: 'Private Events',
    urlSlug: '/private-events',
    metaTitle: 'Private Events | NoMad Wynwood',
    metaDescription: 'Host your private event at NoMad Wynwood. Our versatile spaces accommodate intimate gatherings to grand celebrations.',
    heroSlug: 'hero-private-events',
    showInstagram: true,
  });

  // ===========================================
  // ABOUT PAGE
  // ===========================================
  console.log('\n--- ABOUT PAGE ---\n');

  await createEntry('hero-section', 'hero-about', {
    variant: 'full-screen',
    headline: 'Our Story',
    subtitle: 'A celebration of culinary excellence in the heart of Wynwood',
    backgroundImage: [CDN.gallery.image1],
    backgroundImageAlt: 'NoMad Wynwood interior',
    overlayOpacity: 40,
    textAlignment: 'center',
  });

  await createEntry('content-section', 'section-about-story', {
    variant: 'text-only',
    heading: 'Where heritage meets innovation',
    bodyText: 'NoMad Wynwood brings the spirit of New York\'s acclaimed NoMad to the vibrant streets of Miami. Our menu celebrates seasonal ingredients with bold flavors, while our cocktail program pushes boundaries with creative interpretations of classic recipes.',
    backgroundColor: 'dark',
  });

  await createEntry('page', 'about', {
    title: 'About',
    urlSlug: '/about',
    metaTitle: 'About | NoMad Wynwood',
    metaDescription: 'Discover the story behind NoMad Wynwood, where culinary excellence meets Miami\'s vibrant Wynwood district.',
    heroSlug: 'hero-about',
    sections: [
      { type: 'content-section', slug: 'section-about-story' },
    ],
    showInstagram: true,
  });

  // ===========================================
  // CONTACT/GETTING HERE PAGE
  // ===========================================
  console.log('\n--- GETTING HERE PAGE ---\n');

  await createEntry('hero-section', 'hero-getting-here', {
    variant: 'full-screen',
    headline: 'Getting Here',
    subtitle: '280 NW 27th St, Miami, FL 33127',
    backgroundImage: [CDN.contact.hero],
    backgroundImageAlt: 'NoMad Wynwood exterior',
    overlayOpacity: 40,
    textAlignment: 'center',
  });

  await createEntry('page', 'getting-here', {
    title: 'Getting Here',
    urlSlug: '/getting-here',
    metaTitle: 'Contact & Directions | NoMad Wynwood',
    metaDescription: 'Find directions to NoMad Wynwood at 280 NW 27th St in Miami\'s Wynwood district. Contact us for reservations and inquiries.',
    heroSlug: 'hero-getting-here',
    showInstagram: false,
  });

  // ===========================================
  // FAQ PAGE
  // ===========================================
  console.log('\n--- FAQ PAGE ---\n');

  await createEntry('hero-section', 'hero-faq', {
    variant: 'text-only',
    headline: 'Frequently Asked Questions',
    textAlignment: 'center',
  });

  // FAQ Items
  await createEntry('faq-item', 'faq-reservations', {
    question: 'How do I make a reservation?',
    answer: 'Reservations can be made through Resy, by calling us at +1-877-666-2312, or by using the "Reserve a Table" button on our website.',
    category: 'reservations',
    sortOrder: 1,
  });

  await createEntry('faq-item', 'faq-dress-code', {
    question: 'Is there a dress code?',
    answer: 'We recommend smart casual attire. We want you to feel comfortable while dining with us.',
    category: 'dining',
    sortOrder: 2,
  });

  await createEntry('faq-item', 'faq-parking', {
    question: 'Is parking available?',
    answer: 'Yes, we offer valet parking and there are several public parking lots nearby in Wynwood.',
    category: 'logistics',
    sortOrder: 3,
  });

  await createEntry('faq-item', 'faq-dietary', {
    question: 'Do you accommodate dietary restrictions?',
    answer: 'Absolutely. Please inform your server of any dietary restrictions or allergies, and our kitchen will be happy to accommodate.',
    category: 'dining',
    sortOrder: 4,
  });

  await createEntry('faq-item', 'faq-private-events', {
    question: 'Can I host a private event at NoMad Wynwood?',
    answer: 'Yes! We have several spaces available for private events. Please visit our Private Events page or contact us for more information.',
    category: 'events',
    sortOrder: 5,
  });

  await createEntry('page', 'faq', {
    title: 'FAQ',
    urlSlug: '/faq',
    metaTitle: 'FAQ | NoMad Wynwood',
    metaDescription: 'Find answers to frequently asked questions about NoMad Wynwood including reservations, dress code, and private events.',
    heroSlug: 'hero-faq',
    showFaq: true,
  });

  // ===========================================
  // 404 PAGE
  // ===========================================
  console.log('\n--- 404 PAGE ---\n');

  await createEntry('hero-section', 'hero-404', {
    variant: 'text-only',
    headline: 'Page Not Found',
    bodyText: 'The page you\'re looking for doesn\'t exist. Let\'s get you back on track.',
    ctaText: 'Return Home',
    ctaUrl: '/',
    ctaAriaLabel: 'Return to homepage',
    textAlignment: 'center',
  });

  await createEntry('page', '404', {
    title: '404',
    urlSlug: '/404',
    metaTitle: 'Page Not Found | NoMad Wynwood',
    noIndex: true,
    heroSlug: 'hero-404',
  });

  console.log('\n✓ All page content populated successfully!');
}

main().catch(console.error);
