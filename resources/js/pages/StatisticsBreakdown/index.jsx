import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const StatisticsBreakdown = () => {
  document.title = "Statistics | LEKIT Ltd";
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Statistics" breadcrumbItem="Reports" />
        <div className="text-center py-5 text-muted">
          <i className="bx bx-bar-chart font-size-48 mb-3" />
          <p>Reports and statistics – coming soon.</p>
        </div>
      </Container>
    </div>
  );
};

export default StatisticsBreakdown;
