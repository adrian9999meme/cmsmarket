import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PagesBreakdown = () => {
  document.title = "Website CMS | LEKIT Ltd";
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Website CMS" breadcrumbItem="Pages" />
        <div className="text-center py-5 text-muted">
          <i className="bx bx-globe font-size-48 mb-3" />
          <p>Website pages and content management – coming soon.</p>
        </div>
      </Container>
    </div>
  );
};

export default PagesBreakdown;
