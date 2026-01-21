/**
 * Dynamic Catch-All Route
 *
 * Handles all content pages dynamically by:
 * 1. Extracting the slug from the URL
 * 2. Fetching the page content from the CMS
 * 3. Rendering the appropriate template based on the slug
 *
 * This enables new pages to be created in the CMS without code changes.
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SiteNavigation, SiteFooter } from "@/components/layout";
import {
  getPageBySlug,
  getAllPageSlugs,
  getInstagramContent,
  getSiteSettings,
} from '@/lib/content';
import {
  getTemplate,
  getTemplateConfig,
  hasTemplate,
} from '@/components/templates';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string[] }>;
}

/**
 * Dynamic page route.
 * Fetches page content from CMS and renders using the appropriate template.
 */
export default async function DynamicPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  // Check if we have a template for this slug
  if (!hasTemplate(slug)) {
    // No template registered for this slug - return 404
    return notFound();
  }

  // Fetch page from CMS
  const page = await getPageBySlug(slug);

  // 404 if page doesn't exist in CMS
  if (!page) {
    return notFound();
  }

  // Get template configuration
  const templateConfig = getTemplateConfig(slug);
  const Template = getTemplate(slug);

  if (!Template) {
    return notFound();
  }

  // Fetch additional data needed by templates
  const instagramContent = await getInstagramContent();

  // Fetch site settings if required by the template
  const siteSettings = templateConfig?.requiresSiteSettings
    ? await getSiteSettings()
    : undefined;

  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <SiteNavigation />

      {/* Template Content */}
      <Template
        slug={slug}
        pageContent={page.data}
        instagramContent={instagramContent}
        siteSettings={siteSettings}
      />

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}

/**
 * Generate metadata from CMS content.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  // Check if we have a template for this slug
  if (!hasTemplate(slug)) {
    return { title: 'Not Found' };
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: 'Not Found' };
  }

  // Extract metadata from page data
  const data = page.data as Record<string, unknown>;
  const title = (data.metaTitle as string) ||
                (data.title as string) ||
                (data.hero as Record<string, unknown>)?.heading as string ||
                slug;

  return {
    title: `NoMad Wynwood | ${title}`,
    description: data.metaDescription as string,
  };
}

/**
 * Pre-render known pages at build time.
 * New pages created after build will be server-rendered on demand.
 */
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();

  return slugs
    .filter(hasTemplate) // Only generate for slugs with registered templates
    .map((slug) => ({
      slug: slug.split('/'),
    }));
}
