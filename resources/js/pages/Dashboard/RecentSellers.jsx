import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";

import { Badge, Button, Card, CardBody } from "reactstrap";

import TableContainer from "../../components/Common/TableContainer";
import { recentSellers } from "../../common/data/dashboard";
import EcommerceSellersModal from "../Ecommerce/EcommerceSellers/EcommerceSellersModal";

const RecentSellers = () => {
  const [modal1, setModal1] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

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
        header: "Seller Name",
        accessorKey: "sellerName",
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
              setSelectedSeller(cellProps.row.original);
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
      <EcommerceSellersModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={selectedSeller}
      />
      <Card>
        <CardBody>
          <div className="mb-4 h4 card-title">Recent Sellers</div>
          <TableContainer
            columns={columns}
            data={recentSellers}
            isGlobalFilter={false}
            tableClass="align-middle table-nowrap mb-0"
            theadClass="table-light"
          />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

RecentSellers.propTypes = {};

export default withRouter(RecentSellers);
