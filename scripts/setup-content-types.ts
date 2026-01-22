/**
 * Phase 5: Create CMS Content Types
 *
 * Creates all content types with correct field definitions.
 * CRITICAL: Uses individual MEDIA fields for image arrays (not JSON).
 */

const CMS_URL = 'https://backend-production-162b.up.railway.app/graphql';
const ORGANIZATION_ID = '4a8061e8-ea3e-4b95-8c30-9143a8f7e803';

interface Field {
  name: string;
  slug: string;
  type: 'TEXT' | 'RICH_TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'MEDIA' | 'REFERENCE';
  required?: boolean;
  description?: string;
}

interface ContentTypeInput {
  name: string;
  slug: string;
  description: string;
  fields: Field[];
}

let authToken = '';

async function gqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(CMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }
  return json.data;
}

async function login(): Promise<void> {
  console.log('🔐 Authenticating with CMS...');
  const data = await gqlRequest<{ login: { accessToken: string } }>(`
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
      }
    }
  `, {
    input: {
      email: 'dev@sphereos.local',
      password: 'password123',
    },
  });
  authToken = data.login.accessToken;
  console.log('✅ Authenticated');
}

async function createContentType(input: ContentTypeInput): Promise<string> {
  console.log(`📦 Creating content type: ${input.name}`);

  const data = await gqlRequest<{ createContentType: { id: string } }>(`
    mutation CreateContentType($input: CreateContentTypeInput!) {
      createContentType(input: $input) {
        id
        slug
        name
      }
    }
  `, {
    input: {
      organizationId: ORGANIZATION_ID,
      name: input.name,
      slug: input.slug,
      description: input.description,
      fields: input.fields,
    },
  });

  console.log(`   ✅ Created: ${input.slug} (${data.createContentType.id})`);
  return data.createContentType.id;
}

// ============================================================================
// CONTENT TYPE DEFINITIONS
// ============================================================================

