import React, { useState, useMemo, useEffect } from "react";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Input,
  InputGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { addNewCustomer, deleteCustomer, getCustomers, setActiveCustomer, updateCustomer } from "../../store/actions";
import defaultCustomerImg from '../../../images/default/user.jpg'
// Mock data - no database (MVP)
const MOCK_CUSTOMERS = [
  {
    id: "C001",
    name: "John Smith",
    email: "john.smith@example.com",
    tel: "+44 7700 900123",
    address: "12 High Street, London SW1A 1AA",
    lastLogin: "2024-01-15 09:32",
    orders: 24,
    tickets: 2,
    active: true,
  },
  {
    id: "C002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    tel: "+44 7700 900456",
    address: "45 Park Lane, Manchester M1 2AB",
    lastLogin: "2024-01-14 14:20",
    orders: 8,
    tickets: 0,
    active: true,
  },
  {
    id: "C003",
    name: "Michael Brown",
    email: "m.brown@example.com",
    tel: "+44 7700 900789",
    address: "78 Queen St, Birmingham B1 1AA",
    lastLogin: "2024-01-10 11:05",
    orders: 15,
    tickets: 1,
    active: false,
  },
];

const MOCK_TRADE_CUSTOMERS = [
  {
    id: "TC001",
    name: "Mark McDaniel",
    companyName: "Mark McDaniel LTD",
    industry: "electric and plumbing",
    companyAddress: "100 Industrial Way, Leeds LS1 2XY",
    lastLogin: "2024-01-16 08:15",
    orders: 156,
    tickets: 5,
    tradeDiscounts: "12%",
    active: true,
  },
  {
    id: "TC002",
    name: "Emma Wilson",
    companyName: "Wilson Builders Ltd",
    industry: "construction",
    companyAddress: "22 Builder's Row, Bristol BS1 4AA",
    lastLogin: "2024-01-13 16:42",
    orders: 89,
    tickets: 2,
    tradeDiscounts: "8%",
    active: true,
  },
  {
    id: "TC003",
    name: "David Clark",
    companyName: "Clark Supplies Co",
    industry: "wholesale hardware",
    companyAddress: "5 Warehouse Rd, Glasgow G1 1BB",
    lastLogin: "2024-01-08 10:30",
    orders: 234,
    tickets: 12,
    tradeDiscounts: "15%",
    active: false,
  },
];

