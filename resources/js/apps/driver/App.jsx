/**
 * Driver App
 */

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getCurrentUser, fetchConfig } from "../../store/actions";
import VerticalLayout from "../../components/VerticalLayout/";
import NonAuthLayout from "../../components/NonAuthLayout";
import AuthProtected from "../../routes/AuthProtected";

import {
  driverPublicRoutes,
  driverProtectedRoutes,
  Pages404,
} from "./routes";

const DriverApp = () => {
  const dispatch = useDispatch();

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
        {driverPublicRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
          />
        ))}
        {driverProtectedRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <AuthProtected>
                <VerticalLayout>{route.component}</VerticalLayout>
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

export default DriverApp;