const CONTENT_TYPES: ContentTypeInput[] = [
  // -------------------------------------------------------------------------
  // TIER 1: GLOBAL (Site-wide settings)
  // -------------------------------------------------------------------------
  {
    name: 'Site Settings',
    slug: 'site-settings',
    description: 'Global site configuration including navigation, footer, and 404 page',
    fields: [
      // Basic
      { name: 'Site Name', slug: 'siteName', type: 'TEXT', required: true },
      { name: 'Site Description', slug: 'siteDescription', type: 'TEXT' },

      // Navigation
      { name: 'Nav Menu Label', slug: 'navMenuLabel', type: 'TEXT' },
      { name: 'Nav Close Label', slug: 'navCloseLabel', type: 'TEXT' },
      { name: 'Nav Reserve Button Text', slug: 'navReserveButtonText', type: 'TEXT' },
      { name: 'Nav Reserve Button URL', slug: 'navReserveButtonUrl', type: 'TEXT' },
      { name: 'Nav Background Image', slug: 'navBackgroundImage', type: 'MEDIA' },
      { name: 'Nav Links', slug: 'navLinks', type: 'JSON', description: 'Array of {href, label}' },

      // Location
      { name: 'Location Name', slug: 'locationName', type: 'TEXT' },
      { name: 'Location Address', slug: 'locationAddress', type: 'TEXT' },
      { name: 'Location Phone', slug: 'locationPhone', type: 'TEXT' },

      // Hours
      { name: 'Hours', slug: 'hours', type: 'JSON', description: 'Array of {days, time}' },

      // Footer
      { name: 'Footer Wordmark Image', slug: 'footerWordmarkImage', type: 'MEDIA' },
      { name: 'Footer Wordmark Alt', slug: 'footerWordmarkAlt', type: 'TEXT' },
      { name: 'Footer Newsletter Placeholder', slug: 'footerNewsletterPlaceholder', type: 'TEXT' },
      { name: 'Footer Newsletter Consent', slug: 'footerNewsletterConsentText', type: 'TEXT' },
      { name: 'Footer Links', slug: 'footerLinks', type: 'JSON', description: 'Array of {href, label}' },
      { name: 'Footer Legal Links', slug: 'footerLegalLinks', type: 'JSON', description: 'Array of {href, label}' },

      // 404 Page
      { name: '404 Title', slug: 'notFoundTitle', type: 'TEXT' },
      { name: '404 Message', slug: 'notFoundMessage', type: 'TEXT' },
      { name: '404 Button Text', slug: 'notFoundButtonText', type: 'TEXT' },
      { name: '404 Button Href', slug: 'notFoundButtonHref', type: 'TEXT' },
      { name: '404 Gallery Images', slug: 'notFoundGalleryImages', type: 'JSON', description: 'Array of {src, alt}' },
    ],
  },

  // -------------------------------------------------------------------------
  // TIER 2: COMPONENT TYPES
  // -------------------------------------------------------------------------

  // Instagram Feed - with INDIVIDUAL MEDIA fields (not JSON array!)
  {
    name: 'Instagram Feed',
    slug: 'instagram-feed',
    description: 'Instagram section with individual image fields',
    fields: [
      { name: 'Title', slug: 'title', type: 'TEXT', required: true },
      { name: 'Handle', slug: 'handle', type: 'TEXT', required: true },
      { name: 'Handle URL', slug: 'handleUrl', type: 'TEXT' },
      // Individual MEDIA fields instead of JSON array
      { name: 'Image 1', slug: 'image1', type: 'MEDIA' },
      { name: 'Image 2', slug: 'image2', type: 'MEDIA' },
      { name: 'Image 3', slug: 'image3', type: 'MEDIA' },
      { name: 'Image 4', slug: 'image4', type: 'MEDIA' },
    ],
  },

  // FAQ Item
  {
    name: 'FAQ Item',
    slug: 'faq-item',
    description: 'Individual FAQ question and answer',
    fields: [
      { name: 'Question', slug: 'question', type: 'TEXT', required: true },
      { name: 'Answer', slug: 'answer', type: 'RICH_TEXT', required: true },
      { name: 'Sort Order', slug: 'sortOrder', type: 'NUMBER' },
    ],
  },

  // Team Member
  {
    name: 'Team Member',
    slug: 'team-member',
    description: 'Team member profile',
    fields: [
      { name: 'Name', slug: 'name', type: 'TEXT', required: true },
      { name: 'Title', slug: 'title', type: 'TEXT', required: true },
      { name: 'Description', slug: 'description', type: 'RICH_TEXT' },
      { name: 'Image', slug: 'imageSrc', type: 'MEDIA' },
      { name: 'Sort Order', slug: 'sortOrder', type: 'NUMBER' },
    ],
  },

  // Event
  {
    name: 'Event',
    slug: 'event',
    description: 'Programming/event card',
    fields: [
      { name: 'Title', slug: 'title', type: 'TEXT', required: true },
      { name: 'Description', slug: 'description', type: 'RICH_TEXT' },
      { name: 'Image', slug: 'imageSrc', type: 'MEDIA' },
      { name: 'Date', slug: 'date', type: 'TEXT' },
      { name: 'Sort Order', slug: 'sortOrder', type: 'NUMBER' },
    ],
  },

  // -------------------------------------------------------------------------
  // MENU SYSTEM
  // -------------------------------------------------------------------------

  // Menu Category (Drinks, Bar Menu, Snacks)
  {
    name: 'Menu Category',
    slug: 'menu-category',
    description: 'Top-level menu category tab',
    fields: [
      { name: 'Name', slug: 'name', type: 'TEXT', required: true },
      { name: 'Subtitle', slug: 'subtitle', type: 'TEXT' },
      { name: 'Is Active', slug: 'isActive', type: 'BOOLEAN' },
      { name: 'Sort Order', slug: 'sortOrder', type: 'NUMBER' },
    ],
  },

  // Menu Section (within a category)
  {
    name: 'Menu Section',
    slug: 'menu-section',
    description: 'Section within a menu category',
    fields: [
      { name: 'Name', slug: 'name', type: 'TEXT', required: true },
      { name: 'Category Slug', slug: 'categorySlug', type: 'TEXT', required: true },
      { name: 'Sort Order', slug: 'sortOrder', type: 'NUMBER' },
    ],
  },

  // Menu Item
  {
    name: 'Menu Item',
    slug: 'menu-item',
    description: 'Individual menu item',
    fields: [
      { name: 'Name', slug: 'name', type: 'TEXT', required: true },
      { name: 'Price', slug: 'price', type: 'TEXT', required: true },
      { name: 'Description', slug: 'description', type: 'TEXT' },
      { name: 'Section Slug', slug: 'sectionSlug', type: 'TEXT', required: true },
      { name: 'Sort Order', slug: 'sortOrder', type: 'NUMBER' },
    ],
  },

  // -------------------------------------------------------------------------
  // TIER 3: PAGES
  // -------------------------------------------------------------------------

  // Nomad Page - flat fields for all page content
  {
    name: 'Nomad Page',
    slug: 'nomad-page',
    description: 'Website page with all content sections',
    fields: [
      // Page basics
      { name: 'Title', slug: 'title', type: 'TEXT', required: true },
      { name: 'Meta Description', slug: 'metaDescription', type: 'TEXT' },

      // Hero section (homepage variant)
      { name: 'Hero Logo', slug: 'heroLogoSrc', type: 'MEDIA' },
      { name: 'Hero Left Image', slug: 'heroLeftImage', type: 'MEDIA' },
      { name: 'Hero Right Image', slug: 'heroRightImage', type: 'MEDIA' },

      // Hero section (other pages variant)
      { name: 'Hero Heading', slug: 'heroHeading', type: 'TEXT' },
      { name: 'Hero Image', slug: 'heroImageSrc', type: 'MEDIA' },
      { name: 'Hero Paragraph', slug: 'heroParagraph', type: 'RICH_TEXT' },
      { name: 'Hero Button Text', slug: 'heroButtonText', type: 'TEXT' },

      // Intro section
      { name: 'Intro Heading', slug: 'introHeading', type: 'TEXT' },
      { name: 'Intro Paragraph', slug: 'introParagraph', type: 'RICH_TEXT' },
      { name: 'Intro Button Text', slug: 'introButtonText', type: 'TEXT' },
      { name: 'Intro Column 1', slug: 'introColumn1', type: 'TEXT' },
      { name: 'Intro Column 2', slug: 'introColumn2', type: 'TEXT' },
      { name: 'Intro Location Label', slug: 'introLocationLabel', type: 'TEXT' },
      { name: 'Intro Location Address', slug: 'introLocationAddress', type: 'TEXT' },
      { name: 'Intro Location Phone', slug: 'introLocationPhone', type: 'TEXT' },
      { name: 'Intro Hours Label', slug: 'introHoursLabel', type: 'TEXT' },
      { name: 'Intro Hours Times', slug: 'introHoursTimes', type: 'JSON' },

      // Menu section
      { name: 'Menu Heading', slug: 'menuHeading', type: 'TEXT' },
      { name: 'Menu Paragraph', slug: 'menuParagraph', type: 'RICH_TEXT' },
      { name: 'Menu Button Text', slug: 'menuButtonText', type: 'TEXT' },
      { name: 'Menu Button Href', slug: 'menuButtonHref', type: 'TEXT' },
      { name: 'Menu Full Width Image', slug: 'menuFullWidthImageSrc', type: 'MEDIA' },
      { name: 'Menu Full Width Image Alt', slug: 'menuFullWidthImageAlt', type: 'TEXT' },

      // Events section
      { name: 'Events Heading', slug: 'eventsHeading', type: 'TEXT' },
      { name: 'Events Paragraph', slug: 'eventsParagraph', type: 'RICH_TEXT' },
      { name: 'Events Image', slug: 'eventsImageSrc', type: 'MEDIA' },
      { name: 'Events Button Text', slug: 'eventsButtonText', type: 'TEXT' },
      { name: 'Events Button Href', slug: 'eventsButtonHref', type: 'TEXT' },
      { name: 'Events Array', slug: 'events', type: 'JSON' },

      // Contact section
      { name: 'Contact Heading', slug: 'contactHeading', type: 'TEXT' },
      { name: 'Contact Paragraph', slug: 'contactParagraph', type: 'RICH_TEXT' },
      { name: 'Contact Image', slug: 'contactImageSrc', type: 'MEDIA' },
      { name: 'Contact Button Text', slug: 'contactButtonText', type: 'TEXT' },
      { name: 'Contact Button Href', slug: 'contactButtonHref', type: 'TEXT' },

      // Gallery - individual MEDIA fields
      { name: 'Gallery Image 1', slug: 'galleryImage1', type: 'MEDIA' },
      { name: 'Gallery Image 2', slug: 'galleryImage2', type: 'MEDIA' },
      { name: 'Gallery Image 3', slug: 'galleryImage3', type: 'MEDIA' },
      { name: 'Gallery Image 4', slug: 'galleryImage4', type: 'MEDIA' },
      { name: 'Gallery Image 5', slug: 'galleryImage5', type: 'MEDIA' },
      { name: 'Gallery Image 6', slug: 'galleryImage6', type: 'MEDIA' },

      // Instagram section (references instagram-feed entry, or inline)
      { name: 'Instagram Title', slug: 'instagramTitle', type: 'TEXT' },
      { name: 'Instagram Handle', slug: 'instagramHandle', type: 'TEXT' },
      { name: 'Instagram Handle URL', slug: 'instagramHandleUrl', type: 'TEXT' },
      { name: 'Instagram Image 1', slug: 'instagramImage1', type: 'MEDIA' },
      { name: 'Instagram Image 2', slug: 'instagramImage2', type: 'MEDIA' },
      { name: 'Instagram Image 3', slug: 'instagramImage3', type: 'MEDIA' },
      { name: 'Instagram Image 4', slug: 'instagramImage4', type: 'MEDIA' },

      // FAQ section
      { name: 'FAQ Title', slug: 'faqTitle', type: 'TEXT' },
      { name: 'FAQ Items', slug: 'faqItems', type: 'JSON' },

      // Heritage section (about page)
      { name: 'Heritage Title', slug: 'heritageTitle', type: 'TEXT' },
      { name: 'Heritage Paragraph', slug: 'heritageParagraph', type: 'RICH_TEXT' },
      { name: 'Heritage Image', slug: 'heritageImageSrc', type: 'MEDIA' },

      // Team section (about page)
      { name: 'Team', slug: 'team', type: 'JSON' },

      // Quote section (about page)
      { name: 'Quote Heading', slug: 'quoteHeading', type: 'TEXT' },
      { name: 'Quote Paragraph', slug: 'quoteParagraph', type: 'RICH_TEXT' },

      // Awards section - individual MEDIA fields
      { name: 'Awards Title', slug: 'awardsTitle', type: 'TEXT' },
      { name: 'Awards Logo 1', slug: 'awardsLogo1', type: 'MEDIA' },
      { name: 'Awards Logo 2', slug: 'awardsLogo2', type: 'MEDIA' },
      { name: 'Awards Logo 3', slug: 'awardsLogo3', type: 'MEDIA' },
      { name: 'Awards Logo 4', slug: 'awardsLogo4', type: 'MEDIA' },

      // Info section (contact/getting-here)
      { name: 'Info Title', slug: 'infoTitle', type: 'TEXT' },
      { name: 'Info Paragraph', slug: 'infoParagraph', type: 'RICH_TEXT' },
      { name: 'Info Address', slug: 'infoAddress', type: 'TEXT' },
      { name: 'Info Phone', slug: 'infoPhone', type: 'TEXT' },
      { name: 'Info Email', slug: 'infoEmail', type: 'TEXT' },
      { name: 'Info Hours', slug: 'infoHours', type: 'JSON' },
      { name: 'Info Map URL', slug: 'infoMapUrl', type: 'TEXT' },

      // Location section
      { name: 'Location Title', slug: 'locationTitle', type: 'TEXT' },
      { name: 'Location Paragraph', slug: 'locationParagraph', type: 'RICH_TEXT' },
      { name: 'Location Image', slug: 'locationImageSrc', type: 'MEDIA' },

      // Form section (private events, contact)
      { name: 'Form Title', slug: 'formTitle', type: 'TEXT' },
      { name: 'Form Paragraph', slug: 'formParagraph', type: 'RICH_TEXT' },
      { name: 'Form Fields', slug: 'formFields', type: 'JSON' },
      { name: 'Form Submit Text', slug: 'formSubmitText', type: 'TEXT' },
      { name: 'Form Additional Options', slug: 'formAdditionalOptions', type: 'JSON' },
      { name: 'Form Additional Info', slug: 'formAdditionalInfo', type: 'JSON' },

      // Menu page specific
      { name: 'Menu Title', slug: 'menuTitle', type: 'TEXT' },
      { name: 'Menu Subtitle', slug: 'menuSubtitle', type: 'TEXT' },
      { name: 'Menu Categories', slug: 'categories', type: 'JSON' },
      { name: 'Menu Sections', slug: 'sections', type: 'JSON' },
      { name: 'Active Category', slug: 'activeCategory', type: 'TEXT' },

      // Pagination
      { name: 'Pagination Items Per Page', slug: 'paginationItemsPerPage', type: 'NUMBER' },
      { name: 'Pagination Current', slug: 'paginationCurrent', type: 'NUMBER' },
      { name: 'Pagination Total', slug: 'paginationTotal', type: 'NUMBER' },
    ],
  },
];

