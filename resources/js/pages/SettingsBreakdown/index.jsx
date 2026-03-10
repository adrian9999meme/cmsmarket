import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const SettingsBreakdown = () => {
  document.title = "Settings | LEKIT Ltd";
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Settings" breadcrumbItem="Settings" />
        <div className="text-center py-5 text-muted">
          <i className="bx bx-cog font-size-48 mb-3" />
          <p>Use the gear icon in the header for layout and theme settings.</p>
        </div>
      </Container>
    </div>
  );
};

export default SettingsBreakdown;
