import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";

import { Badge, Button, Card, CardBody } from "reactstrap";

// Replace or define recentStores with your actual store data source
import { recentStores } from "../../common/data/dashboard";

import TableContainer from "../../components/Common/TableContainer";
import EcommerceStoresModal from "../Ecommerce/EcommerceStores/EcommerceStoresModal";

const RecentStores = () => {
  const [modal1, setModal1] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

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
        header: "Store Name",
        accessorKey: "storeName",
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
        header: "Created Date",
        accessorKey: "createdDate",
        enableColumnFilter: false,
        enableSorting: true,
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
              setSelectedStore(cellProps.row.original);
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

  // Make sure recentStores has [{id, storeName, status, createdDate, ...}]
  return (
    <React.Fragment>
      <EcommerceStoresModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={selectedStore}
      />
      <Card>
        <CardBody>
          <div className="mb-4 h4 card-title">Recent Stores</div>
          <TableContainer
            columns={columns}
            data={recentStores}
            isGlobalFilter={false}
            tableClass="align-middle table-nowrap mb-0"
            theadClass="table-light"
          />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

RecentStores.propTypes = {};

export default withRouter(RecentStores);
