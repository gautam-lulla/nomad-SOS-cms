import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const CMS_GRAPHQL_URL = process.env.NEXT_PUBLIC_CMS_GRAPHQL_URL || 'http://localhost:3000/graphql';

/**
 * Custom fetch that disables Next.js Data Cache
 * Used in edit mode to ensure fresh data is fetched
 */
const uncachedFetch: typeof fetch = (input, init) => {
  return fetch(input, {
    ...init,
    cache: 'no-store',
  });
};

interface ClientOptions {
  token?: string;
  /** Set to true in edit mode to bypass Next.js Data Cache */
  noCache?: boolean;
}

/**
 * Create Apollo Client for server-side rendering
 * Used in React Server Components with async/await
 *
 * @param options.token - Auth token for authenticated requests
 * @param options.noCache - Set to true in edit mode to bypass cache
 */
export function getServerClient(options: ClientOptions = {}) {
  const { token, noCache = false } = options;

  const httpLink = new HttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch: noCache ? uncachedFetch : fetch,
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
 * Create a basic client for public queries (no auth)
 *
 * @param noCache - Set to true in edit mode to bypass cache
 */
export function getPublicClient(noCache = false) {
  const httpLink = new HttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch: noCache ? uncachedFetch : fetch,
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
