import { gql } from '@apollo/client';

export const GET_CONTENT_ENTRY_BY_SLUG = gql`
  query GetContentEntryBySlug($slug: String!, $contentTypeId: ID!, $organizationId: ID!) {
    contentEntryBySlug(slug: $slug, contentTypeId: $contentTypeId, organizationId: $organizationId) {
      id
      slug
      data
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONTENT_ENTRIES = gql`
  query GetContentEntries($filter: ContentEntryFilterInput!) {
    contentEntries(filter: $filter) {
      items {
        id
        slug
        data
        createdAt
        updatedAt
      }
      pagination {
        total
        skip
        take
        hasMore
      }
    }
  }
`;
