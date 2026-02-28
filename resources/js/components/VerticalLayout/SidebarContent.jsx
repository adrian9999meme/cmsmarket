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
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

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

            <li>
              <Link to="/dashboard">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-user-voice"></i>
                <span>{props.t("Sellers")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/sellers/all"><i className="bx bx-store-alt"></i> {props.t("All Sellers")}</Link></li>
                {/* <li><Link to="/sellers/pending"><i className="bx bx-time"></i> {props.t("Pending Approvals")}</Link></li>
                <li><Link to="/sellers/blocked"><i className="bx bx-block"></i> {props.t("Blocked Sellers")}</Link></li>
                <li><Link to="/sellers/add"><i className="bx bx-plus-circle"></i> {props.t("Add New Seller")}</Link></li> */}
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-store"></i>
                <span>{props.t("Stores")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/stores/all"><i className="bx bx-store"></i> {props.t("All Stores")}</Link></li>
                {/* <li><Link to="/stores/active"><i className="bx bx-check-circle"></i> {props.t("Active Stores")}</Link></li> */}
                {/* <li><Link to="/stores/blocked"><i className="bx bx-block"></i> {props.t("Blocked Stores")}</Link></li>
                <li><Link to="/stores/pending"><i className="bx bx-time"></i> {props.t("Pending Approvals")}</Link></li>
                <li><Link to="/stores/add"><i className="bx bx-plus-circle"></i> {props.t("Add New Store")}</Link></li>
                <li><Link to="/stores/discounts"><i className="bx bx-purchase-tag"></i> {props.t("Store Discounts")}</Link></li> */}
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-user-circle"></i>
                <span>{props.t("Customers")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/customers/all"><i className="bx bx-user"></i> {props.t("Customers")}</Link></li>
                {/* <li><Link to="/customers/trades-men"><i className="bx bx-male"></i> {props.t("Trades Men")}</Link></li>
                <li><Link to="/customers/trades-discounts"><i className="bx bx-purchase-tag-alt"></i> {props.t("Trades Discounts")}</Link></li>
                <li><Link to="/customers/add"><i className="bx bx-plus-circle"></i> {props.t("Add New Customer")}</Link></li>
                <li><Link to="/customers/blocked"><i className="bx bx-block"></i> {props.t("Blocked Customers")}</Link></li> */}
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-cube"></i>
                <span>{props.t("Products")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/products/all"><i className="bx bx-cube"></i> {props.t("All Products")}</Link></li>
                <li><Link to="/products/xcell-csv"><i className="bx bx-spreadsheet"></i> {props.t("Xcell / CSV")}</Link></li>
                <li><Link to="/products/categories"><i className="bx bx-category"></i> {props.t("Categories")}</Link></li>
                <li><Link to="/products/media"><i className="bx bx-photo-album"></i> {props.t("Media Files")}</Link></li>
                <li><Link to="/products/add"><i className="bx bx-plus-circle"></i> {props.t("Add New Products")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-package"></i>
                <span>{props.t("Orders")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/orders/live"><i className="bx bx-bolt-circle"></i> {props.t("Live Orders")}</Link></li>
                <li><Link to="/orders/today"><i className="bx bx-calendar-star"></i> {props.t("Today's Orders")}</Link></li>
                <li><Link to="/orders/all"><i className="bx bx-list-ul"></i> {props.t("All Orders")}</Link></li>
                <li><Link to="/orders/unresolved"><i className="bx bx-error"></i> {props.t("Unresolved")}</Link></li>
                <li><Link to="/orders/cancelled"><i className="bx bx-block"></i> {props.t("Cancelled")}</Link></li>
              </ul>
            </li>


            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-car"></i>
                <span>{props.t("Drivers")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/drivers/online"><i className="bx bx-wifi"></i> {props.t("Drivers Online")}</Link></li>
                <li><Link to="/drivers/all"><i className="bx bx-id-card"></i> {props.t("All Drivers")}</Link></li>
                <li><Link to="/drivers/earnings"><i className="bx bx-money"></i> {props.t("Earnings & Payouts")}</Link></li>
                <li><Link to="/drivers/pending"><i className="bx bx-time"></i> {props.t("Pending Approvals")}</Link></li>
                <li><Link to="/drivers/blocked"><i className="bx bx-block"></i> {props.t("Blocked Drivers")}</Link></li>
                <li><Link to="/drivers/add"><i className="bx bx-plus-circle"></i> {props.t("Add New Driver")}</Link></li>
                <li><Link to="/drivers/app"><i className="bx bx-mobile-alt"></i> {props.t("Driver App")}</Link></li>
                <li><Link to="/drivers/support"><i className="bx bx-support"></i> {props.t("Driver Support")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-support"></i>
                <span>{props.t("Support")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/support/urgent"><i className="bx bx-error"></i> {props.t("Urgent Tickets")}</Link></li>
                <li><Link to="/support/customers"><i className="bx bx-user"></i> {props.t("Customer Tickets")}</Link></li>
                <li><Link to="/support/stores"><i className="bx bx-store"></i> {props.t("Stores Tickets")}</Link></li>
                <li><Link to="/support/drivers"><i className="bx bx-car"></i> {props.t("Drivers Tickets")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-bell"></i>
                <span>{props.t("Notifications")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/notifications/info"><i className="bx bx-info-circle"></i> {props.t("Website Info")}</Link></li>
                <li><Link to="/notifications/banners"><i className="bx bx-image"></i> {props.t("Website Banners")}</Link></li>
                <li><Link to="/notifications/newsletters"><i className="bx bx-envelope"></i> {props.t("Newsletters")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-credit-card"></i>
                <span>{props.t("Payments")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/payments/today"><i className="bx bx-calendar-check"></i> {props.t("Today's Payments")}</Link></li>
                <li><Link to="/payments/customers"><i className="bx bx-user"></i> {props.t("Customer Payments")}</Link></li>
                <li><Link to="/payments/cancelled"><i className="bx bx-x-circle"></i> {props.t("Cancelled / Refunded")}</Link></li>
                <li><Link to="/payments/customer-invoices"><i className="bx bx-file"></i> {props.t("Customer Invoices")}</Link></li>
                <li><Link to="/payments/store-payments"><i className="bx bx-store"></i> {props.t("Store Payments")}</Link></li>
                <li><Link to="/payments/store-payments-history"><i className="bx bx-history"></i> {props.t("Store Payments History")}</Link></li>
                <li><Link to="/payments/store-invoices"><i className="bx bx-file"></i> {props.t("Store Invoices")}</Link></li>
                <li><Link to="/payments/driver-payouts"><i className="bx bx-dollar"></i> {props.t("Driver's Payouts")}</Link></li>
                <li><Link to="/payments/driver-payouts-history"><i className="bx bx-history"></i> {props.t("Driver's Payouts History")}</Link></li>
                <li><Link to="/payments/driver-invoices"><i className="bx bx-file"></i> {props.t("Driver's Invoices")}</Link></li>
                <li><Link to="/payments/online"><i className="bx bx-globe"></i> {props.t("Make Online Payment")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-bar-chart-alt-2"></i>
                <span>{props.t("Statistics")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/statistics/today"><i className="bx bx-calendar-check"></i> {props.t("Today's Reports")}</Link></li>
                <li><Link to="/statistics/stores"><i className="bx bx-store"></i> {props.t("Stores Reports")}</Link></li>
                <li><Link to="/statistics/monthly"><i className="bx bx-calendar"></i> {props.t("Monthly Reports")}</Link></li>
                <li><Link to="/statistics/customers"><i className="bx bx-user"></i> {props.t("Customer Reports")}</Link></li>
                <li><Link to="/statistics/products"><i className="bx bx-cube"></i> {props.t("Products Stats")}</Link></li>
                <li><Link to="/statistics/website"><i className="bx bx-globe"></i> {props.t("Website Stats")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-user-circle"></i>
                <span>{props.t("Admin Users")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/admin-users/all"><i className="bx bx-user"></i> {props.t("All Admin Users")}</Link></li>
                <li><Link to="/admin-users/roles"><i className="bx bx-id-card"></i> {props.t("Admin Roles")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-world"></i>
                <span>{props.t("Website CMS")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/website-cms/pages"><i className="bx bx-file"></i> {props.t("All Pages")}</Link></li>
                <li><Link to="/website-cms/main-menu"><i className="bx bx-menu"></i> {props.t("Main Menu")}</Link></li>
                <li><Link to="/website-cms/footer"><i className="bx bx-underline"></i> {props.t("Footer")}</Link></li>
                <li><Link to="/website-cms/blog"><i className="bx bx-news"></i> {props.t("Blog")}</Link></li>
                <li><Link to="/website-cms/add-page"><i className="bx bx-plus-circle"></i> {props.t("Add New Page")}</Link></li>
                <li><Link to="/website-cms/media"><i className="bx bx-photo-album"></i> {props.t("Site Media")}</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow">
                <i className="bx bx-cog"></i>
                <span>{props.t("Settings")}</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/settings/pricing"><i className="bx bx-calculator"></i> {props.t("Pricing Formula")}</Link></li>
                <li><Link to="/settings/server-info"><i className="bx bx-server"></i> {props.t("Server Info")}</Link></li>
                <li><Link to="/settings/logs"><i className="bx bx-file"></i> {props.t("Logs")}</Link></li>
                <li><Link to="/settings/maintenance"><i className="bx bx-wrench"></i> {props.t("Maintenance")}</Link></li>
                <li><Link to="/settings/backup"><i className="bx bx-save"></i> {props.t("System Backup")}</Link></li>
              </ul>
            </li>

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
