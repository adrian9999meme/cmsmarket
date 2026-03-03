import {
    GET_DRIVERS_REQUEST,
    GET_DRIVERS_SUCCESS,
    GET_DRIVERS_FAIL,

    ADD_DRIVER_REQUEST,
    ADD_DRIVER_SUCCESS,
    ADD_DRIVER_FAIL,

    EDIT_DRIVER_REQUEST,
    EDIT_DRIVER_SUCCESS,
    EDIT_DRIVER_FAIL,

    DELETE_DRIVER_REQUEST,
    DELETE_DRIVER_SUCCESS,
    DELETE_DRIVER_FAIL,
} from "./actionTypes";

/* ================= GET DRIVERS ================= */

export const getDrivers = (query) => ({
    type: GET_DRIVERS_REQUEST,
    payload: query,
});

export const getDriversSuccess = (drivers) => ({
    type: GET_DRIVERS_SUCCESS,
    payload: drivers,
});

export const getDriversFail = (error) => ({
    type: GET_DRIVERS_FAIL,
    payload: error,
});


/* ================= ADD DRIVER ================= */

export const addDriver = (driver) => ({
    type: ADD_DRIVER_REQUEST,
    payload: driver,
});

export const addDriverSuccess = (driver) => ({
    type: ADD_DRIVER_SUCCESS,
    payload: driver,
});

export const addDriverFail = (error) => ({
    type: ADD_DRIVER_FAIL,
    payload: error,
});


/* ================= EDIT DRIVER ================= */

export const editDriver = (driver) => ({
    type: EDIT_DRIVER_REQUEST,
    payload: driver,
});

export const editDriverSuccess = (driver) => ({
    type: EDIT_DRIVER_SUCCESS,
    payload: driver,
});

export const editDriverFail = (error) => ({
    type: EDIT_DRIVER_FAIL,
    payload: error,
});


/* ================= DELETE DRIVER ================= */

export const deleteDriver = (id) => ({
    type: DELETE_DRIVER_REQUEST,
    payload: id,
});

export const deleteDriverSuccess = (id) => ({
    type: DELETE_DRIVER_SUCCESS,
    payload: id,
});

export const deleteDriverFail = (error) => ({
    type: DELETE_DRIVER_FAIL,
    payload: error,
});