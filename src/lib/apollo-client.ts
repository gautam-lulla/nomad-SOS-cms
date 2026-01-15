import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const CMS_GRAPHQL_URL = process.env.NEXT_PUBLIC_CMS_GRAPHQL_URL || 'http://localhost:3000/graphql';

/**
 * Create Apollo Client for server-side rendering
 * Used in React Server Components with async/await
 */
export function getServerClient(token?: string) {
  const httpLink = new HttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch,
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
 */
export function getPublicClient() {
  const httpLink = new HttpLink({
    uri: CMS_GRAPHQL_URL,
    fetch,
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
