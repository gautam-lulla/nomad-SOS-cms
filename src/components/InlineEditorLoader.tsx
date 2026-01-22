'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface InlineEditorLoaderProps {
  orgSlug: string;
}

export function InlineEditorLoader({ orgSlug }: InlineEditorLoaderProps) {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  useEffect(() => {
    if (!isEditMode) return;

    // Check if script is already loaded
    if (document.querySelector('script[data-cms-editor]')) return;

    const script = document.createElement('script');
    script.src =
      'https://backend-production-162b.up.railway.app/inline-editor.js';
    script.dataset.cmsOrg = orgSlug;
    script.dataset.cmsApi = 'https://backend-production-162b.up.railway.app';
    script.dataset.cmsAdmin = 'https://sphereos.vercel.app';
    script.dataset.cmsEditor = 'true';
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount (though typically not needed for this use case)
      const existingScript = document.querySelector('script[data-cms-editor]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [isEditMode, orgSlug]);

  return null;
}
