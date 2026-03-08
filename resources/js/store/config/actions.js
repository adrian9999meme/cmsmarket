import { FETCH_CONFIG, FETCH_CONFIG_SUCCESS, FETCH_CONFIG_ERROR } from "./actionTypes";

export const fetchConfig = () => ({
  type: FETCH_CONFIG,
});

export const fetchConfigSuccess = (appConfig) => ({
  type: FETCH_CONFIG_SUCCESS,
  payload: appConfig,
});

export const fetchConfigError = (error) => ({
  type: FETCH_CONFIG_ERROR,
  payload: error,
});
