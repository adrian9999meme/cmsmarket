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

const INIT_STATE = {
    drivers: [],
    loading: false,
    error: null,
};

const DriversReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        /* ================= GET DRIVERS ================= */
        case GET_DRIVERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_DRIVERS_SUCCESS:
            return {
                ...state,
                drivers: action.payload,
                loading: false,
            };

        case GET_DRIVERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        /* ================= ADD DRIVER ================= */
        case ADD_DRIVER_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case ADD_DRIVER_SUCCESS:
            return {
                ...state,
                drivers: [action.payload, ...state.drivers],
                loading: false,
            };

        case ADD_DRIVER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        /* ================= EDIT DRIVER ================= */
        case EDIT_DRIVER_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case EDIT_DRIVER_SUCCESS:
            return {
                ...state,
                drivers: state.drivers.map(driver =>
                    driver.id.toString() === action.payload.id.toString()
                        ? { ...driver, ...action.payload }
                        : driver
                ),
                loading: false,
            };

        case EDIT_DRIVER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        /* ================= DELETE DRIVER ================= */
        case DELETE_DRIVER_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case DELETE_DRIVER_SUCCESS:
            return {
                ...state,
                drivers: state.drivers.filter(
                    driver => driver.id.toString() !== action.payload.toString()
                ),
                loading: false,
            };

        case DELETE_DRIVER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default DriversReducer;