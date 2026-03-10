import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const TradeDiscountsBreakdown = () => {
  document.title = "Trade Discounts | LEKIT Ltd";
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Trade Discounts" breadcrumbItem="Discount Requests" />
        <div className="text-center py-5 text-muted">
          <i className="bx bx-purchase-tag font-size-48 mb-3" />
          <p>Trade discount requests management – coming soon.</p>
        </div>
      </Container>
    </div>
  );
};

export default TradeDiscountsBreakdown;
