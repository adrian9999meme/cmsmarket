import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, CardBody, Container, Nav, NavItem, NavLink } from "reactstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { apiError, fetchConfig } from "../../../store/actions";
import profileImg from "../../../../images/profile-img.png";
import logoImg from "../../../../images/logo.svg";

import RegisterAsCustomer from "./RegisterAsCustomer";
import RegisterAsTrade from "./RegisterAsTrade";
import RegisterAsStore from "./RegisterAsStore";

const configSelector = createSelector(
  (state) => state.config,
  (config) => ({
    appConfig: config?.appConfig,
    loading: config?.loading || config?.appConfig == null,
  })
);

const REGISTRATION_TYPES = {
  customer: { label: "Customer", component: RegisterAsCustomer, icon: "bx-user" },
  trade: { label: "Trade Customer", component: RegisterAsTrade, icon: "bx-briefcase" },
  seller: { label: "Store / Seller", component: RegisterAsStore, icon: "bx-store" },
};

const RegisterIndex = (props) => {
  document.title = "Register - Lekit";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get("type") || "customer";

  const { appConfig, loading } = useSelector(configSelector);
  const registrationTypes = useMemo(() => {
    const types = ["customer", "trade"];
    if (appConfig?.seller_system) {
      types.push("seller");
    }
    return appConfig?.registration_types || types;
  }, [appConfig]);
  const [activeType, setActiveType] = useState(typeFromUrl);

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  useEffect(() => {
    const valid = registrationTypes.includes(activeType);
    if (!valid && registrationTypes.length > 0) {
      setActiveType(registrationTypes[0]);
    }
  }, [activeType, registrationTypes]);

  const ActiveForm = REGISTRATION_TYPES[activeType]?.component || RegisterAsCustomer;

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={6}>
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Register</h5>
                        <p>Create your Lekit account. Choose your account type below.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <Link to="/">
                    <div className="avatar-md profile-user-wid mb-4">
                      <span className="avatar-title rounded-circle bg-light">
                        <img src={logoImg} alt="" className="rounded-circle" height="34" />
                      </span>
                    </div>
                  </Link>
                  <ToastContainer closeButton={false} limit={1} />

                  {registrationTypes.length > 1 && (
                    <Nav pills className="nav-pills-custom mb-4">
                      {registrationTypes.map((type) => (
                        <NavItem key={type}>
                          <NavLink
                            className={activeType === type ? "active" : ""}
                            onClick={() => setActiveType(type)}
                            style={{ cursor: "pointer" }}
                          >
                            <i className={`bx ${REGISTRATION_TYPES[type]?.icon || "bx-user"} me-1`} />
                            {REGISTRATION_TYPES[type]?.label || type}
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>
                  )}

                  {!loading && <ActiveForm navigate={navigate} />}
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
                    Login
                  </Link>
                </p>
                <p>© {new Date().getFullYear()} Lekit Ltd – Revolution in hardware products delivery</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default RegisterIndex;
