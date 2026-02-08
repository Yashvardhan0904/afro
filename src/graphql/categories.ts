import { gql } from '@apollo/client';

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      parentId
      createdAt
    }
  }
`;

export const GET_CATEGORY_BY_ID_QUERY = gql`
  query GetCategoryById($id: ID!) {
    category(id: $id) {
      id
      name
      slug
      description
      parentId
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORY_BY_SLUG_QUERY = gql`
  query GetCategoryBySlug($slug: String!) {
    categoryBySlug(slug: $slug) {
      id
      name
      slug
      description
      parentId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
      description
      parentId
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
      description
      parentId
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`;
