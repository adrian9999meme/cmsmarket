import React, { useState, useMemo } from "react";
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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

import defaultLogoImg from "../../../images/companies/img-2.png";

const defaultLogo = defaultLogoImg;

// Mock data - no database (MVP)
const MOCK_STORES = [
  {
    id: "ST001",
    storeNumber: "STORE-001",
    name: "HomePro Main Store",
    logo: defaultLogoImg,
    address: "12 High Street, London SW1A 1AA",
    seller: "HomePro Supplies Ltd",
    industry: "Domestic products",
    todaysOrders: 32,
    totalOrders: 1240,
    totalCustomersOrders: 980,
    productsCount: 245,
    open: true,
    openingTime: "08:00",
  },
  {
    id: "ST002",
    storeNumber: "STORE-002",
    name: "ElectroWorld City",
    logo: defaultLogoImg,
    address: "45 Park Lane, Manchester M1 2AB",
    seller: "ElectroWorld Ltd",
    industry: "Electrical products",
    todaysOrders: 18,
    totalOrders: 892,
    totalCustomersOrders: 650,
    productsCount: 310,
    open: false,
    openingTime: "09:30",
  },
  {
    id: "ST003",
    storeNumber: "STORE-003",
    name: "BuildRight Superstore",
    logo: defaultLogoImg,
    address: "78 Queen St, Birmingham B1 1AA",
    seller: "BuildRight Materials",
    industry: "Construction & building materials",
    todaysOrders: 54,
    totalOrders: 2156,
    totalCustomersOrders: 1740,
    productsCount: 520,
    open: true,
    openingTime: "07:30",
  },
];

const initialFormState = {
  storeNumber: "",
  name: "",
  logo: "",
  address: "",
  seller: "",
  industry: "",
  todaysOrders: 0,
  totalOrders: 0,
  totalCustomersOrders: 0,
  productsCount: 0,
  open: true,
  openingTime: "",
};

