import { FETCH_CONFIG, FETCH_CONFIG_SUCCESS, FETCH_CONFIG_ERROR } from "./actionTypes";

const INIT_STATE = {
  appConfig: null,
  loading: false,
  error: null,
};

export default function configReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case FETCH_CONFIG:
      return { ...state, loading: true, error: null };
    case FETCH_CONFIG_SUCCESS:
      return { ...state, appConfig: action.payload, loading: false, error: null };
    case FETCH_CONFIG_ERROR:
      return { ...state, loading: false, error: action.payload, appConfig: state.appConfig };
    default:
      return state;
  }
}
