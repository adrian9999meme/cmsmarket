import React from "react";

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

import ApexRadial from "./ApexRadial";

const TodaysOrdersProgress = ({orders, comparison, dailytarget}) => {
  return (
    <React.Fragment>
      {" "}
      <Card className="">
        <CardBody>
          <CardTitle className="mb-3">Today's Orders Progress</CardTitle>
          <Row className="mb-4">
            <Col sm="6">
              <h3 className="mt-3 mb-5">{`${orders || 0} Orders`}</h3>
              <p className="text-muted">
                <span className="text-success me-2">
                  12% <i className="mdi mdi-arrow-up"></i>
                </span>
                From yesterday
              </p>
              <div className="mt-5">
                <Link
                  to="#"
                  className="btn btn-primary waves-effect waves-light btn-sm"
                >
                  View More <i className="mdi mdi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
            <Col sm="6">
              <div className="mt-4 mt-sm-0">
                <ApexRadial dataColors='["--bs-primary"]' />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default TodaysOrdersProgress;
