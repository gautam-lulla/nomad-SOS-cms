/**
 * Template Registry
 *
 * Maps page slugs to their corresponding template components.
 * The catch-all route uses this to render the appropriate template
 * based on the page slug from the CMS.
 */

import { AboutTemplate } from './AboutTemplate';
import { FAQTemplate } from './FAQTemplate';
import { ContactTemplate } from './ContactTemplate';
import { GettingHereTemplate } from './GettingHereTemplate';
import { ProgrammingTemplate } from './ProgrammingTemplate';
import { PrivateEventsTemplate } from './PrivateEventsTemplate';

// Re-export all templates
export { AboutTemplate } from './AboutTemplate';
export { FAQTemplate } from './FAQTemplate';
export { ContactTemplate } from './ContactTemplate';
export { GettingHereTemplate } from './GettingHereTemplate';
export { ProgrammingTemplate } from './ProgrammingTemplate';
export { PrivateEventsTemplate } from './PrivateEventsTemplate';

// Re-export types
export * from './types';

/**
 * Template configuration
 * Maps page slugs to their template components and any special requirements
 */
export interface TemplateConfig {
  component: React.ComponentType<any>;
  requiresSiteSettings?: boolean;
}

/**
 * Template registry - maps page slugs to template configurations
 *
 * When a page is fetched from the CMS by slug, this registry determines
 * which template component to use for rendering.
 */
export const templateRegistry: Record<string, TemplateConfig> = {
  'about': {
    component: AboutTemplate,
  },
  'faq': {
    component: FAQTemplate,
  },
  'contact': {
    component: ContactTemplate,
  },
  'getting-here': {
    component: GettingHereTemplate,
    requiresSiteSettings: true,
  },
  'programming': {
    component: ProgrammingTemplate,
  },
  'private-events': {
    component: PrivateEventsTemplate,
  },
};

/**
 * Get the template configuration for a given page slug
 * Returns null if no template is registered for the slug
 */
export function getTemplateConfig(slug: string): TemplateConfig | null {
  return templateRegistry[slug] || null;
}

/**
 * Get the template component for a given page slug
 * Returns null if no template is registered for the slug
 */
export function getTemplate(slug: string): React.ComponentType<any> | null {
  const config = getTemplateConfig(slug);
  return config?.component || null;
}

/**
 * Check if a page slug has a registered template
 */
export function hasTemplate(slug: string): boolean {
  return slug in templateRegistry;
}

/**
 * Get all registered page slugs
 */
export function getRegisteredSlugs(): string[] {
  return Object.keys(templateRegistry);
}
