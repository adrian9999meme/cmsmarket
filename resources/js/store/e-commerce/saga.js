import axios from "axios";
import { toast } from "react-toastify";
import { call, put, takeEvery } from "redux-saga/effects";

import api from '../api'
// Ecommerce Redux States
import {
  GET_CART_DATA,
  GET_CUSTOMERS,
  GET_ORDERS,
  GET_PRODUCT_DETAIL,
  GET_PRODUCTS,
  GET_SHOPS,
  ADD_NEW_ORDER,
  DELETE_ORDER,
  UPDATE_ORDER,
  ADD_NEW_CUSTOMER,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,
  GET_PRODUCT_COMMENTS,
  ON_LIKE_COMMENT,
  ON_LIKE_REPLY,
  ON_ADD_REPLY,
  ON_ADD_COMMENT,
  ADD_SELLER_REQUEST,
  ADD_SELLER_SUCCESS,
  ADD_SELLER_FAIL,
  GET_SELLER_REQUEST,
  GET_SELLER_SUCCESS,
  GET_SELLER_FAIL,
  GET_SELLER_LIST_REQUEST,
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
  GET_CATEGORIES,
  GET_CATEGORIES_REQUEST,
  SET_STORE_ACTIVE_REQUEST,
  SET_ACTIVE_CUSTOMER,
  SET_ACTIVE_SELLER_REQUEST,
  GET_BLOCKED_CUSTOMERS_SUCCESS,
  SET_CUSTOMER_APPROVED,
  SET_TRADE_APPROVED,
  SET_TRADE_REJECTED,
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  EDIT_PRODUCT_REQUEST,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
} from "./actionTypes";

import {
  getCartDataFail,
  getCartDataSuccess,
  getCustomersFail,
  getCustomersSuccess,
  getOrdersFail,
  getOrdersSuccess,
  getProductDetailFail,
  getProductDetailSuccess,
  getProductsFail,
  getProductsSuccess,
  addProductSuccess,
  addProductFail,
  editProductSuccess,
  editProductFail,
  deleteProductSuccess,
  deleteProductFail,
  getShopsFail,
  getShopsSuccess,
  addOrderFail,
  addOrderSuccess,
  updateOrderSuccess,
  updateOrderFail,
  deleteOrderSuccess,
  deleteOrderFail,
  addCustomerFail,
  addCustomerSuccess,
  updateCustomerSuccess,
  updateCustomerFail,
  deleteCustomerSuccess,
  deleteCustomerFail,
  getProductCommentsSuccess,
  getProductCommentsFail,
  onLikeCommentSuccess,
  onLikeCommentFail,
  onLikeReplySuccess,
  onLikeReplyFail,
  onAddReplySuccess,
  onAddReplyFail,
  onAddCommentSuccess,
  onAddCommentFail,
  addNewSellerRequest,
  addNewSellerSuccess,
  addNewSellerFail,
  getSellersRequest,
  getSellersSuccess,
  getSellersFail,
  editSellerRequest,
  editSellerSuccess,
  editSellerFail,
  deleteSellerRequest,
  deleteSellerSuccess,
  deleteSellerFail,
  addNewStoreRequest,
  addNewStoreSuccess,
  addNewStoreFail,
  getStoresRequest,
  getStoresSuccess,
  getStoresFail,
  editStoreRequest,
  editStoreSuccess,
  editStoreFail,
  deleteStoreRequest,
  deleteStoreSuccess,
  deleteStoreFail,
  getCategoriesSuccess,
  getCategoriesFail,
  getSellersListFail,
  getBlockedCustomersSuccess,
  getSellersListSuccess,
} from "./actions";

import { ADD_NEW_CUSTOMER_API, ADD_NEW_SELLER_API, ADD_NEW_STORE_API, ADD_PRODUCT_API, EDIT_PRODUCT_API, DELETE_PRODUCT_API, DELETE_CUSTOMER_API, DELETE_SELLER_API, EDIT_CUSTOMER_API, EDIT_SELLER_API, GET_CUSTOMERS_API, GET_SELLERS_API, GET_STORES_API, SET_ACTIVE_CUSTOMER_API, SET_ACTIVE_SELLER_API, SET_STORE_ACTIVE_API, EDIT_STORE_API, DELETE_STORE_API, HOME_STORE_CATEGORIES_API, GET_ORDERS_API, GET_PRODUCTS_API, SET_TRADE_APPROVED_API, SET_TRADE_REJECTED_API } from "../endpoints";

