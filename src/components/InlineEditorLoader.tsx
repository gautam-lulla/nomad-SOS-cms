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

    // Use local URLs in development, production URLs in production
    const isDev = process.env.NODE_ENV === 'development' ||
                  window.location.hostname === 'localhost';

    const apiBase = isDev
      ? 'http://localhost:3001'
      : 'https://backend-production-162b.up.railway.app';

    // Admin runs on port 3002 locally (the headless-cms admin)
    const adminBase = isDev
      ? 'http://localhost:3002'
      : 'https://sphereos.vercel.app';

    const script = document.createElement('script');
    script.src = `${apiBase}/inline-editor.js`;
    script.dataset.cmsOrg = orgSlug;
    script.dataset.cmsApi = apiBase;
    script.dataset.cmsAdmin = adminBase;
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
