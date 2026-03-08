import { takeEvery, fork, put, all } from "redux-saga/effects";

//Account Redux states
import { REGISTER_USER } from "./actionTypes";
import { registerUserSuccessful, registerUserFailed } from "./actions";

//Toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../../api";
import { REGISTER_API } from "../../endpoints";

function* registerUser({ payload: { user, history } }) {
  try {
    const payload = {
      ...user,
      registration_type: user.registration_type || "customer",
    };
    const response = yield api.post(REGISTER_API, payload);
    const data = response?.data;
    const status = response?.status;

    if (data.success === true && (status === 200 || status === 201)) {
      const logged_user = {
        login: true,
        user_id: data.data?.id,
        name: data.data?.name || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: data.data?.email || user.email,
      };
      yield put(registerUserSuccessful(logged_user));
      if (history) history("/login");
    }

    toast.success(data.message || "Registration successful", {
      position: "top-right",
      autoClose: 3000,
    });
  } catch (error) {
    const msg = error.response?.data?.message || error.response?.data?.error || "Registration failed";
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
    });
    yield put(registerUserFailed(error));
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
