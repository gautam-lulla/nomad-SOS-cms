'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface InlineEditorLoaderProps {
  orgSlug: string;
  apiBase?: string;
  adminBase?: string; // Separate admin URL if admin panel is on different port/domain
}

/**
 * Loads the CMS inline editor script when ?edit=true is present in the URL.
 * This component has zero impact on normal visitors - the script only loads
 * when edit mode is explicitly requested.
 */
export function InlineEditorLoader({
  orgSlug,
  apiBase = 'https://cms.sphereos.dev',
  adminBase,
}: InlineEditorLoaderProps) {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  useEffect(() => {
    if (!isEditMode) return;

    // Check if script is already loaded
    if (document.querySelector('script[data-cms-editor]')) {
      return;
    }

    // Dynamically inject the editor script
    const script = document.createElement('script');
    // Add cache-busting parameter for development
    const cacheBuster = process.env.NODE_ENV === 'development' ? `?v=${Date.now()}` : '';
    script.src = `${apiBase}/inline-editor.js${cacheBuster}`;
    script.dataset.cmsOrg = orgSlug;
    script.dataset.cmsApi = apiBase;
    if (adminBase) {
      script.dataset.cmsAdmin = adminBase;
    }
    script.dataset.cmsEditor = 'true';
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount (though this typically won't happen)
      script.remove();
    };
  }, [isEditMode, orgSlug, apiBase, adminBase]);

  return null;
}

export default InlineEditorLoader;
