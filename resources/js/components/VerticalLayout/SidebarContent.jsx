import React, { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "../Common/withRouter";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = props => {
  const role = 'admin'
  const ref = useRef();
  const menuInstance = useRef(null);
  const prevActiveItem = useRef(null);

  // Set the default focused item path here. Use a valid route path.
  const DEFAULT_PATH = "/dashboard";

  // Helper to activate the focused menu and parents, and expand
  const activateMenuItem = useCallback(item => {
    if (!item) return;
    // Remove previous activation if changed
    if (prevActiveItem.current && prevActiveItem.current !== item) {
      deactivateMenuItem(prevActiveItem.current);
    }
    // If already active, don't collapse/expand again
    if (item.classList.contains("active")) return;
    // Activate the menu item and parent structure
    item.classList.add("active");
    let parent = item.parentElement;
    while (parent && parent.getAttribute("id") !== "side-menu") {
      if (parent.tagName === "LI") parent.classList.add("mm-active");
      if (parent.tagName === "UL") parent.classList.add("mm-show");
      parent = parent.parentElement;
    }
    // Save current active item
    prevActiveItem.current = item;
    scrollElement(item);
  }, []);

  // Helper to deactivate an activated menu item and all its parents
  const deactivateMenuItem = (item) => {
    if (!item) return;
    // Remove active from item and all parent <li> and expand from <ul>
    let parent = item.parentElement;
    item.classList.remove("active");
    while (parent && parent.getAttribute("id") !== "side-menu") {
      if (parent.tagName === "LI") parent.classList.remove("mm-active");
      if (parent.tagName === "UL") parent.classList.remove("mm-show");
      parent = parent.parentElement;
    }
  };

  // Find menu item matching the pathname
  const path = useLocation();

  // This function now accepts an explicit path to fallback to, if the current path doesn't match any menu item
  const activeMenu = useCallback(
    (useDefault = false) => {
      // If not overriding, use the location path
      // If using the default, use DEFAULT_PATH instead
      const pathName = useDefault ? DEFAULT_PATH : path.pathname;
      const ul = document.getElementById("side-menu");
      if (!ul) return;

      const items = ul.getElementsByTagName("a");
      let matchingMenuItem = null;

      // Fix to ensure MetisMenu works with react-router Link:
      // Instead of using pathname, use getAttribute("href") for comparison
      // React-router 'to' prop will set href (may include a leading /)
      for (let i = 0; i < items.length; ++i) {
        let linkHref = items[i].getAttribute("href");
        let cleanedPathName = pathName.split("?")[0].split("#")[0];
        if (
          linkHref &&
          (linkHref === cleanedPathName ||
            linkHref === window.location.origin + cleanedPathName)
        ) {
          matchingMenuItem = items[i];
          break;
        }
        if (
          linkHref &&
          (cleanedPathName.endsWith(linkHref) ||
            linkHref.endsWith(cleanedPathName))
        ) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        activateMenuItem(matchingMenuItem);
        return true; // found and activated
      } else if (prevActiveItem.current) {
        deactivateMenuItem(prevActiveItem.current);
        prevActiveItem.current = null;
      }
      return false;
    },
    [path.pathname, activateMenuItem]
  );

  useEffect(() => {
    if (ref.current && ref.current.recalculate) ref.current.recalculate();
  }, []);

  useEffect(() => {
    if (menuInstance.current) {
      menuInstance.current.dispose && menuInstance.current.dispose();
      menuInstance.current = null;
    }
    menuInstance.current = new MetisMenu("#side-menu");
    // Set the active menu item, and fall back to default if none matches.
    // Try to activate the current path; if not, activate the default
    const activated = activeMenu(false);
    if (!activated) {
      // Select the default only on initial mount, not on every path change
      activeMenu(true);
    }
    // Clean up MetisMenu
    return () => {
      if (menuInstance.current && menuInstance.current.dispose) {
        menuInstance.current.dispose();
        menuInstance.current = null;
      }
    };
    // eslint-disable-next-line
  }, []); // Only run once on mount

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const activated = activeMenu(false);
    // Whenever the path changes and no path matches, also fall back to default (if it's not the current path already)
    if (!activated && path.pathname !== DEFAULT_PATH) {
      activeMenu(true);
    }
  }, [activeMenu, path.pathname]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")}</li>

            <ul className="metismenu list-unstyled" id="side-menu">

              <li className="menu-title">{props.t("Menu")}</li>

              {/* ---------------- ADMIN ---------------- */}
              {role === "admin" && (
                <>
                  <li>
                    <Link to="/dashboard">
                      <i className="bx bx-home-circle"></i>
                      <span>Dashboard</span>
                    </Link>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">
                      <i className="bx bx-package"></i>
                      <span>Orders</span>
                    </a>
                    <ul className="sub-menu">
                      <li><Link to="/orders/live">Live Orders</Link></li>
                      <li><Link to="/orders/today">Today's Orders</Link></li>
                      <li><Link to="/orders/all">All Orders</Link></li>
                      <li><Link to="/orders/unresolved">Unresolved</Link></li>
                      <li><Link to="/orders/cancelled">Cancelled</Link></li>
                      <li><Link to="/orders/returns">Returns / Refunds</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">
                      <i className="bx bx-user-voice"></i>
                      <span>Sellers</span>
                    </a>
                    <ul className="sub-menu">
                      <li><Link to="/sellers/all">All Sellers</Link></li>
                      <li><Link to="/sellers/pending">Pending Approvals</Link></li>
                      <li><Link to="/sellers/blocked">Blocked Sellers</Link></li>
                      <li><Link to="/sellers/add">Add Seller</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">
                      <i className="bx bx-store"></i>
                      <span>Stores</span>
                    </a>
                    <ul className="sub-menu">
                      <li><Link to="/stores/all">All Stores</Link></li>
                      <li><Link to="/stores/active">Active Stores</Link></li>
                      <li><Link to="/stores/blocked">Blocked Stores</Link></li>
                      <li><Link to="/stores/pending">Pending Approvals</Link></li>
                      <li><Link to="/stores/add">Add Store</Link></li>
                      <li><Link to="/stores/discounts">Store Discounts</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">
                      <i className="bx bx-cube"></i>
                      <span>Products</span>
                    </a>
                    <ul className="sub-menu">
                      <li><Link to="/products/all">All Products</Link></li>
                      <li><Link to="/products/import">Import / Export CSV</Link></li>
                      <li><Link to="/products/categories">Categories</Link></li>
                      <li><Link to="/products/media">Media Files</Link></li>
                      <li><Link to="/products/add">Add Product</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">
                      <i className="bx bx-user"></i>
                      <span>Customers</span>
                    </a>
                    <ul className="sub-menu">
                      <li><Link to="/customers/all">Customers</Link></li>
                      <li><Link to="/customers/trade">Trade Customers</Link></li>
                      <li><Link to="/customers/trade-discounts">Trade Discounts</Link></li>
                      <li><Link to="/customers/add">Add Customer</Link></li>
                      <li><Link to="/customers/blocked">Blocked Customers</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">
                      <i className="bx bx-car"></i>
                      <span>Drivers</span>
                    </a>
                    <ul className="sub-menu">
                      <li><Link to="/drivers/online">Drivers Online</Link></li>
                      <li><Link to="/drivers/all">All Drivers</Link></li>
                      <li><Link to="/drivers/earnings">Earnings</Link></li>
                      <li><Link to="/drivers/pending">Pending</Link></li>
                      <li><Link to="/drivers/blocked">Blocked</Link></li>
                      <li><Link to="/drivers/add">Add Driver</Link></li>
                      <li><Link to="/drivers/support">Driver Support</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">
                      <i className="bx bx-credit-card"></i>
                      <span>Payments</span>
                    </a>
                    <ul className="sub-menu">
                      <li><Link to="/payments/today">Today's Payments</Link></li>
                      <li><Link to="/payments/customers">Customer Payments</Link></li>
                      <li><Link to="/payments/cancelled">Cancelled</Link></li>
                      <li><Link to="/payments/customer-invoices">Customer Invoices</Link></li>
                      <li><Link to="/payments/store-payments">Store Payments</Link></li>
                      <li><Link to="/payments/store-payments-history">Store Payment History</Link></li>
                      <li><Link to="/payments/store-invoices">Store Invoices</Link></li>
                      <li><Link to="/payments/driver-payouts">Driver Payouts</Link></li>
                      <li><Link to="/payments/driver-payouts-history">Driver Payout History</Link></li>
                      <li><Link to="/payments/driver-invoices">Driver Invoices</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">
                      <i className="bx bx-bar-chart"></i>
                      <span>Statistics</span>
                    </a>
                    <ul className="sub-menu">
                      <li><Link to="/statistics/today">Today's Reports</Link></li>
                      <li><Link to="/statistics/stores">Store Reports</Link></li>
                      <li><Link to="/statistics/monthly">Monthly Reports</Link></li>
                      <li><Link to="/statistics/customers">Customer Reports</Link></li>
                      <li><Link to="/statistics/products">Product Stats</Link></li>
                      <li><Link to="/statistics/website">Website Stats</Link></li>
                    </ul>
                  </li>
                </>
              )}

              {/* ---------------- STORE ---------------- */}

              {role === "store" && (
                <>
                  <li><Link to="/dashboard">Dashboard</Link></li>

                  <li>
                    <a href="#" className="has-arrow">Orders</a>
                    <ul className="sub-menu">
                      <li><Link to="/orders/live">Live Orders</Link></li>
                      <li><Link to="/orders/today">Today's Orders</Link></li>
                      <li><Link to="/orders/history">Order History</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">Products</a>
                    <ul className="sub-menu">
                      <li><Link to="/products/all">All Products</Link></li>
                      <li><Link to="/products/add">Add Product</Link></li>
                      <li><Link to="/products/import">Import CSV</Link></li>
                      <li><Link to="/products/media">Product Media</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">Trade Discounts</a>
                    <ul className="sub-menu">
                      <li><Link to="/trade-discounts/requests">Discount Requests</Link></li>
                      <li><Link to="/trade-discounts/approved">Approved Trade Customers</Link></li>
                    </ul>
                  </li>

                  <li><Link to="/customers/store">Store Customers</Link></li>

                  <li>
                    <a href="#" className="has-arrow">Payments</a>
                    <ul className="sub-menu">
                      <li><Link to="/payments/store">Store Payments</Link></li>
                      <li><Link to="/payments/invoices">Invoices</Link></li>
                    </ul>
                  </li>

                  <li><Link to="/statistics/sales">Sales Reports</Link></li>
                  <li><Link to="/support">Contact Support</Link></li>
                </>
              )}

              {/* ---------------- TRADE CUSTOMER ---------------- */}

              {role === "trade_customer" && (
                <>
                  <li><Link to="/dashboard">Dashboard</Link></li>

                  <li>
                    <a href="#" className="has-arrow">Products</a>
                    <ul className="sub-menu">
                      <li><Link to="/products">Browse Products</Link></li>
                      <li><Link to="/products/search">Search Products</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">Orders</a>
                    <ul className="sub-menu">
                      <li><Link to="/orders/place">Place Order</Link></li>
                      <li><Link to="/orders/history">Order History</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">Trade Discounts</a>
                    <ul className="sub-menu">
                      <li><Link to="/discounts/my">My Discount Requests</Link></li>
                      <li><Link to="/discounts/approved">Approved Discounts</Link></li>
                      <li><Link to="/discounts/apply">Apply for Discount</Link></li>
                    </ul>
                  </li>

                  <li><Link to="/invoices">Delivery Invoices</Link></li>
                  <li><Link to="/account/profile">Business Profile</Link></li>
                  <li><Link to="/support">Contact Support</Link></li>
                </>
              )}

              {/* ---------------- CUSTOMER ---------------- */}

              {role === "customer" && (
                <>
                  <li><Link to="/home">Home</Link></li>

                  <li>
                    <a href="#" className="has-arrow">Products</a>
                    <ul className="sub-menu">
                      <li><Link to="/products">Browse Products</Link></li>
                      <li><Link to="/categories">Categories</Link></li>
                      <li><Link to="/search">Search Products</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">Orders</a>
                    <ul className="sub-menu">
                      <li><Link to="/orders">My Orders</Link></li>
                      <li><Link to="/orders/track">Track Order</Link></li>
                    </ul>
                  </li>

                  <li><Link to="/favorites">Saved Products</Link></li>
                  <li><Link to="/invoices">My Invoices</Link></li>
                  <li><Link to="/support">Support Tickets</Link></li>
                  <li><Link to="/account/profile">Profile</Link></li>
                </>
              )}

              {/* ---------------- DRIVER ---------------- */}

              {role === "driver" && (
                <>
                  <li><Link to="/dashboard">Dashboard</Link></li>

                  <li>
                    <a href="#" className="has-arrow">Orders</a>
                    <ul className="sub-menu">
                      <li><Link to="/orders/available">Available Orders</Link></li>
                      <li><Link to="/orders/current">Current Delivery</Link></li>
                      <li><Link to="/orders/completed">Completed Deliveries</Link></li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" className="has-arrow">Earnings</a>
                    <ul className="sub-menu">
                      <li><Link to="/earnings">Current Earnings</Link></li>
                      <li><Link to="/payouts">Payout History</Link></li>
                    </ul>
                  </li>

                  <li><Link to="/navigation">Delivery Routes</Link></li>
                  <li><Link to="/support">Driver Support</Link></li>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/settings">Settings</Link></li>
                </>
              )}

              <li className="position-absolute bottom-0">
                <Link to="/logout">
                  <i className="bx bx-power-off"></i>
                  <span>Logout</span>
                </Link>
              </li>

            </ul>

            <li className="position-absolute bottom-0">
              <Link to="/logout">
                <i className="bx bx-power-off"></i>
                <span>{props.t("Logout")}</span>
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
