import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const AuthProtected = (props) => {
  // Get token from store
  // If Account is used store for auth, else replace with the correct reducer
  const tokenSelector = createSelector(
    state => state.Login,
    login => login && login.token
  );
  const token = useSelector(tokenSelector);

  if (token === null) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  return (
  <React.Fragment>
    {props.children}
  </React.Fragment>);
};

export default AuthProtected;
