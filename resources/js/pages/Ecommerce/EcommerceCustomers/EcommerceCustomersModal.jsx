import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const EcommerceCustomersModal = (props) => {
  const { isOpen, toggle, customer } = props;

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
        <ModalHeader toggle={toggle}>Customer Details</ModalHeader>
        <ModalBody>
          <p className="mb-2">
            Name:{" "}
            <span className="text-primary">
              {customer && customer.name ? customer.name : "N/A"}
            </span>
          </p>
          <p className="mb-2">
            Email:{" "}
            <span className="text-primary">
              {customer && customer.email ? customer.email : "N/A"}
            </span>
          </p>
          <p className="mb-2">
            Phone:{" "}
            <span className="text-primary">
              {customer && customer.phone ? customer.phone : "N/A"}
            </span>
          </p>
          <p className="mb-2">
            Status:{" "}
            <span className="text-primary">
              {customer && customer.status ? customer.status : "N/A"}
            </span>
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

EcommerceCustomersModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  customer: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default EcommerceCustomersModal;
