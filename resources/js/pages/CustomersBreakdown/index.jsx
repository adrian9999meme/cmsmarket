import React, { useState, useMemo, useEffect } from "react";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
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
import { addNewCustomer, deleteCustomer, getCustomers, updateCustomer } from "../../store/actions";

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

  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [tradeCustomers, setTradeCustomers] = useState(MOCK_TRADE_CUSTOMERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [modalType, setModalType] = useState("customers"); // customers | trade
  const [currentRecord, setCurrentRecord] = useState(null);

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
    dispatch(getCustomers());
  }, [dispatch]);

  const initialFormState = {
    id: "",
    name: "",
    email: "",
    tel: "",
    address: "",
    lastLogin: "",
    // trade-specific
    companyName: "",
    industry: "",
    companyAddress: "",
    tradeDiscounts: "",
  };
  const [formValues, setFormValues] = useState(initialFormState);

  const toggleStatus = (type, id) => {
    if (type === "customers") {
      // setCustomers((prev = []) =>
      //   prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
      // );
      const customerToUpdate = customers.find(customer => customer.id === id);
      if (!customerToUpdate) return;
      const updatedCustomer = {
        ...customerToUpdate,
        status: customerToUpdate.status === 'Active' ? 'Blocked' : 'Active'
      };
      console.log("update:", updatedCustomer)
      dispatch(updateCustomer(updatedCustomer));
    } else {
      setTradeCustomers((prev = []) =>
        prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
      );
    }
  };

  const openAddModal = () => {
    const isTrade = activeTab === "trade";
    setModalMode("add");
    setModalType(isTrade ? "trade" : "customers");
    setCurrentRecord(null);
    setFormValues({
      ...initialFormState,
      id: isTrade
        ? `TC${String((tradeCustomers?.length || 0) + 1).padStart(3, "0")}`
        : `C${String((customers?.length || 0) + 1).padStart(3, "0")}`,
    });
    setModalOpen(true);
  };

  const openViewOrEditModal = (type, mode, record) => {
    setModalMode(mode); // view or edit
    setModalType(type); // customers or trade
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

    if (modalType === "customers") {
      if (modalMode === "add") {
        const newCustomer = {
          id: formValues.id || `C${String((customers?.length || 0) + 1).padStart(3, "0")}`,
          name: formValues.name,
          email: formValues.email,
          tel: formValues.tel,
          address: formValues.address,
          lastLogin:
            formValues.lastLogin ||
            new Date().toISOString().slice(0, 16).replace("T", " "),
          orders: 0,
          tickets: 0,
          active: true,
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
          name: formValues.name,
          email: formValues.email,
          phone: formValues.tel,
          address: formValues.address,
          last_login: formValues.lastLogin
        }
        // setCustomers((prev = []) =>
        //   prev.map((c) =>
        //     c.id === currentRecord.id
        //       ? {
        //         ...c,
        //         name: formValues.name,
        //         email: formValues.email,
        //         tel: formValues.tel,
        //         address: formValues.address,
        //         lastLogin: formValues.lastLogin || c.lastLogin,
        //       }
        //       : c
        //   )
        // );
        dispatch(updateCustomer(editCustomer))
      }
    } else {
      // trade customers
      if (modalMode === "add") {
        const newTrade = {
          id: formValues.id || `TC${String((tradeCustomers?.length || 0) + 1).padStart(3, "0")}`,
          name: formValues.name,
          companyName: formValues.companyName,
          industry: formValues.industry,
          companyAddress: formValues.companyAddress,
          last_login:
            formValues.lastLogin ||
            new Date().toISOString().slice(0, 16).replace("T", " "),
          orders: 0,
          tickets: 0,
          tradeDiscounts: formValues.tradeDiscounts || "0%",
          active: true,
        };
        setTradeCustomers((prev = []) => [...prev, newTrade]);
      } else if (modalMode === "edit" && currentRecord) {
        setTradeCustomers((prev = []) =>
          prev.map((c) =>
            c.id === currentRecord.id
              ? {
                ...c,
                name: formValues.name,
                companyName: formValues.companyName,
                industry: formValues.industry,
                companyAddress: formValues.companyAddress,
                last_login: formValues.lastLogin || c.lastLogin,
                tradeDiscounts: formValues.tradeDiscounts || c.tradeDiscounts,
              }
              : c
          )
        );
      }
    }

    setModalOpen(false);
  };

  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers) || customers.length === 0) return [];
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.id?.toLowerCase?.().includes(term) ||
        c.name?.toLowerCase?.().includes(term) ||
        c.email?.toLowerCase?.().includes(term)
    );
  }, [customers, searchTerm]);

  const filteredTradeCustomers = useMemo(() => {
    if (!Array.isArray(tradeCustomers) || tradeCustomers.length === 0) return [];
    if (!searchTerm.trim()) return tradeCustomers;
    const term = searchTerm.toLowerCase();
    return tradeCustomers.filter(
      (c) =>
        c.id?.toLowerCase?.().includes(term) ||
        c.name?.toLowerCase?.().includes(term) ||
        (c.companyName && c.companyName.toLowerCase().includes(term))
    );
  }, [tradeCustomers, searchTerm]);

  const handleRemoveCustomer = (type, id) => {
    if (!window.confirm("Remove this customer?")) return;
    if (type === "customers") {
      dispatch(deleteCustomer(id))
      // setCustomers((prev = []) => Array.isArray(prev) ? prev.filter((c) => c.id !== id) : []);
    }
    else
      setTradeCustomers((prev = []) => Array.isArray(prev) ? prev.filter((c) => c.id !== id) : []);
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

          {/* Toggle: Customers / Trade Customers + count */}
          <Row className="mb-3">
            <Col xs={12}>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <Nav pills className="gap-2 mb-2 mb-sm-0">
                  <NavItem>
                    <NavLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("customers");
                      }}
                      className={
                        "px-4 py-2 rounded-pill fw-semibold d-flex align-items-center" +
                        (activeTab === "customers"
                          ? " bg-primary text-white shadow-sm"
                          : " bg-light text-dark")
                      }
                    >
                      <span>Customers</span>
                      <span className={"badge ms-2 " + (activeTab === "customers" ? "bg-light text-primary" : "bg-secondary")}>
                        {filteredCustomers?.length}
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("trade");
                      }}
                      className={
                        "px-4 py-2 rounded-pill fw-semibold d-flex align-items-center" +
                        (activeTab === "trade"
                          ? " bg-primary text-white shadow-sm"
                          : " bg-light text-dark")
                      }
                    >
                      <span>Trade Customers</span>
                      <span className={"badge ms-2 " + (activeTab === "trade" ? "bg-light text-primary" : "bg-secondary")}>
                        {filteredTradeCustomers.length}
                      </span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <p className="text-muted small mb-0">
                  {activeTab === "customers"
                    ? `Total: ${filteredCustomers?.length} customer${filteredCustomers?.length !== 1 ? "s" : ""}`
                    : `Total: ${filteredTradeCustomers.length} trade customer${filteredTradeCustomers.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  {activeTab === "customers" ? (
                    <div className="table-responsive">
                      <Table className="table table-bordered table-nowrap align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Tel</th>
                            <th>Address</th>
                            <th>Last Login</th>
                            <th>Info</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers && filteredCustomers.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.name}</td>
                              <td>{row.email}</td>
                              <td>{row.phone}</td>
                              <td>{row.address}</td>
                              <td>{row.last_login}</td>
                              <td>
                                <small>
                                  Orders: {row?.orders || 0}, Tickets: {row?.tickets || 0}
                                </small>
                              </td>
                              <td>
                                <div className="form-check form-switch">
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`cust-${row.id}`}
                                    checked={row.status === 'Active'}
                                    onChange={() => toggleStatus("customers", row.id)}
                                  />
                                  <label className="form-check-label" htmlFor={`cust-${row.id}`}>
                                    {row.status === 'Active' ? "Active" : "Blocked"}
                                  </label>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-start gap-1 flex-wrap">
                                  <ActionIcon title="View Profile" iconClass="bx-user" onClick={() => openViewOrEditModal("customers", "view", row)} />
                                  <ActionIcon title="Edit Profile" iconClass="bx-edit-alt" onClick={() => openViewOrEditModal("customers", "edit", row)} />
                                  <ActionIcon title="Orders" iconClass="bx-cart" onClick={() => { }} />
                                  <ActionIcon title="Tickets" iconClass="bx-support" onClick={() => { }} />
                                  <ActionIcon title="Contact Customer" iconClass="bx-envelope" onClick={() => { }} />
                                  <ActionIcon title="Remove" iconClass="bx-trash" colorClass="text-danger" onClick={() => handleRemoveCustomer("customers", row.id)} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table table-bordered table-nowrap align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Company Name</th>
                            <th>Company Address</th>
                            <th>Last Login</th>
                            <th>Info</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTradeCustomers && filteredTradeCustomers.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.name}</td>
                              <td>
                                <div>
                                  <strong>{row.companyName}</strong>
                                  <br />
                                  <small className="text-muted">{row.industry}</small>
                                </div>
                              </td>
                              <td>{row.companyAddress}</td>
                              <td>{row.lastLogin}</td>
                              <td>
                                <small>
                                  Orders: {row.orders}, Tickets: {row.tickets}, Trade Discounts: {row.tradeDiscounts}
                                </small>
                              </td>
                              <td>
                                <div className="form-check form-switch">
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`trade-${row.id}`}
                                    checked={row.active}
                                    onChange={() => toggleStatus("trade", row.id)}
                                  />
                                  <label className="form-check-label" htmlFor={`trade-${row.id}`}>
                                    {row.active ? "Active" : "Blocked"}
                                  </label>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-start gap-1 flex-wrap">
                                  <ActionIcon title="View Profile" iconClass="bx-user" onClick={() => openViewOrEditModal("trade", "view", row)} />
                                  <ActionIcon title="Edit Profile" iconClass="bx-edit-alt" onClick={() => openViewOrEditModal("trade", "edit", row)} />
                                  <ActionIcon title="Orders" iconClass="bx-cart" onClick={() => { }} />
                                  <ActionIcon title="Products" iconClass="bx-package" onClick={() => { }} />
                                  <ActionIcon title="Statistics" iconClass="bx-bar-chart" onClick={() => { }} />
                                  <ActionIcon title="Contact Store" iconClass="bx-envelope" onClick={() => { }} />
                                  <ActionIcon title="Admin Profiles" iconClass="bx-user-circle" onClick={() => { }} />
                                  <ActionIcon title="Block Store" iconClass="bx-block" onClick={() => { }} />
                                  <ActionIcon title="Remove Store" iconClass="bx-trash" colorClass="text-danger" onClick={() => handleRemoveCustomer("trade", row.id)} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
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
                  <Col md={4}>
                    <FormGroup>
                      <Label for="field-id">Customer ID</Label>
                      <Input
                        id="field-id"
                        name="id"
                        type="text"
                        value={formValues.id}
                        onChange={handleFormChange}
                        readOnly={modalMode !== "add"}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={8}>
                    <FormGroup>
                      <Label for="field-name">Customer Name</Label>
                      <Input
                        id="field-name"
                        name="name"
                        type="text"
                        value={formValues.name}
                        onChange={handleFormChange}
                        readOnly={modalMode === "view"}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {modalType === "customers" ? (
                  <>
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
                            name="tel"
                            type="text"
                            value={formValues.tel}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={12}>
                        <FormGroup>
                          <Label for="field-address">Address</Label>
                          <Input
                            id="field-address"
                            name="address"
                            type="text"
                            value={formValues.address}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <Row className="mb-3">
                      <Col md={6}>
                        <FormGroup>
                          <Label for="field-companyName">Company Name</Label>
                          <Input
                            id="field-companyName"
                            name="companyName"
                            type="text"
                            value={formValues.companyName}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="field-industry">Industry</Label>
                          <Input
                            id="field-industry"
                            name="industry"
                            type="text"
                            value={formValues.industry}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={12}>
                        <FormGroup>
                          <Label for="field-companyAddress">Company Address</Label>
                          <Input
                            id="field-companyAddress"
                            name="companyAddress"
                            type="text"
                            value={formValues.companyAddress}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <FormGroup>
                          <Label for="field-email-trade">Contact Email</Label>
                          <Input
                            id="field-email-trade"
                            name="email"
                            type="email"
                            value={formValues.email || ""}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="field-tel-trade">Contact Tel</Label>
                          <Input
                            id="field-tel-trade"
                            name="tel"
                            type="text"
                            value={formValues.tel || ""}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <FormGroup>
                          <Label for="field-tradeDiscounts">Trade Discounts</Label>
                          <Input
                            id="field-tradeDiscounts"
                            name="tradeDiscounts"
                            type="text"
                            value={formValues.tradeDiscounts}
                            onChange={handleFormChange}
                            readOnly={modalMode === "view"}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </>
                )}

                <Row className="mb-0">
                  <Col md={6}>
                    <FormGroup>
                      <Label for="field-lastLogin">Last Login</Label>
                      <Input
                        id="field-lastLogin"
                        name="lastLogin"
                        type="text"
                        value={formValues.lastLogin}
                        onChange={handleFormChange}
                        readOnly={modalMode === "view"}
                      />
                    </FormGroup>
                  </Col>
                </Row>
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
