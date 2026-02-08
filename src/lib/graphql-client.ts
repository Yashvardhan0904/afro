// Simple GraphQL client using fetch - NO APOLLO CLIENT!

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_URL || 'https://brofr-production.up.railway.app/graphql';

// Helper to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Simple GraphQL query function
export async function graphqlRequest(query: string, variables?: any) {
  const token = getAuthToken();

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

// Auth functions
export async function login(email: string, password: string) {
  const query = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        token
        user {
          id
          email
          name
          role
        }
      }
    }
  `;

  const data = await graphqlRequest(query, {
    input: { email, password }
  });

  setAuthToken(data.login.token);
  return data.login;
}

export async function register(email: string, password: string, name: string) {
  const query = `
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        token
        user {
          id
          email
          name
          role
        }
      }
    }
  `;

  const data = await graphqlRequest(query, {
    input: { email, password, name }
  });

  setAuthToken(data.register.token);
  return data.register;
}

export async function logout() {
  removeAuthToken();
}

// Product functions
export async function getProducts(take = 10, skip = 0) {
  const query = `
    query GetProducts($skip: Int, $take: Int) {
      products(skip: $skip, take: $take) {
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
        }
        total
      }
    }
  `;

  const data = await graphqlRequest(query, { skip, take });
  return data.products;
}

export async function getProductById(id: string) {
  const query = `
    query GetProduct($id: ID!) {
      product(id: $id) {
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
      }
    }
  `;

  const data = await graphqlRequest(query, { id });
  return data.product;
}

export async function createProduct(input: any) {
  const query = `
    mutation CreateProduct($input: CreateProductInput!) {
      createProduct(input: $input) {
        id
        title
        slug
        price
        stock
      }
    }
  `;

  const data = await graphqlRequest(query, { input });
  return data.createProduct;
}

// Order functions
export async function createOrder(input: any) {
  const query = `
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        id
        orderNumber
        totalAmount
        status
        items {
          productTitle
          quantity
          pricePerUnit
          totalPrice
        }
      }
    }
  `;

  const data = await graphqlRequest(query, { input });
  return data.createOrder;
}

export async function getMyOrders() {
  const query = `
    query GetMyOrders {
      myOrders(take: 50) {
        orders {
          id
          orderNumber
          status
          totalAmount
          createdAt
          items {
            productTitle
            quantity
            pricePerUnit
          }
        }
        total
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.myOrders;
}

// Category functions
export async function getCategories() {
  const query = `
    query GetCategories {
      categories {
        id
        name
        slug
        description
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.categories;
}
