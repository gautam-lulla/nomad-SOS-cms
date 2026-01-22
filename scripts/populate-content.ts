/**
 * Phase 6: Populate CMS Content Entries
 *
 * Creates all content entries using the new content types.
 * CRITICAL: Uses M() helper to wrap MEDIA field URLs in arrays.
 */

const CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORGANIZATION_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

// Content Type IDs (from Phase 5)
const TYPE_IDS: Record<string, string> = {
  'site-settings': '9f132fda-8df8-4f92-b6bb-34b63729a87f',
  'instagram-feed': '860d4fad-b8ba-4d02-88d5-ac3288d726a7',
  'faq-item': '21751f31-cfff-4aa3-be21-111b3e99235f',
  'team-member': '62c6fa2b-e76b-479e-91f3-428a6fe0d8a6',
  'event': '98b2e21b-5aae-4974-90bb-26911010d23c',
  'menu-category': '2fec85f9-2a1f-4f0e-82b8-303b341efc16',
  'menu-section': '538480c6-7554-4610-93f1-821d84399fec',
  'menu-item': '751e890b-c6e1-4db9-9207-266f3c12af4f',
  'nomad-page': 'd6289e2e-3b8a-4110-960c-51ec085b8367',
};

// CDN URLs
const CDN = 'https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev';
const CDN_NOMAD = `${CDN}/nomad`;

// Helper to wrap URL in array for MEDIA fields
const M = (url: string): string[] => [url];

const IMAGES = {
  hero: {
    left: `${CDN}/71094575-8210-4159-aaf8-d906864406a5/original.jpg`,
    right: `${CDN}/9cba71ad-268d-46f6-8b97-b4288c80c1f2/original.jpg`,
  },
  gallery: {
    image1: `${CDN}/5f5df1a2-d4a2-484c-bd11-fba3bc6d05ce/original.jpg`,
    image2: `${CDN}/a4751e8d-1db4-43e1-a130-f2eb61cdaab9/original.jpg`,
    image3: `${CDN}/0f56c48c-b080-4fbc-a4ee-e0d6c0c44e70/original.jpg`,
  },
  events: {
    hero: `${CDN}/f5f6b0ff-6738-4316-bec5-f6fe16ed3d39/original.jpg`,
    card1: `${CDN}/f9b69cf9-c2ef-4609-81e0-c4187a571c53/original.jpg`,
    card2: `${CDN}/bef6acee-fa10-4817-b73b-9eed82b02902/original.jpg`,
    card3: `${CDN}/0c3ff6fc-71d1-4af9-be40-f701a9db1245/original.jpg`,
  },
  contact: {
    hero: `${CDN}/9239a0d1-b7d7-4594-8cbd-8700cc010aa7/original.jpg`,
  },
  instagram: {
    image1: `${CDN}/730077ef-b5fe-40cf-9b23-0c8f887b3491/original.jpg`,
    image2: `${CDN}/1edc5e8b-c217-43ab-8931-99599a77e78b/original.jpg`,
    image3: `${CDN}/930dee05-fa68-406d-9df8-5dec2fa932fa/original.png`,
    image4: `${CDN}/311f1eeb-fff7-4cf5-8ddc-9ba38cfd031b/original.jpg`,
  },
  menu: {
    heroLeft: `${CDN}/d5821d71-ecaa-4353-87b9-000a58054aad/original.jpg`,
    heroRight: `${CDN}/eeeaea0a-69c4-40c0-aee4-41e32c19468a/original.jpg`,
  },
};

let authToken = '';

// Delay helper to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function gqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(CMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json() as { data: T; errors?: unknown[] };
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }
  return json.data;
}

async function login(): Promise<void> {
  console.log('🔐 Authenticating...');
  const data = await gqlRequest<{ login: { accessToken: string } }>(`
    mutation { login(input: { email: "dev@sphereos.local", password: "password123" }) { accessToken } }
  `);
  authToken = data.login.accessToken;
  console.log('✅ Authenticated\n');
}

