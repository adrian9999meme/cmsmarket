import React, { useState } from "react";
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import { Link } from "react-router-dom";

// Redux Store
import { showRightSidebarAction, toggleLeftmenu } from "../../store/actions";
// reactstrap
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

import megamenuImg from "../../../images/megamenu-img.png";
import logoLight from "../../../images/CMS_logo_big.png";
import logoDark from "../../../images/CMS_logo_big2.png";
import logo from "../../../images/logo.svg";
import logoLightSvg from "../../../images/logo-light.svg";

// import images
import github from "../../../images/brands/github.png";
import dropbox from "../../../images/brands/dropbox.png";
import gmail from "../../../images/brands/Gmail.png";
import analytics from "../../../images/brands/Analytics.png";
import stripe from "../../../images/brands/Stripe.png";
import paypal from "../../../images/brands/Paypal.png";

//i18n
import { withTranslation } from "react-i18next";
import DigitalClock from "../Common/DigitalClock";

const Header = props => {
  const [menu, setMenu] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const [socialDrp, setsocialDrp] = useState(false);

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="50" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="60" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg} alt="" height="50" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="60" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
              data-toggle="collapse"
              onClick={() => {
                props.toggleLeftmenu(!props.leftMenu);
              }}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

            <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <span className="bx bx-search-alt" />
              </div>
            </form>

            {/* <Dropdown
              className="dropdown-mega d-none d-lg-block ms-2"
              isOpen={menu}
              toggle={() => setMenu(!menu)}
            >
              <DropdownToggle
                className="btn header-item "
                caret
                tag="button"
              >
                {props.t("Mega Menu")} <i className="mdi mdi-chevron-down" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-megamenu">
                <Row>
                  <Col sm={8}>
                    <Row>
                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("UI Components")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="#">{props.t("Lightbox")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Range Slider")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Sweet Alert")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Rating")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Forms")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Tables")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Charts")}</Link>
                          </li>
                        </ul>
                      </Col>

                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("Applications")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="#">{props.t("Ecommerce")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Calendar")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Email")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Projects")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Tasks")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Contacts")}</Link>
                          </li>
                        </ul>
                      </Col>

                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("Extra Pages")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="#">{props.t("Light Sidebar")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Compact Sidebar")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Horizontal layout")}</Link>
                          </li>
                          <li>
                            <Link to="#"> {props.t("Maintenance")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Coming Soon")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Timeline")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("FAQs")}</Link>
                          </li>
                        </ul>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={4}>
                    <Row>
                      <Col sm={6}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("UI Components")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="#">{props.t("Lightbox")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Range Slider")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Sweet Alert")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Rating")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Forms")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Tables")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Charts")}</Link>
                          </li>
                        </ul>
                      </Col>

                      <Col sm={5}>
                        <div>
                          <img
                            src={megamenuImg}
                            alt=""
                            className="img-fluid mx-auto d-block"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </DropdownMenu>
            </Dropdown> */}
          </div>

          <DigitalClock />

          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
                onClick={() => setSearch(!isSearch)}
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  isSearch
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={props.t("Search") + "..."}
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <LanguageDropdown />

            <Dropdown
              className="d-none d-lg-inline-block ms-1"
              isOpen={socialDrp}
              toggle={() => {
                setsocialDrp(!socialDrp);
              }}
            >
              <DropdownToggle
                className="btn header-item noti-icon "
                caret
                tag="button"
              >
                <i className="bx bx-customize" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg dropdown-menu-end">
                <div className="px-lg-2">
                  <Row className="no-gutters">
                    <Col>
                      <Link className="dropdown-icon-item" to="https://github.com/trending" target="_blank" rel="noopener noreferrer">
                        <img src={github} alt="Github" />
                        <span>GitHub</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="https://www.dropbox.com/features/content-collaboration/trending" target="_blank" rel="noopener noreferrer">
                        <img src={dropbox} alt="Dropbox" />
                        <span>Dropbox</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="https://mail.google.com/mail/u/0/#search/trend" target="_blank" rel="noopener noreferrer">
                        <img src={gmail} alt="Gmail" />
                        <span>Gmail</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="https://trends.google.com/trends/trendingsearches/daily" target="_blank" rel="noopener noreferrer">
                        <img src={analytics} alt="Analytics" />
                        <span>Analytics</span>
                      </Link>
                    </Col>
                  </Row>
                  <Row className="no-gutters">
                    <Col>
                      <Link className="dropdown-icon-item" to="https://stripe.com/en-us/blog/tags/trends" target="_blank" rel="noopener noreferrer">
                        <img src={stripe} alt="Stripe" />
                        <span>Stripe</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="https://www.paypal.com/stories/us/tag/trends" target="_blank" rel="noopener noreferrer">
                        <img src={paypal} alt="Paypal" />
                        <span>Paypal</span>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </DropdownMenu>
            </Dropdown>

            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                className="btn header-item noti-icon "
                onClick={() => {
                  toggleFullscreen();
                }}
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>

            <NotificationDropdown />

            <ProfileMenu />

            <div className="dropdown d-inline-block">
              <button
                onClick={() => {
                  props.showRightSidebarAction(!props.showRightSidebar);
                }}
                type="button"
                className="btn header-item noti-icon right-bar-toggle "
              >
                <i className="bx bx-cog bx-spin" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
};

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(withTranslation()(Header));
