/**
 * Customer App - Entry point
 * Uses the existing monolithic app (index.jsx) for now.
 * Customer app = current app (browse products, order history, etc.)
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "../../store";
import App from "../../setup";
import "../../i18n";

if (document.getElementById("react-app")) {
  const root = ReactDOM.createRoot(document.getElementById("react-app"));
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}
