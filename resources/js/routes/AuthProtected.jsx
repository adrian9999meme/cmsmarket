import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getAppRedirectIfWrong } from "../helpers/appGuard";

const AuthProtected = (props) => {
  const location = useLocation();
  const tokenSelector = createSelector(
    (state) => state.Login,
    (login) => login && login.token
  );
  const userSelector = createSelector(
    (state) => state.Login,
    (login) => login?.user?.role
  );
  const token = useSelector(tokenSelector);
  const role = useSelector(userSelector);

  if (token === null) {
    return <Navigate to={{ pathname: "/login", state: { from: location } }} />;
  }

  // Micro-frontend: redirect to correct app if user landed in wrong one
  const redirectUrl = getAppRedirectIfWrong(window.location.pathname, role);
  if (redirectUrl) {
    window.location.href = redirectUrl;
    return null;
  }

  return <>{props.children}</>;
};

export default AuthProtected;
