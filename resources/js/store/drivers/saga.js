import { toast } from "react-toastify";
import { put, takeEvery } from "redux-saga/effects";
import api from "../api";

import {
    ADD_DRIVER_REQUEST,
    ADD_DRIVER_SUCCESS,
    ADD_DRIVER_FAIL,
    GET_DRIVERS_REQUEST,
    GET_DRIVERS_SUCCESS,
    GET_DRIVERS_FAIL,
    EDIT_DRIVER_REQUEST,
    EDIT_DRIVER_SUCCESS,
    EDIT_DRIVER_FAIL,
    DELETE_DRIVER_REQUEST,
    DELETE_DRIVER_SUCCESS,
    DELETE_DRIVER_FAIL,
} from "./actionTypes";

// Drivers endpoints (adjust paths to your backend)
import {
    GET_DRIVERS_API,
    ADD_NEW_DRIVER_API,
    EDIT_DRIVER_API,   // usually like "/drivers/"
    DELETE_DRIVER_API, // usually like "/drivers/"
} from "../endpoints";

// -------------------------
// GET DRIVERS
// payload example: { keyword: "", pickupHub: "all", page: 1 }
// -------------------------
function* fetchDrivers({ payload: query }) {
    try {
        const response = yield api.get(GET_DRIVERS_API, { params: query });

        if (response.data?.success) {
            // adapt to your API shape:
            // common shapes:
            // response.data.data.data   (laravel pagination)
            // response.data.data       (plain)
            const list = response.data?.data?.data ?? response.data?.data ?? [];
            yield put({ type: GET_DRIVERS_SUCCESS, payload: list });
        } else {
            yield put({ type: GET_DRIVERS_FAIL, payload: response.data });
        }
    } catch (error) {
        yield put({ type: GET_DRIVERS_FAIL, payload: error });
    }
}

// -------------------------
// ADD DRIVER
// payload example: { name, email, phone, salary, pickupHub, active }
// -------------------------
function* onAddNewDriver({ payload: driver }) {
    try {
        const response = yield api.post(ADD_NEW_DRIVER_API, driver);

        if (response.data?.success || response.data?.data) {
            const created = response.data?.data ?? response.data;
            yield put({ type: ADD_DRIVER_SUCCESS, payload: created });
            toast.success("Driver added successfully", { autoClose: 1000 });
        } else {
            yield put({ type: ADD_DRIVER_FAIL, payload: response.data });
            toast.error("Driver add failed", { autoClose: 1000 });
        }
    } catch (error) {
        yield put({ type: ADD_DRIVER_FAIL, payload: error });
        toast.error("Driver add failed", { autoClose: 1000 });
    }
}

// -------------------------
// EDIT DRIVER
// payload example: { id, name, email, ... }
// -------------------------
function* onUpdateDriver({ payload: driver }) {
    try {
        const response = yield api.put(`${EDIT_DRIVER_API}${driver.id}`, driver);

        if (response.data?.success) {
            const updated = response.data?.data ?? driver;
            yield put({ type: EDIT_DRIVER_SUCCESS, payload: updated });
            toast.success("Driver updated successfully", { autoClose: 2000 });
        } else {
            yield put({ type: EDIT_DRIVER_FAIL, payload: response.data });
            toast.error("Driver update failed", { autoClose: 2000 });
        }
    } catch (error) {
        yield put({ type: EDIT_DRIVER_FAIL, payload: error });
        toast.error("Driver update failed", { autoClose: 2000 });
    }
}

// -------------------------
// DELETE DRIVER
// payload example: driverId
// -------------------------
function* onDeleteDriver({ payload: id }) {
    try {
        const response = yield api.delete(`${DELETE_DRIVER_API}${id}`);

        if (response.data?.success) {
            yield put({ type: DELETE_DRIVER_SUCCESS, payload: id });
            toast.success("Driver deleted successfully", { autoClose: 2000 });
        } else {
            yield put({ type: DELETE_DRIVER_FAIL, payload: response.data });
            toast.error("Driver delete failed", { autoClose: 2000 });
        }
    } catch (error) {
        yield put({ type: DELETE_DRIVER_FAIL, payload: error });
        toast.error("Driver delete failed", { autoClose: 2000 });
    }
}

// -------------------------
// WATCHERS
// -------------------------
export default function* driverSaga() {
    yield takeEvery(GET_DRIVERS_REQUEST, fetchDrivers);
    yield takeEvery(ADD_DRIVER_REQUEST, onAddNewDriver);
    yield takeEvery(EDIT_DRIVER_REQUEST, onUpdateDriver);
    yield takeEvery(DELETE_DRIVER_REQUEST, onDeleteDriver);
}