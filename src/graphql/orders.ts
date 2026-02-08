import { gql } from '@apollo/client';

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
      userId
      status
      subtotal
      tax
      shippingCharge
      discount
      totalAmount
      shippingName
      shippingPhone
      shippingLine1
      shippingLine2
      shippingCity
      shippingState
      shippingPincode
      shippingCountry
      notes
      createdAt
      items {
        id
        productId
        productTitle
        productImage
        pricePerUnit
        quantity
        totalPrice
      }
    }
  }
`;

export const GET_MY_ORDERS_QUERY = gql`
  query GetMyOrders($skip: Int, $take: Int, $status: OrderStatus) {
    myOrders(skip: $skip, take: $take, status: $status) {
      orders {
        id
        orderNumber
        status
        totalAmount
        createdAt
        items {
          id
          productTitle
          quantity
          pricePerUnit
          totalPrice
        }
      }
      total
    }
  }
`;

export const GET_ORDER_BY_ID_QUERY = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      userId
      status
      subtotal
      tax
      shippingCharge
      discount
      totalAmount
      shippingName
      shippingPhone
      shippingLine1
      shippingLine2
      shippingCity
      shippingState
      shippingPincode
      shippingCountry
      notes
      cancelReason
      createdAt
      updatedAt
      items {
        id
        productId
        productTitle
        productImage
        pricePerUnit
        quantity
        totalPrice
      }
      trackingEvents {
        id
        status
        note
        createdAt
      }
    }
  }
`;

export const CANCEL_ORDER_MUTATION = gql`
  mutation CancelOrder($id: ID!, $reason: String) {
    cancelOrder(id: $id, reason: $reason) {
      id
      status
      cancelReason
    }
  }
`;

export const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($id: ID!, $input: UpdateOrderStatusInput!) {
    updateOrderStatus(id: $id, input: $input) {
      id
      status
    }
  }
`;

export const GET_ALL_ORDERS_QUERY = gql`
  query GetAllOrders($skip: Int, $take: Int, $status: OrderStatus) {
    allOrders(skip: $skip, take: $take, status: $status) {
      orders {
        id
        orderNumber
        status
        totalAmount
        subtotal
        tax
        shippingCharge
        shippingName
        shippingPhone
        shippingLine1
        shippingLine2
        shippingCity
        shippingState
        shippingPincode
        shippingCountry
        notes
        createdAt
        user {
          id
          name
          email
        }
        items {
          id
          productTitle
          productImage
          quantity
          pricePerUnit
          totalPrice
        }
      }
      total
    }
  }
`;
