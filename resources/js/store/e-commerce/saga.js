import axios from "axios";
import { toast } from "react-toastify";
import { call, put, takeEvery } from "redux-saga/effects";

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
} from "./actions";

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


function* fetchProducts() {
  try {
    const response = yield call(getProducts);
    yield put(getProductsSuccess(response));
  } catch (error) {
    yield put(getProductsFail(error));
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

function* fetchOrders() {
  try {
    const response = yield call(getOrders);
    yield put(getOrdersSuccess(response));
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

function* fetchCustomers({payload: keyword}) {
  try {
    const response = yield axios.get(`/api/customer/fetch/${keyword}`);
    if (response.data?.success) {
      yield put(getCustomersSuccess(response.data?.data?.data));
      toast.success("Customers Fetch Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(getCustomersFail(error));
    toast.error("Customers Eetch Failed", { autoClose: 2000 });
  }
}

function* onUpdateCustomer({payload: customer}) {
  try {
    const response = yield axios.put(`/api/customer/edit/${customer.id}`, customer);
    if (response.data?.success) {
      yield put(updateCustomerSuccess(response.data?.data));
      toast.success("Customer Update Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(updateCustomerFail(error));
    toast.error("Customer Update Failed", { autoClose: 2000 });
  }
}

function* onDeleteCustomer({ payload: id }) {
  try {
    const response = yield axios.delete(`/api/customer/delete/${id}`);
    if (response.data?.success){
      yield put(deleteCustomerSuccess(response.data?.data));
      toast.success("Customer Deleted Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(deleteCustomerFail(error));
    toast.error("Customer Delete Failed", { autoClose: 2000 });
  }
}

function* onAddNewCustomer(customer) {
  try {
    console.log("customer:", customer)
    const response = yield axios.post('/api/customer/create', customer.payload);
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

function* onAddNewSeller({payload: seller}) {
  try {
    const response = yield axios.post('/api/seller/create', seller);
    console.log("response", response)
    if (response.data?.success) {
      yield put(addNewSellerSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(addNewSellerFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* fetchSellers() {
  try {
    const response = yield axios.get('/api/seller/fetch');
    if (response.data?.success) {
      yield put(getSellersSuccess(response.data?.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(getSellersFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* onEditSeller({payload: seller}) {
  try {
    const response = yield axios.put(`/api/seller/edit/${seller.id}`, seller);
    if (response.data?.success) {
      yield put(editSellerSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(editSellerFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* onDeleteSeller({payload: id}) {
  try {
    const response = yield axios.delete(`/api/seller/delete/${id}`);
    if (response.data?.success) {
      yield put(deleteSellerSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(deleteSellerFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* onAddNewStore({payload: store}) {
  try {
    const response = yield axios.post('/api/store/create', store);
    if (response.data?.success) {
      yield put(addNewStoreSuccess(response.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(addNewStoreFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* fetchStores() {
  try {
    const response = yield axios.get('/api/store/fetch');
    if (response.data?.success) {
      yield put(getStoresSuccess(response.data?.data?.data));
      toast.success(response.data?.message, { autoClose: 1000 })
    }
  } catch (error) {
    yield put(getStoresFail(error));
    toast.error(error.data?.message, { autoClose: 1000 });
  }
}

function* onEditStore({payload: store}) {
  try {
    const response = yield axios.put(`/api/store/edit/${store.id}`, store);
    if (response.data?.success) {
      yield put(editStoreSuccess(response.data?.data));
      toast.success("Store Updated Successfully", { autoClose: 1000 })
    }
  } catch (error) {
    yield put(editStoreFail(error));
    toast.error("Store Update Failed", { autoClose: 1000 });
  }
}

function* onDeleteStore({payload: id}) {
  try {
    const response = yield axios.delete(`/api/store/delete/${id}`);
    if (response.data?.success) {
      yield put(deleteStoreSuccess(response.data?.data));
      toast.success("Store Deleted Successfully", { autoClose: 1000 })
    }
  } catch (error) {
    yield put(deleteStoreFail(error));
    toast.error("Store Delete Failed", { autoClose: 1000 });
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
  yield takeEvery(GET_SELLER_REQUEST, fetchSellers);
  yield takeEvery(EDIT_SELLER_REQUEST, onEditSeller);
  yield takeEvery(DELETE_SELLER_REQUEST, onDeleteSeller);
  yield takeEvery(ADD_STORE_REQUEST, onAddNewStore);
  yield takeEvery(GET_STORE_REQUEST, fetchStores);
  yield takeEvery(EDIT_STORE_REQUEST, onEditStore);
  yield takeEvery(DELETE_STORE_REQUEST, onDeleteStore);
}

export default ecommerceSaga;
