import { put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { apiError, logoutUserSuccess, setToken, setUser } from "./actions";

//Toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../apiWithToken";

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

    const response = yield axios.post('api/auth/login', user);

    if (!response.data.success) {
      throw new Error(response.data?.message)
    }

    yield toast.success("User Login Successfully", {
      position: "top-right",
      autoClose: 1500,
    });

    // set token value in state
    yield put(setToken(response.data?.token))
    yield put(setUser(response.data?.user))

    localStorage.setItem("token", JSON.stringify(response.data?.token));
    sessionStorage.setItem('email', JSON.stringify(response.data?.user?.email));
    sessionStorage.setItem('firstname', JSON.stringify(response.data?.user?.first_name));
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
    history('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
