import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"

//Toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user, history } }) {
  try {
    // request signup
    const response = yield axios.post('api/auth/register', user);
    const data = response?.data;
    const status = response?.status;
    // if registration is succeed
    if (data.success === true && status === 201) {
      const logged_user = {
        login: true,
        user_id: data.data?.id,
        name: data.data?.name,
        email: data.data?.email,
      };
      yield put(registerUserSuccessful(logged_user))  
      history('/login');
    }
    // toast message for request
    toast.success(data.message || "Registration succeed", {
      position: "top-right",
      autoClose: 3000,
      onClose: resolve, // Resolve the Promise when the toast is closed
    });
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed", {
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
