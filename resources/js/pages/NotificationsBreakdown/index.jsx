import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const NotificationsBreakdown = () => {
  document.title = "Notifications | LEKIT Ltd";
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Notifications" breadcrumbItem="Notifications" />
        <div className="text-center py-5 text-muted">
          <i className="bx bx-bell font-size-48 mb-3" />
          <p>Website info, banners and newsletters – coming soon.</p>
        </div>
      </Container>
    </div>
  );
};

export default NotificationsBreakdown;
