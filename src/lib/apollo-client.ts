import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const CMS_GRAPHQL_URL = process.env.NEXT_PUBLIC_CMS_GRAPHQL_URL || 'http://localhost:3000/graphql';

/**
 * Check if we're in CMS edit mode by reading the cookie.
 * The cookie is set by middleware when ?edit=true is in the URL.
 *
 * This function safely handles both server and client contexts.
 */
function isEditMode(): boolean {
  // Server-side: try to read from next/headers cookies
  if (typeof window === 'undefined') {
    try {
      // Dynamic import to avoid bundling next/headers in client code
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { cookies } = require('next/headers');
      const cookieStore = cookies();
      return cookieStore.get('cms-edit-mode')?.value === 'true';
    } catch {
      // cookies() throws when not in a request context
      return false;
    }
  }

  // Client-side: read from document.cookie
  if (typeof document !== 'undefined') {
    return document.cookie.includes('cms-edit-mode=true');
  }

  return false;
}

/**
 * Create a fetch function that respects edit mode.
 * In edit mode, bypasses Next.js Data Cache to ensure fresh data.
 */
function createFetch(): typeof fetch {
  const editMode = isEditMode();

  if (editMode) {
    // Edit mode: bypass cache for fresh data
    return (input, init) => fetch(input, { ...init, cache: 'no-store' });
  }

  // Normal mode: use default caching
  return fetch;
}

/**
 * Create Apollo Client for server-side rendering.
 * Used in React Server Components with async/await.
 *
 * Automatically bypasses cache when in edit mode (detected via cookie).
 */
export function getServerClient(token?: string) {
  const httpLink = new HttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch: createFetch(),
  });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  }));

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  });
}

/**
 * Create a basic client for public queries (no auth).
 *
 * Automatically bypasses cache when in edit mode (detected via cookie).
 */
export function getPublicClient() {
  const httpLink = new HttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch: createFetch(),
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });
}
