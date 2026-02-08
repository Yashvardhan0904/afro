import { gql } from '@apollo/client';

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts($skip: Int, $take: Int, $filters: ProductFiltersInput) {
    products(skip: $skip, take: $take, filters: $filters) {
      products {
        id
        title
        slug
        description
        price
        mrp
        stock
        images
        thumbnail
        category {
          id
          name
          slug
        }
        isActive
        isFeatured
        likeCount
        reviewCount
        averageRating
        isLikedByMe
        createdAt
      }
      total
    }
  }
`;

export const GET_PRODUCT_BY_ID_QUERY = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      title
      slug
      description
      price
      mrp
      stock
      lowStockThreshold
      images
      thumbnail
      category {
        id
        name
        slug
      }
      metaTitle
      metaDescription
      isActive
      isFeatured
      likeCount
      reviewCount
      averageRating
      isLikedByMe
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_SLUG_QUERY = gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      title
      slug
      description
      price
      mrp
      stock
      lowStockThreshold
      images
      thumbnail
      category {
        id
        name
        slug
      }
      metaTitle
      metaDescription
      isActive
      isFeatured
      likeCount
      reviewCount
      averageRating
      isLikedByMe
      createdAt
      updatedAt
    }
  }
`;

export const GET_FEATURED_PRODUCTS_QUERY = gql`
  query GetFeaturedProducts($take: Int) {
    featuredProducts(take: $take) {
      id
      title
      slug
      description
      price
      mrp
      stock
      images
      thumbnail
      category {
        id
        name
        slug
      }
      isActive
      isFeatured
      likeCount
      reviewCount
      averageRating
      isLikedByMe
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      title
      slug
      description
      price
      mrp
      stock
      categoryId
      images
      thumbnail
      isActive
      isFeatured
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      title
      slug
      description
      price
      mrp
      stock
      categoryId
      images
      thumbnail
      isActive
      isFeatured
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
      title
    }
  }
`;

export const LIKE_PRODUCT_MUTATION = gql`
  mutation LikeProduct($productId: ID!) {
    likeProduct(productId: $productId)
  }
`;

export const UNLIKE_PRODUCT_MUTATION = gql`
  mutation UnlikeProduct($productId: ID!) {
    unlikeProduct(productId: $productId)
  }
`;
