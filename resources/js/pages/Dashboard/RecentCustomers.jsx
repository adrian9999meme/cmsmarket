import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";

import { Badge, Button, Card, CardBody } from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";
import EcommerceCustomersModal from "../Ecommerce/EcommerceCustomers/EcommerceCustomersModal";
import { recentCustomers } from "../../common/data/dashboard";

const RecentCustomers = () => {
  const [modal1, setModal1] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const toggleViewModal = () => setModal1(!modal1);

  const columns = useMemo(
    () => [
      {
        header: () => <input type="checkbox" className="form-check-input" />,
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
        cell: () => <input type="checkbox" className="form-check-input" />,
      },
      {
        header: "Customer Name",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const status = cellProps.row.original.status;
          let badgeColor = "secondary";
          if (status === "Active") badgeColor = "success";
          else if (status === "Inactive") badgeColor = "danger";
          else if (status === "Pending") badgeColor = "warning";
          return (
            <Badge className={`font-size-11 badge-soft-${badgeColor}`}>
              {status}
            </Badge>
          );
        },
      },
      {
        header: "View",
        accessorKey: "view",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => (
          <Button
            type="button"
            color="primary"
            className="btn-sm btn-rounded"
            onClick={() => {
              setSelectedCustomer(cellProps.row.original);
              toggleViewModal();
            }}
          >
            View Details
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <React.Fragment>
      {/* Add modal for customer if you want */}
      <EcommerceCustomersModal
        isOpen={modal1}
        toggle={toggleViewModal}
        customer={selectedCustomer}
      />
      <Card>
        <CardBody>
          <div className="mb-4 h4 card-title">Recent Customers</div>
          <TableContainer
            columns={columns}
            data={recentCustomers}
            isGlobalFilter={false}
            tableClass="align-middle table-nowrap mb-0"
            theadClass="table-light"
          />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

RecentCustomers.propTypes = {};

export default withRouter(RecentCustomers);
