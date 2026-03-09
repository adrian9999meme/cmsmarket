/**
 * Admin CMS App
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { createSelector } from "reselect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { layoutTypes } from "../../constants/layout";
import { getCurrentUser, fetchConfig } from "../../store/actions";
import VerticalLayout from "../../components/VerticalLayout/";
import HorizontalLayout from "../../components/HorizontalLayout/";
import NonAuthLayout from "../../components/NonAuthLayout";
import AuthProtected from "../../routes/AuthProtected";

import {
  adminPublicRoutes,
  adminProtectedRoutes,
  Pages404,
} from "./routes";

const getLayout = (layoutType) => {
  return layoutType === layoutTypes.HORIZONTAL ? HorizontalLayout : VerticalLayout;
};

const AdminApp = () => {
  const dispatch = useDispatch();
  const selectLayoutData = createSelector(
    (state) => state.Layout,
    (layoutType) => layoutType
  );
  const { layoutType } = useSelector(selectLayoutData);
  const Layout = getLayout(layoutType);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getCurrentUser(token));
      dispatch(fetchConfig());
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        {adminPublicRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
          />
        ))}
        {adminProtectedRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <AuthProtected>
                <Layout>{route.component}</Layout>
              </AuthProtected>
            }
          />
        ))}
        <Route path="*" element={<Pages404 />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} newestOnTop closeOnClick pauseOnHover />
    </>
  );
};

export default AdminApp;
