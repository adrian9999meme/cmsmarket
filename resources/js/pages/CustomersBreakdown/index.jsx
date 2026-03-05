import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { addNewCustomer, deleteCustomer, getCustomers, setActiveCustomer, setTradeApproved, setTradeRejected, updateCustomer } from "../../store/actions";
import defaultCustomerImg from '../../../images/default/user.jpg'

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
  password: "",
  password_confirmation: "",
  vat_number: '',
  registration_number: '',
  company_name: ''
};

const CustomersBreakdown = () => {
  document.title = "Customers Breakdown | LEKIT Ltd";

  const dispatch = useDispatch();
  const { subdomain = "all" } = useParams();

  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [customerType, setCustomerType] = useState("regular"); // regular | trade
  const [currentRecord, setCurrentRecord] = useState(null);
  const [query, setQuery] = useState({
    subdomain: "all",
    searchKeyword: ""
  });

  // Selector for customers and blocked customers from the redux store
  const ecommerceSelector = createSelector(
    state => state.ecommerce,
    ecommerce => ({
      allcustomers: ecommerce.customers,
    })
  );
  const { allcustomers } = useSelector(ecommerceSelector);

  // Keep a ref to ensure latest value of query
  const queryRef = useRef(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  // Keep query.subdomain in sync with url subdomain param
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      subdomain: typeof subdomain === "string" ? subdomain.trim().toLowerCase() : "all"
    }));
    subdomain === "trade" ? setCustomerType("trade") : setCustomerType("regular")
  }, [subdomain]);

  // Sync customers list from store to local state depending on current subdomain
  useEffect(() => {
    setCustomers(Array.isArray(allcustomers) ? allcustomers : []);
    if (query.subdomain === "add") {
      setModalOpen(true);
    }
  }, [query.subdomain, allcustomers]);

  // Fetch customers when subdomain or search changes
  useEffect(() => {
    dispatch(getCustomers({
      ...queryRef.current,
      customer_type: customerType
    }));
  }, [query.subdomain, dispatch]);

  const [formValues, setFormValues] = useState(initialFormState);

  const toggleStatus = (id) => {
    const customerToUpdate = customers.find(customer => customer.id === id);
    if (!customerToUpdate) return;
    const updatedCustomer = {
      ...customerToUpdate,
      status: customerToUpdate.user?.status === 1 ? 0 : 1
    };
    dispatch(setActiveCustomer(updatedCustomer));
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setFormValues({ ...initialFormState });
    setModalOpen(true);
  };

  const openViewOrEditModal = (mode, record) => {
    setModalMode(mode); // view or edit
    setCurrentRecord(record);
    setFormValues({
      ...initialFormState,
      ...(record?.user || {}),
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
        vat_number: formValues.vat_number || "",
        registration_number: formValues.registration_number || "",
        company_name: formValues.company_name || "",
      };
      dispatch(addNewCustomer(newCustomer));
    } else if (modalMode === "edit" && currentRecord) {
      const filteredCustomer = customers.filter(
        customer => String(customer.id) === String(currentRecord.id)
      );
      if (filteredCustomer.length === 0) return;
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
        vat_number: formValues.vat_number || "",
        registration_number: formValues.registration_number || "",
        company_name: formValues.company_name || "",
      };
      dispatch(updateCustomer(editCustomer));
    }
    // Optionally: setModalOpen(false);
  };

  const handleRemove = (id) => {
    if (!window.confirm("Remove this customer?")) return;
    dispatch(deleteCustomer(id));
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
                  value={query.searchKeyword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuery(prevQuery => ({
                      ...prevQuery,
                      searchKeyword: value,
                    }));
                  }}
                  className="form-control"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      dispatch(getCustomers({ ...queryRef.current, customer_type: customerType }))
                    }
                  }}
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
                          {customerType === 'trade' &&
                            <>
                              <th>Company Name</th>
                              <th>VAT Number</th>
                              <th>Registration Number</th>
                              <th>Trade Status</th>
                              <th>Trade Options</th>
                            </>
                          }
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
                                    src={row.user?.profile_image || defaultCustomerImg}
                                    className="rounded me-2"
                                    alt=""
                                    style={{ width: 36, height: 36, objectFit: "contain" }}
                                  />
                                </div>
                                <div>
                                  <p className="mb-1">{row.user?.full_name}</p>
                                  <p className="mb-1">{row.user?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <strong>{row.user?.phone || '-'}</strong>
                              </div>
                            </td>
                            <td className="text-center">{row.user?.balance || '-'}</td>
                            <td className="text-center">{row.user?.last_login || '-'}</td>
                            {customerType === 'trade' &&
                              <>
                                <td className="text-center">{row.company_name || '-'}</td>
                                <td className="text-center">{row.vat_number || '-'}</td>
                                <td className="text-center">{row.registration_number || '-'}</td>
                                <td className="text-center text-white">
                                  <span className={`rounded-pill px-2 ${!!row.trade_status && row.trade_status === 'approved' ? 'bg-success' : row.trade_status === 'pending' ? 'bg-primary' : 'bg-danger'}`}>
                                    {row.trade_status || '-'}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <div className="d-flex justify-content-center gap-3">
                                    <Button
                                      color="link"
                                      className="p-1"
                                      title="Trade Approved"
                                      onClick={() => dispatch(setTradeApproved(row))}
                                    >
                                      <i className="bx bx-check-circle text-success font-size-24"></i>
                                    </Button>
                                    <Button
                                      color="link"
                                      className="p-1"
                                      title="Trade Rejected"
                                      onClick={() => dispatch(setTradeRejected(row))}
                                    >
                                      <i className="bx bx-x-circle text-danger font-size-24"></i>
                                    </Button>
                                  </div>
                                </td>
                              </>
                            }
                            <td>
                              <div className="form-check form-switch">
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`trade-${row.id}`}
                                  checked={row.user?.status === 1}
                                  onClick={() => toggleStatus(row.id)}
                                />
                                <label className="form-check-label" htmlFor={`trade-${row.id}`}>
                                  {row.user?.status ? "Active" : "Blocked"}
                                </label>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-1 flex-wrap">
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
                        {customers.length === 0 && (
                          <tr>
                            <td colSpan="100%" className="text-center">
                              Not Found
                            </td>
                          </tr>
                        )}
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

                {customerType === "trade" && (
                  <>
                    <Row className="mb-3">
                      <Col md={6}>
                        <FormGroup>
                          <Label for="field-email">VAT Number</Label>
                          <Input
                            id="field-email"
                            name="vat_number"
                            type="text"
                            value={formValues.vat_number}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="field-tel">Registration Number</Label>
                          <Input
                            id="field-tel"
                            name="registration_number"
                            type="text"
                            value={formValues.registration_number}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <FormGroup>
                          <Label for="field-company-name">Company Name</Label>
                          <Input
                            id="field-company-name"
                            name="company_name"
                            type="text"
                            value={formValues.company_name}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </>
                )}

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
