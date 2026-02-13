
import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SET_TOKEN,
} from "./actionTypes"

const initialState = {
  error: "",
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
        isUserLogout: false,
      }
      break
    case LOGOUT_USER:
      state = { ...state }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state, isUserLogout: true, token: null }
      break
    case API_ERROR:
      state = { ...state, error: action.payload, loading: false, isUserLogout: false, }
      break
    case SET_TOKEN:
      state = { ...state, token: action.payload }
    default:
      state = { ...state }
      break
  }
  return state
}

export default login