//Include Both Helper File with needed methods
// import {
//   getCartData,
//   getCustomers,
//   getOrders,
//   getProducts,
//   getShops,
//   getProductDetail,
//   addNewOrder,
//   updateOrder,
//   deleteOrder,
//   addNewCustomer,
//   updateCustomer,
//   deleteCustomer,
//   getProductComents as getProductComentsApi,
//   onLikeComment as onLikeCommentApi,
//   onLikeReply as onLikeReplyApi,
//   onAddReply as onAddReplyApi,
//   onAddComment as onAddCommentApi,
// } from "../../helpers/fakebackend_helper";


function* fetchProducts({ payload: query = {} }) {
  try {
    const response = yield api.get(GET_PRODUCTS_API, { params: query });
    if (response.data?.success) {
      yield put(getProductsSuccess(response.data?.data || []));
    } else {
      yield put(getProductsFail(response.data?.message || "Failed to fetch products"));
    }
  } catch (error) {
    yield put(getProductsFail(error?.response?.data?.message || error?.message || "Failed to fetch products"));
  }
}

function* fetchProductDetail({ productId }) {
  try {
    const response = yield call(getProductDetail, productId);
    yield put(getProductDetailSuccess(response));
  } catch (error) {
    yield put(getProductDetailFail(error));
  }
}

function* fetchOrders({ payload: query }) {
  try {
    const response = yield api.get(GET_ORDERS_API, { params: query });
    console.log("response", response.data)
    if (response.data?.success) {
      yield put(getOrdersSuccess(response.data?.data?.data));
    }
  } catch (error) {
    yield put(getOrdersFail(error));
  }
}

function* fetchCartData() {
  try {
    const response = yield call(getCartData);
    yield put(getCartDataSuccess(response));
  } catch (error) {
    yield put(getCartDataFail(error));
  }
}

function* fetchCustomers({ payload: query }) {
  try {
    const response = yield api.get(GET_CUSTOMERS_API, { params: query });
    if (response.data?.success) {
      toast.success("Customers Fetch Successfully", { autoClose: 2000 });
      yield put(getCustomersSuccess(response.data?.data));
    }
  } catch (error) {
    toast.error("Customers Eetch Failed", { autoClose: 2000 });
    yield put(getCustomersFail(error));
  }
}