async function main(): Promise<void> {
  console.log('🚀 Phase 5: Creating CMS Content Types\n');
  console.log(`   Organization: ${ORGANIZATION_ID}`);
  console.log(`   CMS URL: ${CMS_URL}\n`);

  await login();

  const typeIds: Record<string, string> = {};

  for (const contentType of CONTENT_TYPES) {
    try {
      const id = await createContentType(contentType);
      typeIds[contentType.slug] = id;
    } catch (error) {
      console.error(`   ❌ Failed to create ${contentType.slug}:`, error);
    }
  }

  console.log('\n📋 Content Type IDs for .env.local:\n');
  console.log(`CMS_SITE_SETTINGS_TYPE_ID=${typeIds['site-settings'] || ''}`);
  console.log(`CMS_INSTAGRAM_FEED_TYPE_ID=${typeIds['instagram-feed'] || ''}`);
  console.log(`CMS_FAQ_ITEM_TYPE_ID=${typeIds['faq-item'] || ''}`);
  console.log(`CMS_TEAM_MEMBER_TYPE_ID=${typeIds['team-member'] || ''}`);
  console.log(`CMS_EVENT_TYPE_ID=${typeIds['event'] || ''}`);
  console.log(`CMS_MENU_CATEGORY_TYPE_ID=${typeIds['menu-category'] || ''}`);
  console.log(`CMS_MENU_SECTION_TYPE_ID=${typeIds['menu-section'] || ''}`);
  console.log(`CMS_MENU_ITEM_TYPE_ID=${typeIds['menu-item'] || ''}`);
  console.log(`CMS_NOMAD_PAGE_TYPE_ID=${typeIds['nomad-page'] || ''}`);

  console.log('\n✅ Phase 5 Complete!');
}

main().catch(console.error);
