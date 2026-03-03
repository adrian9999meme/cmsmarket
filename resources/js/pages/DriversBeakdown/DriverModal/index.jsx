import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import DriverBasicInfo from "./DriverBasicInfo";
import DriverAddressInfo from "./DriverAddressInfo";
import DriverFinancialInfo from "./DriverFinancialInfo";
import DriverDocuments from "./DriverDocuments";
import ModalActions from "./ModalActions";

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    country: "",
    state: "",
    city: "",
    address: "",
    salary: "",
    commission: "",
    pickupHub: "",
    licensePlate: "",
    paypalEmail: "",
    bankName: "",
    sortNumber: "",
    accountNumber: "",
    cvDocument: null,
    drivingLicense: null,
    comments: "",
};

export default function DriverModal({ show, onClose, onSubmit }) {
    const [form, setForm] = useState(initialState);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit(form);
    };

    if (!show) return null;

    return (
        <Modal isOpen={show} toggle={onClose} size="lg" className="modal-dialog-scrollable">
            <ModalHeader toggle={onClose}>Driver Info</ModalHeader>

            <ModalBody>
                <DriverBasicInfo form={form} onChange={handleChange} />
                <DriverAddressInfo form={form} onChange={handleChange} />
                <DriverFinancialInfo form={form} onChange={handleChange} />
                <DriverDocuments form={form} onChange={handleChange} />
            </ModalBody>

            <ModalFooter>
                <ModalActions onClose={onClose} onSave={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}