const CustomersBreakdown = () => {
  document.title = "Customers Breakdown | LEKIT Ltd";

  const dispatch = useDispatch();
  const { subdomain } = useParams()

  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [tradeCustomers, setTradeCustomers] = useState(MOCK_TRADE_CUSTOMERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [modalType, setModalType] = useState("customers"); // customers | trade
  const [currentRecord, setCurrentRecord] = useState(null);
  const [query, setQuery] = useState({
    subdomain: 'all',
    searchKeyword: ''
  })

  const ecommerceSelector = createSelector(
    state => state.ecommerce,
    ecommerce => ({
      allcustomers: ecommerce.customers,
    })
  );
  const { allcustomers } = useSelector(ecommerceSelector);

  useEffect(() => {
    // Protect against undefined/null or non-array allcustomers
    setCustomers(Array.isArray(allcustomers) ? allcustomers : []);
  }, [allcustomers]);

  useEffect(() => {
    dispatch(getCustomers(query));
  }, [dispatch]);

  const initialFormState = {
    id: null,
    balance: null,
    billing_address: [],
    country_id: null,
    created_at: "",
    currency_code: null,
    date_of_birth: null,
    email: "",
    firebase_auth_id: null,
    first_name: "",
    full_name: "",
    gender: "",
    image_id: null,
    images: [],
    is_deleted: 0,
    is_password_set: 0,
    is_user_banned: 0,
    lang_code: "",
    last_ip: null,
    last_login: "",
    last_name: "",
    last_password_change: null,
    last_recharge: 0,
    newsletter_enable: 0,
    otp: null,
    permissions: [],
    phone: "",
    pickup_hub_id: null,
    profile_image: "",
    role_id: null,
    shipping_address: [],
    socials: [],
    status: 0,
    updated_at: "",
    user_profile_image: "",
    user_type: "",
    password: '',
    password_confirmation: ''
  };
  const [formValues, setFormValues] = useState(initialFormState);

  const toggleStatus = (id) => {
    const customerToUpdate = customers.find(customer => customer.id === id);
    if (!customerToUpdate) return;
    const updatedCustomer = {
      ...customerToUpdate,
      status: customerToUpdate.status === 1 ? 0 : 1
    };

    dispatch(setActiveCustomer(updatedCustomer));
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setFormValues({
      ...initialFormState,
    });
    setModalOpen(true);
  };

  const openViewOrEditModal = (mode, record) => {
    setModalMode(mode); // view or edit
    setCurrentRecord(record);
    setFormValues({
      ...initialFormState,
      ...(record || {}),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (modalMode === "view") {
      setModalOpen(false);
      return;
    }

    if (modalMode === "add") {
      const newCustomer = {
        first_name: formValues.first_name || "",
        last_name: formValues.last_name || "",
        email: formValues.email || "",
        phone: formValues.phone || "",
        status: formValues.status,
        user_type: "customer",
        image_id: null,
        images: [],
        address: formValues.address || "",
        password: formValues.password || "",
        password_confirmation: formValues.password_confirmation || "",
      };
      // setCustomers((prev = []) => [...prev, newCustomer]);
      // send backend
      dispatch(addNewCustomer(newCustomer));
    } else if (modalMode === "edit" && currentRecord) {
      const filteredCustomer = customers.filter(
        customer => customer.id.toString() === currentRecord.id.toString()
      );
      const editCustomer = {
        ...filteredCustomer[0],
        first_name: formValues.first_name || "",
        last_name: formValues.last_name || "",
        email: formValues.email || "",
        phone: formValues.phone || "",
        status: formValues.status,
        user_type: "customer",
        image_id: null,
        images: [],
        address: formValues.address || "",
        password: formValues.password || "",
        password_confirmation: formValues.password_confirmation || "",
      }

      dispatch(updateCustomer(editCustomer))
    }

    // setModalOpen(false);
  };

  const handleRemove = (id) => {
    if (!window.confirm("Remove this customer?")) return;
    dispatch(deleteCustomer(id))
  };

  // Action icon with title (tooltip on hover) – one-click actions
  const ActionIcon = ({ iconClass, title, onClick, colorClass = "text-primary" }) => (
    <Button color="link" className={`p-1 ${colorClass}`} title={title} onClick={onClick}>
      <i className={`bx ${iconClass} font-size-18`}></i>
    </Button>
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Customers Breakdown" breadcrumbItem="Customers Breakdown" />

          {/* Top bar: Search (left) + Add New Customer (right) */}
          <Row className="mb-3">
            <Col sm={6} className="d-flex align-items-center">
              <InputGroup>
                <Input
                  type="text"
                  placeholder="SEARCH CUSTOMERS"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </InputGroup>
            </Col>
            <Col sm={6} className="text-end">
              <Button color="primary" onClick={openAddModal}>
                <i className="bx bx-plus me-1"></i> ADD NEW CUSTOMER
              </Button>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table table-bordered table-nowrap align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Current Balance</th>
                          <th>Last Login</th>
                          <th>Status</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers && customers.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <div className="d-flex gap-2 align-items-center">
                                <div>
                                  <img
                                    src={row.profile_image || defaultCustomerImg}
                                    className="rounded me-2"
                                    alt=""
                                    style={{ width: 36, height: 36, objectFit: "contain" }}
                                  />
                                </div>
                                <div>
                                  <p className="mb-1">{row.full_name}</p>
                                  <p className="mb-1">{row.email}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{row.phone}</strong>
                              </div>
                            </td>
                            <td>{row.balance}</td>
                            <td>{row.last_login}</td>
                            <td>
                              <div className="form-check form-switch">
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`trade-${row.id}`}
                                  checked={row.status}
                                  onChange={() => toggleStatus(row.id)}
                                />
                                <label className="form-check-label" htmlFor={`${row.id}`}>
                                  {row.status ? "Active" : "Blocked"}
                                </label>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-start gap-1 flex-wrap">
                                <Button
                                  color="link"
                                  className={`p-1`}
                                  title="View Profile"
                                  onClick={() => openViewOrEditModal("view", row)}
                                >
                                  <i className={`bx bx-user font-size-18`}></i>
                                </Button>
                                <Button
                                  color="link"
                                  className={`p-1`}
                                  title="Edit Profile"
                                  onClick={() => openViewOrEditModal("edit", row)}
                                >
                                  <i className={`bx bx-edit-alt font-size-18`}></i>
                                </Button>
                                <Button
                                  color="link"
                                  className={`p-1 text-danger`}
                                  title="Remove"
                                  onClick={() => handleRemove(row.id)}
                                >
                                  <i className={`bx bx-trash font-size-18`}></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Add / Edit / View Modal (customers & trade customers) */}
          <Modal isOpen={modalOpen} toggle={closeModal} centered size="lg">
            <ModalHeader toggle={closeModal}>
              {modalMode === "view"
                ? "View Profile"
                : modalMode === "edit"
                  ? "Edit Profile"
                  : "Add New Customer"}
            </ModalHeader>
            <ModalBody>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <FormGroup>
                      <Label for="field-first-name">First Name</Label>
                      <Input
                        id="field-first-name"
                        name="first_name"
                        type="text"
                        value={formValues.first_name}
                        onChange={handleFormChange}
                        readOnly={modalMode === "view"}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="field-last-name">Last Name</Label>
                      <Input
                        id="field-last-name"
                        name="last_name"
                        type="text"
                        value={formValues.last_name}
                        onChange={handleFormChange}
                        readOnly={modalMode === "view"}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <FormGroup>
                      <Label for="field-email">Email</Label>
                      <Input
                        id="field-email"
                        name="email"
                        type="email"
                        value={formValues.email}
                        onChange={handleFormChange}
                        readOnly={modalMode === "view"}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="field-tel">Tel</Label>
                      <Input
                        id="field-tel"
                        name="phone"
                        type="text"
                        value={formValues.phone}
                        onChange={handleFormChange}
                        readOnly={modalMode === "view"}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                {modalMode !== "view" && (
                  <>
                    <Row className="mb-3">
                      <Col md={6}>
                        <FormGroup>
                          <Label for="field-password">Password</Label>
                          <Input
                            id="field-password"
                            name="password"
                            type="password"
                            value={formValues.password || ""}
                            onChange={handleFormChange}
                            autoComplete="new-password"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="field-password-confirmation">Password Confirmation</Label>
                          <Input
                            id="field-password-confirmation"
                            name="password_confirmation"
                            type="password"
                            value={formValues.password_confirmation || ""}
                            onChange={handleFormChange}
                            autoComplete="new-password"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={closeModal}>
                Close
              </Button>
              {modalMode !== "view" && (
                <Button color="primary" onClick={handleSave}>
                  Save
                </Button>
              )}
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CustomersBreakdown;