async function upsertEntry(
  contentTypeSlug: string,
  slug: string,
  data: Record<string, unknown>
): Promise<string> {
  const typeId = TYPE_IDS[contentTypeSlug];
  if (!typeId) throw new Error(`Unknown content type: ${contentTypeSlug}`);

  // Check if entry exists (handle 404 as not-found)
  let existingId: string | null = null;
  try {
    const response = await fetch(CMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: `query Check($typeId: ID!, $orgId: ID!, $slug: String!) {
          contentEntryBySlug(contentTypeId: $typeId, organizationId: $orgId, slug: $slug) { id }
        }`,
        variables: { typeId, orgId: ORGANIZATION_ID, slug },
      }),
    });
    const json = await response.json() as { data?: { contentEntryBySlug?: { id: string } }; errors?: unknown[] };
    if (json.data?.contentEntryBySlug?.id) {
      existingId = json.data.contentEntryBySlug.id;
    }
  } catch {
    // Entry doesn't exist
  }

  if (existingId) {
    // Update existing
    const result = await gqlRequest<{ updateContentEntry: { id: string } }>(`
      mutation Update($id: ID!, $input: UpdateContentEntryInput!) {
        updateContentEntry(id: $id, input: $input) { id }
      }
    `, { id: existingId, input: { data } });
    console.log(`   ↻ Updated ${contentTypeSlug}: ${slug}`);
    return result.updateContentEntry.id;
  } else {
    // Create new
    const result = await gqlRequest<{ createContentEntry: { id: string } }>(`
      mutation Create($input: CreateContentEntryInput!) {
        createContentEntry(input: $input) { id }
      }
    `, { input: { contentTypeId: typeId, organizationId: ORGANIZATION_ID, slug, data } });
    console.log(`   + Created ${contentTypeSlug}: ${slug}`);
    return result.createContentEntry.id;
  }
}

// Wrapper with delay
async function createWithDelay(
  contentTypeSlug: string,
  slug: string,
  data: Record<string, unknown>
): Promise<string> {
  const result = await upsertEntry(contentTypeSlug, slug, data);
  await delay(200); // 200ms delay between requests
  return result;
}

// ============================================================================
// CONTENT DATA
// ============================================================================

async function createSiteSettings(): Promise<void> {
  console.log('\n📦 Site Settings...');

  await createWithDelay('site-settings', 'global-settings', {
    siteName: 'NoMad Wynwood',
    siteDescription: 'The NoMad Bar in Miami',
    navMenuLabel: 'menu',
    navCloseLabel: 'Close',
    navReserveButtonText: 'Reserve a Table',
    navReserveButtonUrl: '#',
    navBackgroundImage: M(`${CDN_NOMAD}/hero/nav-background.jpg`),
    navLinks: [
      { href: '/', label: 'Home' },
      { href: '/menu', label: 'Menu' },
      { href: '/private-events', label: 'Private Events' },
      { href: '/programming', label: 'Programming' },
      { href: '/about', label: 'About' },
      { href: '/getting-here', label: 'Getting Here' },
    ],
    locationName: 'the nomad bar',
    locationAddress: '280 NW 27th St, Miami, FL 33127, United States',
    locationPhone: '+1-877-666-2312',
    hours: [
      { days: 'Tue-Fri', time: '11 AM — 10 PM' },
      { days: 'Sat-Sun', time: '12 PM — 10 PM' },
      { days: 'Mon', time: '(Closed)' },
    ],
    footerWordmarkImage: M(`${CDN_NOMAD}/nomad-wynwood-wordmark-footer.svg`),
    footerWordmarkAlt: 'The NoMad Bar',
    footerNewsletterPlaceholder: 'Please enter your email',
    footerNewsletterConsentText: 'I agree to the Privacy Policy',
    footerLinks: [
      { href: '/gift-cards', label: 'Gift Cards' },
      { href: '/contact', label: 'Contact us' },
      { href: '/faq', label: 'FAQ' },
    ],
    footerLegalLinks: [
      { href: '#', label: 'Copyright © 2025' },
      { href: '/accessibility', label: 'accessibility' },
      { href: '/terms', label: 'Terms & Conditions' },
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/careers', label: 'careers' },
    ],
    notFoundTitle: '404',
    notFoundMessage: 'Lost? Must Be the Cocktails',
    notFoundButtonText: 'Take Me Home',
    notFoundButtonHref: '/',
    notFoundGalleryImages: [
      { src: IMAGES.gallery.image1, alt: 'Gallery 1' },
      { src: IMAGES.gallery.image2, alt: 'Gallery 2' },
      { src: IMAGES.gallery.image3, alt: 'Gallery 3' },
    ],
  });
}

