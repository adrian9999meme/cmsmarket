import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";
//Toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../../api";
// Login Redux States
import { GET_CURRENT_USER, LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { apiError, logoutUserSuccess, setToken, setUser } from "./actions";
import { GET_CURRENT_USER_API, LOGIN_API } from "../../endpoints";

// NOTE:
// For MVP we do NOT call any backend or database.
// Login is done purely on the frontend with a fixed demo account.
// Valid credentials (same as shown on the login page helper):
//   Email:    admin@themesbrand.com
//   Password: 12345678

function* loginUser({ payload: { user, history } }) {
  try {
    // validate user prompts
    if (!user || typeof user !== "object") {
      throw new Error("User data must be provided.");
    }
    if (!user.email || typeof user.email !== "string" || user.email.trim() === "") {
      throw new Error("Email is required.");
    }
    if (!user.password || typeof user.password !== "string" || user.password.trim() === "") {
      throw new Error("Password is required.");
    }

    const response = yield api.post(LOGIN_API, user);

    if (!response.data.success) {
      throw new Error(response.data?.message)
    }

    toast.success("User Login Successfully", {
      position: "top-right",
      autoClose: 1500,
    });
    const authorized_user = response.data?.data
    // set token value in state
    yield put(setToken(authorized_user.token))
    // set user
    yield put(setUser(authorized_user))

    // navigate to dashboard
    history('/dashboard');
  } catch (error) {
    toast.error(error.response?.data?.message || "Invalid email or password for login.", {
      position: "top-right",
      autoClose: 3000,
    });
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    yield logoutUserSuccess();
    localStorage.removeItem('token')
    axios.defaults.headers.common['Authorization'] = '';
    history('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* getCurrentUser({ payload: token }) {
  try {
    const response = yield api.get(GET_CURRENT_USER_API, { token: token })
    if (!response.data.success) {
      throw new Error(response.data?.message)
    }
    
    const authorized_user = response.data?.data
    // set token value in state
    yield put(setToken(authorized_user.token))
    // set user
    yield put(setUser(authorized_user))
  } catch (error) {
    yield put(apiError(error));
    yield toast.error(error.response?.data?.message || "Invalid Authorization. Login again", {
      position: "top-right",
      autoClose: 3000,
    });
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
  yield takeEvery(GET_CURRENT_USER, getCurrentUser);
}

export default authSaga;