const StoresBreakdown = () => {
  document.title = "Stores Breakdown | Skote React + Laravel Admin And Dashboard Template";

  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState(MOCK_STORES);
  const [openOnly, setOpenOnly] = useState(true);
  const [sellerFilter, setSellerFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [ordersFilter, setOrdersFilter] = useState("all"); // all | 0-100 | 100-500 | 500+

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formValues, setFormValues] = useState(initialFormState);

  const uniqueSellers = useMemo(
    () => Array.from(new Set(stores.map((s) => s.seller))),
    [stores]
  );
  const uniqueIndustries = useMemo(
    () => Array.from(new Set(stores.map((s) => s.industry))),
    [stores]
  );

  const filteredStores = useMemo(() => {
    let data = [...stores];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (s) =>
          s.storeNumber.toLowerCase().includes(term) ||
          s.name.toLowerCase().includes(term) ||
          s.address.toLowerCase().includes(term)
      );
    }

    if (openOnly) {
      data = data.filter((s) => s.open);
    }

    if (sellerFilter !== "all") {
      data = data.filter((s) => s.seller === sellerFilter);
    }

    if (industryFilter !== "all") {
      data = data.filter((s) => s.industry === industryFilter);
    }

    if (ordersFilter !== "all") {
      data = data.filter((s) => {
        const o = s.totalOrders;
        if (ordersFilter === "0-100") return o >= 0 && o <= 100;
        if (ordersFilter === "100-500") return o > 100 && o <= 500;
        if (ordersFilter === "500+") return o > 500;
        return true;
      });
    }

    return data;
  }, [stores, searchTerm, openOnly, sellerFilter, industryFilter, ordersFilter]);

  const openAddModal = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setFormValues({
      ...initialFormState,
      storeNumber: `STORE-${String(stores.length + 1).padStart(3, "0")}`,
      openingTime: "09:00",
    });
    setModalOpen(true);
  };

  const openViewOrEditModal = (mode, record) => {
    setModalMode(mode);
    setCurrentRecord(record);
    setFormValues({
      storeNumber: record.storeNumber,
      name: record.name,
      logo: record.logo || "",
      address: record.address,
      seller: record.seller,
      industry: record.industry,
      todaysOrders: record.todaysOrders,
      totalOrders: record.totalOrders,
      totalCustomersOrders: record.totalCustomersOrders,
      productsCount: record.productsCount,
      open: record.open,
      openingTime: record.openingTime,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormValues((prev) => ({ ...prev, [name]: checked }));
    } else if (
      name === "todaysOrders" ||
      name === "totalOrders" ||
      name === "totalCustomersOrders" ||
      name === "productsCount"
    ) {
      setFormValues((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (modalMode === "view") {
      setModalOpen(false);
      return;
    }

    if (modalMode === "add") {
      const newStore = {
        id: `ST${String(stores.length + 1).padStart(3, "0")}`,
        storeNumber: formValues.storeNumber,
        name: formValues.name,
        logo: formValues.logo || defaultLogo,
        address: formValues.address,
        seller: formValues.seller,
        industry: formValues.industry,
        todaysOrders: formValues.todaysOrders || 0,
        totalOrders: formValues.totalOrders || 0,
        totalCustomersOrders: formValues.totalCustomersOrders || 0,
        productsCount: formValues.productsCount || 0,
        open: formValues.open,
        openingTime: formValues.openingTime || "09:00",
      };
      setStores((prev) => [...prev, newStore]);
    } else if (modalMode === "edit" && currentRecord) {
      setStores((prev) =>
        prev.map((s) =>
          s.id === currentRecord.id
            ? {
                ...s,
                storeNumber: formValues.storeNumber,
                name: formValues.name,
                logo: formValues.logo || s.logo,
                address: formValues.address,
                seller: formValues.seller,
                industry: formValues.industry,
                todaysOrders: formValues.todaysOrders,
                totalOrders: formValues.totalOrders,
                totalCustomersOrders: formValues.totalCustomersOrders,
                productsCount: formValues.productsCount,
                open: formValues.open,
                openingTime: formValues.openingTime,
              }
            : s
        )
      );
    }
    setModalOpen(false);
  };

  const handleRemove = (id) => {
    if (!window.confirm("Remove this store?")) return;
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleOpenStatus = (id) => {
    setStores((prev) =>
      prev.map((s) => (s.id === id ? { ...s, open: !s.open } : s))
    );
  };

  const ActionIcon = ({ iconClass, title, onClick, colorClass = "text-primary" }) => (
    <Button
      color="link"
      className={`p-1 ${colorClass}`}
      title={title}
      onClick={onClick}
    >
      <i className={`bx ${iconClass} font-size-18`}></i>
    </Button>
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Stores Breakdown" breadcrumbItem="Stores Breakdown" />

          {/* Top bar: search + add */}
          <Row className="mb-3">
            <Col sm={6} className="d-flex align-items-center">
              <InputGroup>
                <Input
                  type="text"
                  placeholder="SEARCH STORES"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </InputGroup>
            </Col>
            <Col sm={6} className="text-end">
              <Button color="primary" onClick={openAddModal}>
                <i className="bx bx-plus me-1"></i> ADD NEW STORE
              </Button>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-3 gy-2 align-items-end">
            <Col md={3}>
              <div className="form-check form-switch">
                <Input
                  className="form-check-input"
                  type="checkbox"
                  id="filter-open-only"
                  checked={openOnly}
                  onChange={(e) => setOpenOnly(e.target.checked)}
                />
                <Label className="form-check-label" htmlFor="filter-open-only">
                  Show Opened Stores (On) / All (Off)
                </Label>
              </div>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Show Stores by Seller</Label>
                <Input
                  type="select"
                  value={sellerFilter}
                  onChange={(e) => setSellerFilter(e.target.value)}
                >
                  <option value="all">All sellers</option>
                  {uniqueSellers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Show Stores by Industry</Label>
                <Input
                  type="select"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                >
                  <option value="all">All industries</option>
                  {uniqueIndustries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Show Stores by Number of Orders</Label>
                <Input
                  type="select"
                  value={ordersFilter}
                  onChange={(e) => setOrdersFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="0-100">0 - 100</option>
                  <option value="100-500">100 - 500</option>
                  <option value="500+">500+</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">Our Stores</h5>
                    <p className="text-muted small mb-0">
                      Total: {filteredStores.length} store{filteredStores.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="table-responsive">
                    <Table className="table table-bordered table-nowrap align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Store #</th>
                          <th>Store Name</th>
                          <th>Address</th>
                          <th>Today's Orders</th>
                          <th>Info</th>
                          <th>Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStores.map((row) => (
                          <tr key={row.id}>
                            <td>{row.storeNumber}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={row.logo}
                                  alt=""
                                  className="rounded me-2"
                                  style={{ width: 32, height: 32, objectFit: "contain" }}
                                  onError={(e) => {
                                    e.target.src = defaultLogoImg;
                                  }}
                                />
                                <span>{row.name}</span>
                              </div>
                            </td>
                            <td>{row.address}</td>
                            <td>{row.todaysOrders}</td>
                            <td>
                              <div className="small">
                                <div>Orders: {row.totalOrders}</div>
                                <div>Customers: {row.totalCustomersOrders}</div>
                                <div>Products: {row.productsCount}</div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-column small">
                                <span
                                  className={
                                    row.open ? "text-success fw-semibold" : "text-muted fw-semibold"
                                  }
                                >
                                  {row.open ? "Opened" : "Closed"}
                                </span>
                                <span className="text-muted">
                                  Opening time today: {row.openingTime}
                                </span>
                                <div className="form-check form-switch mt-1">
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`open-${row.id}`}
                                    checked={row.open}
                                    onChange={() => toggleOpenStatus(row.id)}
                                  />
                                  <Label
                                    className="form-check-label"
                                    htmlFor={`open-${row.id}`}
                                  >
                                    {row.open ? "On" : "Off"}
                                  </Label>
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-1 flex-wrap">
                                <ActionIcon
                                  title="View Profile"
                                  iconClass="bx-user"
                                  onClick={() => openViewOrEditModal("view", row)}
                                />
                                <ActionIcon
                                  title="Edit Profile"
                                  iconClass="bx-edit-alt"
                                  onClick={() => openViewOrEditModal("edit", row)}
                                />
                                <ActionIcon
                                  title="Orders"
                                  iconClass="bx-cart"
                                  onClick={() => {}}
                                />
                                <ActionIcon
                                  title="Products"
                                  iconClass="bx-package"
                                  onClick={() => {}}
                                />
                                <ActionIcon
                                  title="Statistics"
                                  iconClass="bx-bar-chart"
                                  onClick={() => {}}
                                />
                                <ActionIcon
                                  title="Contact Store"
                                  iconClass="bx-envelope"
                                  onClick={() => {}}
                                />
                                <ActionIcon
                                  title="Admin Profiles"
                                  iconClass="bx-user-circle"
                                  onClick={() => {}}
                                />
                                <ActionIcon
                                  title="Block Store"
                                  iconClass="bx-block"
                                  onClick={() => {}}
                                />
                                <ActionIcon
                                  title="Remove Store"
                                  iconClass="bx-trash"
                                  colorClass="text-danger"
                                  onClick={() => handleRemove(row.id)}
                                />
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
        </Container>
      </div>

      {/* Add / Edit / View Store Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal} centered size="lg">
        <ModalHeader toggle={closeModal}>
          {modalMode === "view"
            ? "View Store"
            : modalMode === "edit"
            ? "Edit Store"
            : "Add New Store"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <FormGroup>
                  <Label for="field-storeNumber">Store #</Label>
                  <Input
                    id="field-storeNumber"
                    name="storeNumber"
                    type="text"
                    value={formValues.storeNumber}
                    onChange={handleFormChange}
                    readOnly={modalMode !== "add"}
                  />
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <Label for="field-name">Store Name</Label>
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

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-seller">Seller</Label>
                  <Input
                    id="field-seller"
                    name="seller"
                    type="text"
                    value={formValues.seller}
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
                    placeholder="e.g. domestic products, electrical products"
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

            <Row className="mb-3">
              <Col md={3}>
                <FormGroup>
                  <Label for="field-todaysOrders">Today's Orders</Label>
                  <Input
                    id="field-todaysOrders"
                    name="todaysOrders"
                    type="number"
                    min={0}
                    value={formValues.todaysOrders}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="field-totalOrders">Total Orders</Label>
                  <Input
                    id="field-totalOrders"
                    name="totalOrders"
                    type="number"
                    min={0}
                    value={formValues.totalOrders}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="field-totalCustomersOrders">Customers Orders</Label>
                  <Input
                    id="field-totalCustomersOrders"
                    name="totalCustomersOrders"
                    type="number"
                    min={0}
                    value={formValues.totalCustomersOrders}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="field-productsCount">Products</Label>
                  <Input
                    id="field-productsCount"
                    name="productsCount"
                    type="number"
                    min={0}
                    value={formValues.productsCount}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-0">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-openingTime">Opening Time (today)</Label>
                  <Input
                    id="field-openingTime"
                    name="openingTime"
                    type="time"
                    value={formValues.openingTime}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              {modalMode !== "view" && (
                <Col md={6} className="d-flex align-items-end pb-3">
                  <FormGroup check className="form-switch">
                    <Input
                      type="checkbox"
                      name="open"
                      id="field-open"
                      checked={formValues.open}
                      onChange={handleFormChange}
                    />
                    <Label check htmlFor="field-open">
                      Store Open Today
                    </Label>
                  </FormGroup>
                </Col>
              )}
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
    </React.Fragment>
  );
};

export default StoresBreakdown;