function* onUpdateCustomer({ payload: customer }) {
  try {
    const response = yield api.put(`${EDIT_CUSTOMER_API}${customer.id}`, customer);
    if (response.data?.success) {
      yield put(updateCustomerSuccess(response.data?.data));
      toast.success("Customer Update Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(updateCustomerFail(error));
    toast.error("Customer Update Failed", { autoClose: 2000 });
  }
}

function* onSetActiveCustomer({ payload: customer }) {
  try {
    const response = yield api.put(`${SET_ACTIVE_CUSTOMER_API}${customer.id}`, customer);
    if (response.data?.success) {
      yield put(updateCustomerSuccess(response.data?.data));
      toast.success("Customer Update Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(updateCustomerFail(error));
    toast.error("Customer Update Failed", { autoClose: 2000 });
  }
}

function* onTradeApproved({ payload: customer }) {
  try {
    const response = yield api.put(`${SET_TRADE_APPROVED_API}${customer.id}`, customer);
    if (response.data?.success) {
      yield put(updateCustomerSuccess(response.data?.data));
      toast.success("Trade Approved Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(updateCustomerFail(error));
    toast.error("Trade Approved Failed", { autoClose: 2000 });
  }
}

function* onTradeRejected({ payload: customer }) {
  try {
    const response = yield api.put(`${SET_TRADE_REJECTED_API}${customer.id}`, customer);
    if (response.data?.success) {
      yield put(updateCustomerSuccess(response.data?.data));
      toast.success("Trade Rejected Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(updateCustomerFail(error));
    toast.error("Trade Rejected Failed", { autoClose: 2000 });
  }
}

function* onDeleteCustomer({ payload: id }) {
  try {
    const response = yield api.delete(`${DELETE_CUSTOMER_API}${id}`);
    if (response.data?.success) {
      yield put(deleteCustomerSuccess(response.data?.data));
      toast.success("Customer Deleted Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(deleteCustomerFail(error));
    toast.error("Customer Delete Failed", { autoClose: 2000 });
  }
}

function* onAddNewCustomer({ payload: customer }) {
  try {
    console.log("customer:", customer)
    const response = yield api.post(ADD_NEW_CUSTOMER_API, customer);
    if (response.data?.data) {
      yield put(addCustomerSuccess(response.data?.data));
      toast.success("Customer Added Successfully", { autoClose: 1000 });
    }
  } catch (error) {
    yield put(addCustomerFail(error));
    toast.error("Customer Added Failed", { autoClose: 1000 });
  }
}

function* fetchShops() {
  try {
    const response = yield call(getShops);
    yield put(getShopsSuccess(response));
  } catch (error) {
    yield put(getShopsFail(error));
  }
}

function* onUpdateOrder({ payload: order }) {
  try {
    const response = yield call(updateOrder, order);
    yield put(updateOrderSuccess(response));
    toast.success("Order Update Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateOrderFail(error));
    toast.error("Order Update Failed", { autoClose: 2000 });
  }
}

function* onDeleteOrder({ payload: order }) {
  try {
    const response = yield call(deleteOrder, order);
    yield put(deleteOrderSuccess(response));
    toast.success("Order Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteOrderFail(error));
    toast.error("Order Delete Failed", { autoClose: 2000 });
  }
}

function* onAddNewOrder({ payload: order }) {
  try {
    const response = yield call(addNewOrder, order);
    yield put(addOrderSuccess(response));
    toast.success("Order Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addOrderFail(error));
    toast.error("Order Added Failed", { autoClose: 2000 });
  }
}

function* getProductComents() {
  try {
    // todo - add product Id to the payload and api
    const response = yield call(getProductComentsApi);
    yield put(getProductCommentsSuccess(response));
  } catch (error) {
    yield put(getProductCommentsFail(error));
  }
}

function* onLikeComment({ payload: { commentId, productId } }) {
  try {
    // todo - add product Id to the payload and api
    const response = yield call(onLikeCommentApi, commentId, productId);
    yield put(onLikeCommentSuccess(response));
  } catch (error) {
    yield put(onLikeCommentFail(error));
  }
}

function* onLikeReply({ payload: { commentId, productId, replyId } }) {
  try {
    // todo - add product Id to the payload and api
    const response = yield call(onLikeReplyApi, commentId, productId, replyId);
    yield put(onLikeReplySuccess(response));
  } catch (error) {
    yield put(onLikeReplyFail(error));
  }
}

function* onAddReply({ payload: { commentId, productId, replyText } }) {
  try {
    const response = yield call(onAddReplyApi, commentId, productId, replyText);
    yield put(onAddReplySuccess(response));
  } catch (error) {
    yield put(onAddReplyFail(error));
  }
}

function* onAddComment({ payload: { productId, commentText } }) {
  try {
    const response = yield call(onAddCommentApi, productId, commentText);
    yield put(onAddCommentSuccess(response));
  } catch (error) {
    yield put(onAddCommentFail(error));
  }
}

function* onAddNewSeller({ payload: seller }) {
  try {
    const response = yield api.post(ADD_NEW_SELLER_API, seller);
    if (response.data?.success) {
      yield put(addNewSellerSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(addNewSellerFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* fetchSellers({ payload: { subdomain, searchKeyword } }) {
  try {
    const response = yield api.get(`${GET_SELLERS_API}?subdomain=${subdomain}&keyword=${searchKeyword}`);
    if (response.data?.success) {
      yield put(getSellersSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(getSellersFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* fetchCategories() {
  try {
    const response = yield api.get(`${HOME_STORE_CATEGORIES_API}`);
    if (response.data?.categories) {
      yield put(getCategoriesSuccess(response.data.categories));
      toast.success("Categories fetched", { autoClose: 1000 });
    }
  } catch (error) {
    yield put(getCategoriesFail(error));
    toast.error("Failed to load categories", { autoClose: 1000 });
  }
}

function* fetchSellersList() {
  try {
    const response = yield api.get(GET_SELLERS_API);
    // API returns paginated data under response.data.data (and items under .data)
    const sellers = response?.data?.data?.data ?? response?.data?.data ?? [];
    if (Array.isArray(sellers) && sellers.length >= 0) {
      yield put(getSellersListSuccess(sellers));
      toast.success("Sellers list fetched", { autoClose: 1000 });
    }
  } catch (error) {
    yield put(getSellersListFail(error));
    toast.error("Failed to load sellers list", { autoClose: 1000 });
  }
}

function* onEditSeller({ payload: seller }) {
  try {
    const response = yield api.put(`${EDIT_SELLER_API}${seller.id}`, seller);
    if (response.data?.success) {
      yield put(editSellerSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(editSellerFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* onSetActiveSeller({ payload: seller }) {
  try {
    // Assuming SET_ACTIVE_SELLER_API expects PATCH or PUT
    const response = yield api.put(`${SET_ACTIVE_SELLER_API}${seller.id}`, seller);
    if (response.data?.success) {
      yield put(editSellerSuccess(response.data?.data));
      toast.success(response.data?.message || "Seller status updated successfully", { autoClose: 1000 });
    }
  } catch (error) {
    yield put(editSellerFail(error));
    toast.error(error.data?.message || "Failed to update seller status", { autoClose: 1000 });
  }
}


function* onDeleteSeller({ payload: id }) {
  try {
    const response = yield api.delete(`${DELETE_SELLER_API}${id}`);
    if (response.data?.success) {
      yield put(deleteSellerSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(deleteSellerFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* onAddNewStore({ payload: store }) {
  try {
    // if store is FormData, axios should use multipart/form-data header
    let response;
    if (store instanceof FormData) {
      // remove default json header for this request so axios can set boundary
      response = yield api.post(ADD_NEW_STORE_API, store, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      response = yield api.post(ADD_NEW_STORE_API, store);
    }

    if (response.data?.success) {
      yield put(addNewStoreSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 });
    }
  } catch (error) {
    yield put(addNewStoreFail(error));
    const resp = error.response || {};
    // if Laravel validation failed, resp.data.errors contains field messages
    if (resp.status === 422 && resp.data && resp.data.errors) {
      Object.values(resp.data.errors).flat().forEach((msg) => {
        toast.error(msg, { autoClose: 3000 });
      });
    } else {
      toast.error(resp.data?.message || "Store creation failed", { autoClose: 1000 });
    }
    console.error("Add store error", resp);
  }
}

function* fetchStores({ payload: { subdomain, searchKeyword } }) {
  try {
    const response = yield api.get(`${GET_STORES_API}?subdomain=${subdomain}&keyword=${searchKeyword}`);
    if (response.data?.success) {
      yield put(getStoresSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(getStoresFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* onEditStore({ payload: store }) {
  try {
    const response = yield api.put(`${EDIT_STORE_API}${store.id}`, store);
    if (response.data?.success) {
      yield put(editStoreSuccess(response.data?.data));
      toast.success("Store Updated Successfully", { autoClose: 1000 })
    }
  } catch (error) {
    yield put(editStoreFail(error));
    toast.error("Store Update Failed", { autoClose: 1000 });
  }
}

function* onDeleteStore({ payload: id }) {
  try {
    const response = yield api.delete(`${DELETE_STORE_API}${id}`);
    if (response.data?.success) {
      yield put(deleteStoreSuccess(response.data?.data));
      toast.success("Store Deleted Successfully", { autoClose: 1000 })
    }
  } catch (error) {
    yield put(deleteStoreFail(error));
    toast.error("Store Delete Failed", { autoClose: 1000 });
  }
}

function* onSetActiveStore({ payload: store }) {
  try {
    const response = yield api.put(`${SET_STORE_ACTIVE_API}${store.store_profile.id}`, store);
    if (response.data?.success) {
      const stores = response.data?.data?.data ?? response.data?.data ?? [];
      yield put(editStoreSuccess(stores));
      toast.success(response.data?.message || "Store status updated successfully", { autoClose: 1000 });
    }
  } catch (error) {
    yield put(getStoresFail(error));
    toast.error(error?.response?.data?.message || "Failed to update store status", { autoClose: 1000 });
  }
}

function* onAddProduct({ payload: product }) {
  try {
    const { refetchQuery, ...productData } = product || {};
    const response = yield api.post(ADD_PRODUCT_API, productData);
    if (response.data?.success) {
      yield put(addProductSuccess());
      yield put(getProducts(refetchQuery || {}));
      toast.success(response.data?.message || "Product created successfully", { autoClose: 2000 });
    } else {
      yield put(addProductFail(response.data?.message || "Failed"));
      toast.error(response.data?.message || "Product create failed", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(addProductFail(error?.response?.data?.message || error?.message));
    toast.error(error?.response?.data?.message || "Product create failed", { autoClose: 2000 });
  }
}

function* onEditProduct({ payload: { id, product } }) {
  try {
    const { refetchQuery, ...productData } = product || {};
    const response = yield api.put(`${EDIT_PRODUCT_API}${id}`, productData);
    if (response.data?.success) {
      yield put(editProductSuccess());
      yield put(getProducts(refetchQuery || {}));
      toast.success(response.data?.message || "Product updated successfully", { autoClose: 2000 });
    } else {
      yield put(editProductFail(response.data?.message || "Failed"));
      toast.error(response.data?.message || "Product update failed", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(editProductFail(error?.response?.data?.message || error?.message));
    toast.error(error?.response?.data?.message || "Product update failed", { autoClose: 2000 });
  }
}

function* onDeleteProduct({ payload }) {
  try {
    const id = typeof payload === 'object' ? payload.id : payload;
    const refetchQuery = typeof payload === 'object' ? (payload.refetchQuery || {}) : {};
    const response = yield api.delete(`${DELETE_PRODUCT_API}${id}`);
    if (response.data?.success) {
      yield put(deleteProductSuccess());
      yield put(getProducts(refetchQuery || {}));
      toast.success(response.data?.message || "Product deleted successfully", { autoClose: 2000 });
    } else {
      yield put(deleteProductFail(response.data?.message || "Failed"));
      toast.error(response.data?.message || "Product delete failed", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(deleteProductFail(error?.response?.data?.message || error?.message));
    toast.error(error?.response?.data?.message || "Product delete failed", { autoClose: 2000 });
  }
}

function* ecommerceSaga() {
  yield takeEvery(GET_PRODUCTS, fetchProducts);
  yield takeEvery(GET_PRODUCT_DETAIL, fetchProductDetail);
  yield takeEvery(GET_ORDERS, fetchOrders);
  yield takeEvery(GET_CART_DATA, fetchCartData);
  yield takeEvery(GET_CUSTOMERS, fetchCustomers);
  yield takeEvery(ADD_NEW_CUSTOMER, onAddNewCustomer);
  yield takeEvery(UPDATE_CUSTOMER, onUpdateCustomer);
  yield takeEvery(DELETE_CUSTOMER, onDeleteCustomer);
  yield takeEvery(SET_ACTIVE_CUSTOMER, onSetActiveCustomer);
  yield takeEvery(SET_TRADE_APPROVED, onTradeApproved);
  yield takeEvery(SET_TRADE_REJECTED, onTradeRejected);
  yield takeEvery(GET_SHOPS, fetchShops);
  yield takeEvery(ADD_NEW_ORDER, onAddNewOrder);
  yield takeEvery(UPDATE_ORDER, onUpdateOrder);
  yield takeEvery(DELETE_ORDER, onDeleteOrder);
  yield takeEvery(GET_PRODUCT_COMMENTS, getProductComents);
  yield takeEvery(ON_LIKE_COMMENT, onLikeComment);
  yield takeEvery(ON_LIKE_REPLY, onLikeReply);
  yield takeEvery(ON_ADD_REPLY, onAddReply);
  yield takeEvery(ON_ADD_COMMENT, onAddComment);
  yield takeEvery(ADD_SELLER_REQUEST, onAddNewSeller);
  yield takeEvery(GET_SELLER_LIST_REQUEST, fetchSellersList);
  yield takeEvery(GET_SELLER_REQUEST, fetchSellers);
  yield takeEvery(EDIT_SELLER_REQUEST, onEditSeller);
  yield takeEvery(SET_ACTIVE_SELLER_REQUEST, onSetActiveSeller);
  yield takeEvery(DELETE_SELLER_REQUEST, onDeleteSeller);
  yield takeEvery(ADD_STORE_REQUEST, onAddNewStore);
  yield takeEvery(GET_STORE_REQUEST, fetchStores);
  yield takeEvery(EDIT_STORE_REQUEST, onEditStore);
  yield takeEvery(SET_STORE_ACTIVE_REQUEST, onSetActiveStore);
  yield takeEvery(DELETE_STORE_REQUEST, onDeleteStore);
  yield takeEvery(GET_CATEGORIES_REQUEST, fetchCategories);
  yield takeEvery(ADD_PRODUCT_REQUEST, onAddProduct);
  yield takeEvery(EDIT_PRODUCT_REQUEST, onEditProduct);
  yield takeEvery(DELETE_PRODUCT_REQUEST, onDeleteProduct);
}

export default ecommerceSaga;
