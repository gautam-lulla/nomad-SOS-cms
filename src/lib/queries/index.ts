import { gql } from '@apollo/client';

// ============================================================================
// Authentication
// ============================================================================

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        id
        email
      }
    }
  }
`;

// ============================================================================
// Organizations
// ============================================================================

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      slug
      name
    }
  }
`;

export const GET_ORGANIZATION_BY_SLUG = gql`
  query GetOrganizationBySlug($slug: String!) {
    organizationBySlug(slug: $slug) {
      id
      slug
      name
    }
  }
`;

// ============================================================================
// Content Types
// ============================================================================

export const GET_CONTENT_TYPES = gql`
  query GetContentTypes($pagination: PaginationInput) {
    contentTypes(pagination: $pagination) {
      items {
        id
        slug
        name
        organizationId
        fields {
          slug
          name
          type
        }
      }
    }
  }
`;

export const GET_CONTENT_TYPE_BY_SLUG = gql`
  query GetContentTypeBySlug($slug: String!, $organizationId: ID!) {
    contentTypeBySlug(slug: $slug, organizationId: $organizationId) {
      id
      slug
      name
      fields {
        slug
        name
        type
        required
        validation
      }
    }
  }
`;

export const CREATE_CONTENT_TYPE = gql`
  mutation CreateContentType($input: CreateContentTypeInput!) {
    createContentType(input: $input) {
      id
      slug
      name
    }
  }
`;

// ============================================================================
// Content Entries
// ============================================================================

export const GET_CONTENT_ENTRIES = gql`
  query GetContentEntries($filter: ContentEntryFilterInput!) {
    contentEntries(filter: $filter) {
      items {
        id
        slug
        data
        contentType {
          id
          slug
          name
        }
      }
      pagination {
        total
        hasMore
      }
    }
  }
`;

export const GET_CONTENT_ENTRY = gql`
  query GetContentEntry($id: ID!) {
    contentEntry(id: $id) {
      id
      slug
      data
      contentType {
        id
        slug
      }
    }
  }
`;

export const GET_CONTENT_ENTRY_BY_SLUG = gql`
  query GetContentEntryBySlug(
    $contentTypeId: ID!
    $organizationId: ID!
    $slug: String!
    $propertyId: ID
  ) {
    contentEntryBySlug(
      contentTypeId: $contentTypeId
      organizationId: $organizationId
      slug: $slug
      propertyId: $propertyId
    ) {
      id
      slug
      data
      contentType {
        id
        slug
      }
    }
  }
`;

export const CREATE_CONTENT_ENTRY = gql`
  mutation CreateContentEntry($input: CreateContentEntryInput!) {
    createContentEntry(input: $input) {
      id
      slug
      data
    }
  }
`;

export const UPDATE_CONTENT_ENTRY = gql`
  mutation UpdateContentEntry($id: ID!, $input: UpdateContentEntryInput!) {
    updateContentEntry(id: $id, input: $input) {
      id
      slug
      data
    }
  }
`;

// ============================================================================
// Page Queries (for the frontend)
// ============================================================================

export const GET_PAGE_CONTENT = gql`
  query GetPageContent($contentTypeId: ID!, $organizationId: ID!, $slug: String!) {
    contentEntryBySlug(
      contentTypeId: $contentTypeId
      organizationId: $organizationId
      slug: $slug
    ) {
      id
      slug
      data
    }
  }
`;

export const GET_ALL_ENTRIES_BY_TYPE = gql`
  query GetAllEntriesByType($filter: ContentEntryFilterInput!) {
    contentEntries(filter: $filter) {
      items {
        id
        slug
        data
      }
    }
  }
`;
