import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const SupportBreakdown = () => {
  document.title = "Support Tickets | LEKIT Ltd";
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Support" breadcrumbItem="Support Tickets" />
        <div className="text-center py-5 text-muted">
          <i className="bx bx-support font-size-48 mb-3" />
          <p>Support tickets management – coming soon.</p>
        </div>
      </Container>
    </div>
  );
};

export default SupportBreakdown;
