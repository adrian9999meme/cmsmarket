import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const StaffBreakdown = () => {
  document.title = "Admin Users | LEKIT Ltd";
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Admin Users" breadcrumbItem="Staff" />
        <div className="text-center py-5 text-muted">
          <i className="bx bx-user-check font-size-48 mb-3" />
          <p>Admin users and roles management – coming soon.</p>
        </div>
      </Container>
    </div>
  );
};

export default StaffBreakdown;
