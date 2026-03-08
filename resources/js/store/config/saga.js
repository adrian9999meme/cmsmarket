import { put, takeEvery } from "redux-saga/effects";
import api from "../api";
import { GET_CONFIG_API } from "../endpoints";
import { FETCH_CONFIG } from "./actionTypes";
import { fetchConfigSuccess, fetchConfigError } from "./actions";

function* fetchConfigSaga() {
  try {
    const response = yield api.get(GET_CONFIG_API);
    if (response.data?.success && response.data?.data?.app_config) {
      yield put(fetchConfigSuccess(response.data.data.app_config));
    } else {
      yield put(fetchConfigSuccess({}));
    }
  } catch (error) {
    yield put(fetchConfigError(error?.message || "Failed to fetch config"));
    yield put(fetchConfigSuccess({}));
  }
}

export default function* configSaga() {
  yield takeEvery(FETCH_CONFIG, fetchConfigSaga);
}
