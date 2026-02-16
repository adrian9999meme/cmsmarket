import {
  GET_CART_DATA_FAIL,
  GET_CART_DATA_SUCCESS,
  GET_CUSTOMERS_FAIL,
  GET_CUSTOMERS_SUCCESS,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAIL,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAIL,
  GET_ORDERS_FAIL,
  GET_ORDERS_SUCCESS,
  GET_PRODUCTS_FAIL,
  GET_PRODUCTS_SUCCESS,
  GET_SHOPS_FAIL,
  GET_SHOPS_SUCCESS,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_DETAIL_FAIL,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  GET_PRODUCT_COMMENTS_SUCCESS,
  GET_PRODUCT_COMMENTS_FAIL,
  ON_LIKE_COMMENT_SUCCESS,
  ON_LIKE_REPLY_SUCCESS,
  ON_ADD_REPLY_SUCCESS,
  ON_ADD_COMMENT_SUCCESS,
  ADD_SELLER_REQUEST,
  ADD_SELLER_SUCCESS,
  ADD_SELLER_FAIL,
  GET_SELLER_REQUEST,
  GET_SELLER_SUCCESS,
  GET_SELLER_FAIL,
  EDIT_SELLER_REQUEST,
  EDIT_SELLER_SUCCESS,
  EDIT_SELLER_FAIL,
  DELETE_SELLER_REQUEST,
  DELETE_SELLER_SUCCESS,
  DELETE_SELLER_FAIL,
  ADD_STORE_REQUEST,
  ADD_STORE_SUCCESS,
  ADD_STORE_FAIL,
  GET_STORE_REQUEST,
  GET_STORE_SUCCESS,
  GET_STORE_FAIL,
  EDIT_STORE_REQUEST,
  EDIT_STORE_SUCCESS,
  EDIT_STORE_FAIL,
  DELETE_STORE_REQUEST,
  DELETE_STORE_SUCCESS,
  DELETE_STORE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  products: [],
  product: {},
  orders: [],
  cartData: {},
  customers: [],
  shops: [],
  productComments: [],
  sellers: [],
  stores: [],
  error: null
};

const Ecommerce = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
      };

    case GET_PRODUCTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        product: action.payload,
      };

    case GET_PRODUCT_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
      };

    case GET_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ORDER_SUCCESS:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };

    case ADD_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map(order =>
          (order.id + '') === (action.payload.id + '')
            ? { order, ...action.payload }
            : order
        ),
      };

    case UPDATE_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.filter(
          order => order.id !== action.payload
        ),
      };

    case DELETE_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CART_DATA_SUCCESS:
      return {
        ...state,
        cartData: action.payload,
      };

    case GET_CART_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CUSTOMERS_SUCCESS:
      return {
        ...state,
        customers: action.payload,
      };

    case GET_CUSTOMERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CUSTOMER_SUCCESS:
      return {
        ...state,
        customers: [action.payload, ...state.customers],
      };

    case ADD_CUSTOMER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id.toString() === action.payload.id.toString()
            ? { customer, ...action.payload }
            : customer
        ),
      };

    case UPDATE_CUSTOMER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customers: state.customers.filter(
          customer => customer.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_CUSTOMER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SHOPS_SUCCESS:
      return {
        ...state,
        shops: action.payload,
      };

    case GET_SHOPS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PRODUCT_COMMENTS_SUCCESS:
    case ON_LIKE_COMMENT_SUCCESS:
    case ON_LIKE_REPLY_SUCCESS:
    case ON_ADD_REPLY_SUCCESS:
    case ON_ADD_COMMENT_SUCCESS:
      return {
        ...state,
        productComments: action.payload,
      };

    case GET_PRODUCT_COMMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map(order =>
          (order.id + '') === (action.payload.id + '')
            ? { order, ...action.payload }
            : order
        ),
      };

    case ADD_SELLER_SUCCESS:
      return {
        ...state,
        sellers: [action.payload, ...state.sellers],
      };

    case GET_SELLER_SUCCESS:
      return {
        ...state,
        sellers: action.payload,
      };

    case EDIT_SELLER_SUCCESS:
      return {
        ...state,
        sellers: state.sellers.map(seller =>
          seller.id.toString() === action.payload.id.toString()
            ? { seller, ...action.payload }
            : seller
        ),
      };

    case DELETE_SELLER_SUCCESS:
      return {
        ...state,
        sellers: state.sellers.filter(
          seller => seller.id !== action.payload.id
        ),
      };

    case ADD_SELLER_FAIL:
    case GET_SELLER_FAIL:
    case EDIT_SELLER_FAIL:
    case DELETE_SELLER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_STORE_SUCCESS:
      return {
        ...state,
        stores: [action.payload, ...state.stores],
      };

    case GET_STORE_SUCCESS:
      return {
        ...state,
        stores: action.payload,
      };

    case EDIT_STORE_SUCCESS:
      return {
        ...state,
        stores: state.stores.map(store =>
          store.id.toString() === action.payload.id.toString()
            ? { store, ...action.payload }
            : store
        ),
      };

    case DELETE_STORE_SUCCESS:
      return {
        ...state,
        stores: state.stores.filter(
          store => store.id !== action.payload.id
        ),
      };

    case ADD_STORE_FAIL:
    case GET_STORE_FAIL:
    case EDIT_STORE_FAIL:
    case DELETE_STORE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default Ecommerce;
