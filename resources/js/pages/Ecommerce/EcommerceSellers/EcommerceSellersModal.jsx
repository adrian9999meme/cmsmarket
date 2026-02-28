import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";

const EcommerceSellersModal = ({ isOpen, toggle, seller }) => {
  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className="exampleModal"
      tabIndex="-1"
      toggle={toggle}
    >
      <div className="modal-content">
        <ModalHeader toggle={toggle}>Seller Details</ModalHeader>
        <ModalBody>
          <p className="mb-2">
            Seller ID:{" "}
            <span className="text-primary">{seller?.id || "N/A"}</span>
          </p>
          <p className="mb-2">
            Name:{" "}
            <span className="text-primary">{seller?.sellerName || "N/A"}</span>
          </p>
          <p className="mb-2">
            Email:{" "}
            <span className="text-primary">{seller?.email || "N/A"}</span>
          </p>
          <p className="mb-2">
            Status:{" "}
            <span className="text-primary">{seller?.status || "N/A"}</span>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

EcommerceSellersModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  seller: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sellerName: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default EcommerceSellersModal;
