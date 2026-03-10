import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PaymentsBreakdown = () => {
  document.title = "Payments | LEKIT Ltd";
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Payments" breadcrumbItem="Payments" />
        <div className="text-center py-5 text-muted">
          <i className="bx bx-credit-card font-size-48 mb-3" />
          <p>Payments and payouts management – coming soon.</p>
        </div>
      </Container>
    </div>
  );
};

export default PaymentsBreakdown;