async function createInstagramFeed(): Promise<void> {
  console.log('\n📦 Instagram Feed...');

  await createWithDelay('instagram-feed', 'global-instagram', {
    title: 'Inspiration is everywhere',
    handle: '@nomadwynwood',
    handleUrl: 'https://instagram.com/nomadwynwood',
    image1: M(IMAGES.instagram.image1),
    image2: M(IMAGES.instagram.image2),
    image3: M(IMAGES.instagram.image3),
    image4: M(IMAGES.instagram.image4),
  });
}

async function createFaqItems(): Promise<void> {
  console.log('\n📦 FAQ Items...');

  const faqs = [
    { q: 'Turpis adipiscing mi tincidunt ultricies nunc. At enim metus quis?', a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { q: 'Morbi mauris pharetra nisi sed massa. Nec sit lobortis bibendum?', a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { q: 'Nibh diam amet nulla consectetur nulla id pulvinar enim?', a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { q: 'Fringilla dictumst mauris laoreet ac aliquam integer consectetur?', a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { q: 'Nunc odio ut magna lectus eget accumsan turpis. Bibendum neque?', a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ];

  for (let i = 0; i < faqs.length; i++) {
    await createWithDelay('faq-item', `faq-${i + 1}`, {
      question: faqs[i].q,
      answer: faqs[i].a,
      sortOrder: i + 1,
    });
  }
}

async function createTeamMembers(): Promise<void> {
  console.log('\n📦 Team Members...');

  const members = [
    { name: 'Marta Jones', title: 'Executive Chef', img: `${CDN_NOMAD}/about/chef-1.jpg` },
    { name: 'Elias Berg', title: 'Bar Director', img: `${CDN_NOMAD}/about/chef-2.jpg` },
    { name: 'Liam Foster', title: 'Wine Director', img: `${CDN_NOMAD}/about/chef-3.jpg` },
  ];

  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    await createWithDelay('team-member', m.name.toLowerCase().replace(/\s+/g, '-'), {
      name: m.name,
      title: m.title,
      description: 'Odio neque enim leo egestas aliquam quisque. Convallis phasellus sed viverra arcu nec et ullamcorper.',
      imageSrc: M(m.img),
      sortOrder: i + 1,
    });
  }
}

async function createEvents(): Promise<void> {
  console.log('\n📦 Events...');

  const events = [
    { title: 'Live Music', desc: 'Join us for live performances featuring local and international artists.', img: IMAGES.events.card1 },
    { title: "Chef's Table", desc: 'An exclusive dining experience with our executive chef.', img: IMAGES.events.card2 },
    { title: 'Wine Tastings', desc: 'Explore curated selections from renowned vineyards.', img: IMAGES.events.card3 },
  ];

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    await createWithDelay('event', e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), {
      title: e.title,
      description: e.desc,
      imageSrc: M(e.img),
      sortOrder: i + 1,
    });
  }
}

async function createMenuContent(): Promise<void> {
  console.log('\n📦 Menu Categories, Sections, Items...');

  // Categories
  const cats = [
    { name: 'Brunch', sub: 'Available Every Day, 11 AM – 3 PM', active: true },
    { name: 'All Day', sub: 'Available 11 AM – 10 PM' },
    { name: 'Cocktails', sub: 'Signature and Classic Cocktails' },
    { name: 'Wine', sub: 'Curated Wine Selection' },
    { name: 'Happy Hour', sub: '4 PM – 7 PM Daily' },
  ];
  for (let i = 0; i < cats.length; i++) {
    await createWithDelay('menu-category', cats[i].name.toLowerCase().replace(/\s+/g, '-'), {
      name: cats[i].name, subtitle: cats[i].sub || '', isActive: cats[i].active || false, sortOrder: i + 1,
    });
  }

  // Sections
  const sects = ['Appetizers', 'Mains', 'Sides'];
  for (let i = 0; i < sects.length; i++) {
    await createWithDelay('menu-section', `brunch-${sects[i].toLowerCase()}`, {
      name: sects[i], categorySlug: 'brunch', sortOrder: i + 1,
    });
  }

  // Items
  const items = [
    { n: 'Yoghurt & Berries', p: '$14', d: 'NoMad Granola, Honey, Mint', s: 'brunch-appetizers' },
    { n: 'Kale Salad', p: '$17', d: 'Pear, Pevensey Blue, Sourdough Crisps', s: 'brunch-appetizers' },
    { n: 'Seared Salmon', p: '$28', d: 'Quinoa, Roasted Vegetables', s: 'brunch-mains' },
    { n: 'Steak Frites', p: '$35', d: 'Garlic Butter, Rosemary', s: 'brunch-mains' },
    { n: 'Grilled Asparagus', p: '$12', d: 'Lemon Aioli', s: 'brunch-sides' },
    { n: 'Truffle Fries', p: '$15', d: 'Parmesan, Herbs', s: 'brunch-sides' },
  ];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    await createWithDelay('menu-item', `${it.s}-${it.n.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, {
      name: it.n, price: it.p, description: it.d, sectionSlug: it.s, sortOrder: i + 1,
    });
  }
}

async function createPages(): Promise<void> {
  console.log('\n📦 Pages...');

  // Homepage
  await createWithDelay('nomad-page', 'homepage', {
    title: 'NoMad Wynwood',
    metaDescription: 'The NoMad Bar in Miami',
    heroLogoSrc: M(`${CDN_NOMAD}/nomad-wynwood-mark-svg.svg`),
    heroLeftImage: M(IMAGES.hero.left),
    heroRightImage: M(IMAGES.hero.right),
    introHeading: 'Leo bibendum sem urna fringilla quisque malesuada non facilisi.',
    introParagraph: 'Risus pretium massa et eu dignissim. Non non ligula lacus velit mi aliquet neque.',
    introButtonText: 'Reserve a Table',
    introLocationLabel: '01. location',
    introLocationAddress: '280 NW 27th St, Miami, FL 33127, United States',
    introLocationPhone: '+1-877-666-2312',
    introHoursLabel: '02. hours',
    introHoursTimes: ['Tue-Fri 11 AM — 10 PM', 'Sat-Sun 12 PM — 10 PM', 'Mon (Closed)'],
    galleryImage1: M(IMAGES.gallery.image1),
    galleryImage2: M(IMAGES.gallery.image2),
    galleryImage3: M(IMAGES.gallery.image3),
    menuHeading: 'Every dish tells a story of spice, care, and heritage.',
    menuParagraph: 'Risus pretium massa et eu dignissim.',
    menuButtonText: 'see our menu',
    menuButtonHref: '/menu',
    menuFullWidthImageSrc: M(`${CDN_NOMAD}/about/dining-table.jpg`),
    menuFullWidthImageAlt: 'Dining experience',
    eventsHeading: 'Risus viverra enim vitae commodo.',
    eventsParagraph: 'Bibendum quis dui eros felis est cursus justo ridiculus id.',
    eventsButtonText: 'see upcoming events',
    eventsButtonHref: '/programming',
    eventsImageSrc: M(IMAGES.events.hero),
    contactHeading: 'Enim ac in leo cursus.',
    contactParagraph: 'Bibendum quis dui eros felis est cursus justo ridiculus id.',
    contactButtonText: 'contact us',
    contactButtonHref: '/contact',
    contactImageSrc: M(IMAGES.contact.hero),
    instagramTitle: 'Inspiration is everywhere',
    instagramHandle: '@nomadwynwood',
    instagramHandleUrl: 'https://instagram.com/nomadwynwood',
    instagramImage1: M(IMAGES.instagram.image1),
    instagramImage2: M(IMAGES.instagram.image2),
    instagramImage3: M(IMAGES.instagram.image3),
    instagramImage4: M(IMAGES.instagram.image4),
  });

  // FAQ
  await createWithDelay('nomad-page', 'faq', {
    title: 'FAQ',
    heroHeading: 'A vibrant gathering place where tastemakers and travelers connect',
    galleryImage1: M(IMAGES.gallery.image1),
    galleryImage2: M(IMAGES.gallery.image2),
    galleryImage3: M(IMAGES.gallery.image3),
    instagramTitle: 'Inspiration is everywhere',
    instagramHandle: '@nomadwynwood',
    instagramHandleUrl: 'https://instagram.com/nomadwynwood',
    instagramImage1: M(IMAGES.instagram.image1),
    instagramImage2: M(IMAGES.instagram.image2),
    instagramImage3: M(IMAGES.instagram.image3),
    instagramImage4: M(IMAGES.instagram.image4),
  });

  // About
  await createWithDelay('nomad-page', 'about', {
    title: 'About',
    heroHeading: 'Mauris mollis vel ut tempus vitae purus duis integer.',
    heroImageSrc: M(`${CDN_NOMAD}/about/heritage.jpg`),
    heritageTitle: 'Heritage',
    heritageParagraph: 'Bibendum quis dui eros felis est cursus justo ridiculus id.',
    heritageImageSrc: M(`${CDN_NOMAD}/about/dining-table.jpg`),
    quoteHeading: 'Arcu feugiat vitae arcu et justo tortor.',
    quoteParagraph: 'Risus pretium massa et eu dignissim.',
    team: [
      { name: 'Marta Jones', title: 'Executive Chef', description: 'Odio neque enim leo egestas.', imageSrc: `${CDN_NOMAD}/about/chef-1.jpg` },
      { name: 'Elias Berg', title: 'Bar Director', description: 'Odio neque enim leo egestas.', imageSrc: `${CDN_NOMAD}/about/chef-2.jpg` },
      { name: 'Liam Foster', title: 'Wine Director', description: 'Odio neque enim leo egestas.', imageSrc: `${CDN_NOMAD}/about/chef-3.jpg` },
    ],
    awardsTitle: 'Awards & Recognitions',
    awardsLogo1: M(`${CDN_NOMAD}/awards/i-prefer.png`),
    awardsLogo2: M(`${CDN_NOMAD}/awards/lifestyle-traveler.png`),
    awardsLogo3: M(`${CDN_NOMAD}/awards/conde-nast-traveler.png`),
    awardsLogo4: M(`${CDN_NOMAD}/awards/citi-living.png`),
    faqTitle: 'Frequently Asked Questions',
    faqItems: [
      { question: 'Turpis adipiscing mi tincidunt?', answer: 'Lorem ipsum dolor sit amet.' },
      { question: 'Morbi mauris pharetra nisi?', answer: 'Lorem ipsum dolor sit amet.' },
    ],
    instagramTitle: 'Inspiration is everywhere',
    instagramHandle: '@nomadwynwood',
    instagramHandleUrl: 'https://instagram.com/nomadwynwood',
    instagramImage1: M(IMAGES.instagram.image1),
    instagramImage2: M(IMAGES.instagram.image2),
    instagramImage3: M(IMAGES.instagram.image3),
    instagramImage4: M(IMAGES.instagram.image4),
  });

  // Programming
  await createWithDelay('nomad-page', 'programming', {
    title: 'Programming',
    heroHeading: 'Upcoming Events',
    heroImageSrc: M(IMAGES.events.hero),
    introColumn1: 'The NoMad Wynwood transforms every visit into an experience.',
    introColumn2: 'Our culinary team crafts seasonal menus that honor tradition.',
    introButtonText: 'Reserve for an Event',
    events: [
      { title: 'Live Music', description: 'Join us for live performances.', imageSrc: IMAGES.events.card1 },
      { title: "Chef's Table", description: 'An exclusive dining experience.', imageSrc: IMAGES.events.card2 },
      { title: 'Wine Tastings', description: 'Explore curated selections.', imageSrc: IMAGES.events.card3 },
    ],
    instagramTitle: 'Inspiration is everywhere',
    instagramHandle: '@nomadwynwood',
    instagramHandleUrl: 'https://instagram.com/nomadwynwood',
    instagramImage1: M(IMAGES.instagram.image1),
    instagramImage2: M(IMAGES.instagram.image2),
    instagramImage3: M(IMAGES.instagram.image3),
    instagramImage4: M(IMAGES.instagram.image4),
  });

  // Menu
  await createWithDelay('nomad-page', 'menu', {
    title: 'Menu',
    menuTitle: 'Brunch',
    menuSubtitle: 'Available Every Day, 11 AM – 3 PM',
    galleryImage1: M(IMAGES.menu.heroLeft),
    galleryImage2: M(IMAGES.menu.heroRight),
    galleryImage3: M(IMAGES.gallery.image1),
    instagramTitle: 'Inspiration is everywhere',
    instagramHandle: '@nomadwynwood',
    instagramHandleUrl: 'https://instagram.com/nomadwynwood',
    instagramImage1: M(IMAGES.instagram.image1),
    instagramImage2: M(IMAGES.instagram.image2),
    instagramImage3: M(IMAGES.instagram.image3),
    instagramImage4: M(IMAGES.instagram.image4),
  });

  // Private Events
  await createWithDelay('nomad-page', 'private-events', {
    title: 'Private Events',
    heroHeading: 'Private Events',
    heroImageSrc: M(IMAGES.events.hero),
    heroParagraph: 'Host your next celebration at NoMad Wynwood.',
    heroButtonText: 'Inquire Now',
    formTitle: 'Inquire About Your Event',
    formSubmitText: 'Submit Request',
    instagramTitle: 'Inspiration is everywhere',
    instagramHandle: '@nomadwynwood',
    instagramHandleUrl: 'https://instagram.com/nomadwynwood',
    instagramImage1: M(IMAGES.instagram.image1),
    instagramImage2: M(IMAGES.instagram.image2),
    instagramImage3: M(IMAGES.instagram.image3),
    instagramImage4: M(IMAGES.instagram.image4),
  });

  // Getting Here
  await createWithDelay('nomad-page', 'getting-here', {
    title: 'Getting Here',
    infoTitle: 'Visit Us',
    infoParagraph: "Located in the heart of Wynwood, Miami's premier arts district.",
    infoAddress: '280 NW 27th St, Miami, FL 33127',
    infoPhone: '+1-877-666-2312',
    infoEmail: 'hello@nomadwynwood.com',
    infoHours: { label: 'Hours', times: ['Tue-Fri 11 AM — 10 PM', 'Sat-Sun 12 PM — 10 PM', 'Mon (Closed)'] },
    locationTitle: 'Find Us',
    locationParagraph: 'Nestled in the vibrant Wynwood Arts District.',
    instagramTitle: 'Inspiration is everywhere',
    instagramHandle: '@nomadwynwood',
    instagramHandleUrl: 'https://instagram.com/nomadwynwood',
    instagramImage1: M(IMAGES.instagram.image1),
    instagramImage2: M(IMAGES.instagram.image2),
    instagramImage3: M(IMAGES.instagram.image3),
    instagramImage4: M(IMAGES.instagram.image4),
  });

  // Contact
  await createWithDelay('nomad-page', 'contact', {
    title: 'Contact',
    infoHours: { label: '01. hours', times: ['Tue-Fri 11 AM — 10 PM', 'Sat-Sun 12 PM — 10 PM', 'Mon (Closed)'] },
    instagramTitle: 'Inspiration is everywhere',
    instagramHandle: '@nomadwynwood',
    instagramHandleUrl: 'https://instagram.com/nomadwynwood',
    instagramImage1: M(IMAGES.instagram.image1),
    instagramImage2: M(IMAGES.instagram.image2),
    instagramImage3: M(IMAGES.instagram.image3),
    instagramImage4: M(IMAGES.instagram.image4),
  });
}

async function main(): Promise<void> {
  console.log('🚀 Phase 6: Populating CMS Content\n');

  await login();
  await createSiteSettings();
  await createInstagramFeed();
  await createFaqItems();
  await createTeamMembers();
  await createEvents();
  await createMenuContent();
  await createPages();

  console.log('\n✅ Phase 6 Complete!');
}

main().catch(console.error);
