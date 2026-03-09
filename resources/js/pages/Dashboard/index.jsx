import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
//i18n
import { withTranslation } from "react-i18next";
//redux
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";

//import Charts
import StackedColumnChart from "./StackedColumnChart";
//import action
import { getCurrentUser, getChartsData as onGetChartsData } from "../../store/actions";
// import image
import modalimage1 from "../../../images/product/img-7.png";
import modalimage2 from "../../../images/product/img-4.png";
// Pages Components
import WelcomeComp from "./WelcomeComp";
import MonthlyEarning from "./MonthlyEarning";
import SocialSource from "./SocialSource";
import ActivityComp from "./ActivityComp";
import TopCities from "./TopCities";
import LatestTranaction from "./LatestTranaction";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import SummaryCards from "./SummaryCards";
import TodaysOrdersProgress from "./TodaysOrdersProgress";
import TopSellingStores from "./TopSellingStores";
import RecentStores from "./RecentStores";
import RecentSellers from "./RecentSellers";
import RecentCustomers from "./RecentCustomers";

const reports = [
  { title: "Orders", iconClass: "bx-copy-alt", description: "1,235" },
  { title: "Revenue", iconClass: "bx-archive-in", description: "$35, 723" },
  {
    title: "Average Price",
    iconClass: "bx-purchase-tag-alt",
    description: "$16.2",
  },
];

const Dashboard = props => {
  document.title = "Dashboard";
  const [modal, setmodal] = useState(false);
  const [periodData, setPeriodData] = useState([]);
  const [periodType, setPeriodType] = useState("Year");

  const dispatch = useDispatch();

  const dashboardSelector = createSelector(
    state => state.Dashboard,
    dashboard => ({
      chartsData: dashboard.chartsData,
      timediffer: dashboard.timediffer,
      date: dashboard.date,
    })
  );

  const { chartsData, timediffer, date } = useSelector(dashboardSelector);

  useEffect(() => {
    setPeriodData(chartsData);
  }, [chartsData]);

  useEffect(() => {
    dispatch(onGetChartsData("Year"));
  }, [dispatch]);

  const onChangeChartPeriod = pType => {
    setPeriodType(pType);
    dispatch(onGetChartsData(pType));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />

          <SummaryCards />

          <Row>
            <Col xl="4">
              <WelcomeComp />
            </Col>
            <Col xl="8">
              <Row>
                <Col xl="6">
                  <TodaysOrdersProgress />
                </Col>
                <Col xl="6">
                  <TopSellingStores />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col xl="6">
              <RecentStores />
            </Col>
            <Col xl="6">
              <RecentSellers />
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <RecentCustomers />
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal);
        }}
      >
        <div>
          <ModalHeader
            toggle={() => {
              setmodal(!modal);
            }}
          >
            Order Details
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
              Product id: <span className="text-primary">#SK2540</span>
            </p>
            <p className="mb-4">
              Billing Name: <span className="text-primary">Neal Matthews</span>
            </p>

            <div className="table-responsive">
              <Table className="table table-centered table-nowrap">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage1} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Wireless Headphone (Black)
                        </h5>
                        <p className="text-muted mb-0">$ 225 x 1</p>
                      </div>
                    </td>
                    <td>$ 255</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage2} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Hoodie (Blue)
                        </h5>
                        <p className="text-muted mb-0">$ 145 x 1</p>
                      </div>
                    </td>
                    <td>$ 145</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Sub Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Shipping:</h6>
                    </td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);
