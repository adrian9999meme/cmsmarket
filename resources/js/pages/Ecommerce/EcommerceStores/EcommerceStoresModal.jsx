import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const EcommerceStoresModal = ({ isOpen, toggle, store }) => {
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
        <ModalHeader toggle={toggle}>Store Details</ModalHeader>
        <ModalBody>
          <p className="mb-2">
            Store ID:{" "}
            <span className="text-primary">{store?.id || "N/A"}</span>
          </p>
          <p className="mb-2">
            Store Name:{" "}
            <span className="text-primary">{store?.storeName || "N/A"}</span>
          </p>
          <p className="mb-2">
            Status:{" "}
            <span className="text-primary">{store?.status || "N/A"}</span>
          </p>
          <p className="mb-2">
            Created Date:{" "}
            <span className="text-primary">{store?.createdDate || "N/A"}</span>
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

EcommerceStoresModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  store: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    storeName: PropTypes.string,
    status: PropTypes.string,
    createdDate: PropTypes.string,
  }),
};

export default EcommerceStoresModal;
