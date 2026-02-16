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

// Updated Mock data - no database (MVP) to the new format
const MOCK_STORES = [
  {
    seller_id: "SELLER001",
    user_id: "USER001",
    store_name: "HomePro Main Store",
    slug: "homepro-main-store",
    store_phone: "+44 1234 567890",
    store_email: "info@homepro.com",
    address: "12 High Street, London SW1A 1AA",
    city: "London",
    postcode: "SW1A 1AA",
    status: "open",
    opening_hours: "08:00",
    logo: defaultLogoImg,
    todaysOrders: 32,
    totalOrders: 1240,
    totalCustomersOrders: 980,
    productsCount: 245,
  },
  {
    seller_id: "SELLER002",
    user_id: "USER002",
    store_name: "ElectroWorld City",
    slug: "electroworld-city",
    store_phone: "+44 5678 123456",
    store_email: "contact@electroworld.com",
    address: "45 Park Lane, Manchester M1 2AB",
    city: "Manchester",
    postcode: "M1 2AB",
    status: "closed",
    opening_hours: "09:30",
    logo: defaultLogoImg,
    todaysOrders: 18,
    totalOrders: 892,
    totalCustomersOrders: 650,
    productsCount: 310,
  },
  {
    seller_id: "SELLER003",
    user_id: "USER003",
    store_name: "BuildRight Superstore",
    slug: "buildright-superstore",
    store_phone: "+44 9876 543210",
    store_email: "sales@buildright.com",
    address: "78 Queen St, Birmingham B1 1AA",
    city: "Birmingham",
    postcode: "B1 1AA",
    status: "open",
    opening_hours: "07:30",
    logo: defaultLogoImg,
    todaysOrders: 54,
    totalOrders: 2156,
    totalCustomersOrders: 1740,
    productsCount: 520,
  },
];

const format = {
  seller_id: "",
  user_id: "",
  store_name: "",
  slug: "",
  store_phone: "",
  store_email: "",
  address: "",
  city: "",
  postcode: "",
  status: "",
  opening_hours: "",
};

const initialFormState = {
  seller_id: "",
  user_id: "",
  store_name: "",
  slug: "",
  store_phone: "",
  store_email: "",
  address: "",
  city: "",
  postcode: "",
  status: "open",
  opening_hours: "",
  logo: "",
  todaysOrders: 0,
  totalOrders: 0,
  totalCustomersOrders: 0,
  productsCount: 0,
};

const StoresBreakdown = () => {
  document.title = "Stores Breakdown | LEKIT Ltd";

  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState(MOCK_STORES);
  const [openOnly, setOpenOnly] = useState(true);
  const [sellerFilter, setSellerFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [ordersFilter, setOrdersFilter] = useState("all"); // all | 0-100 | 100-500 | 500+

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formValues, setFormValues] = useState(initialFormState);

  const uniqueSellers = useMemo(
    () => Array.from(new Set(stores.map((s) => s.seller_id))),
    [stores]
  );
  const uniqueCities = useMemo(
    () => Array.from(new Set(stores.map((s) => s.city))),
    [stores]
  );

  const filteredStores = useMemo(() => {
    let data = [...stores];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (s) =>
          s.store_name.toLowerCase().includes(term) ||
          (s.address && s.address.toLowerCase().includes(term)) ||
          (s.store_email && s.store_email.toLowerCase().includes(term))
      );
    }

    if (openOnly) {
      data = data.filter((s) => s.status === "open");
    }

    if (sellerFilter !== "all") {
      data = data.filter((s) => s.seller_id === sellerFilter);
    }

    if (cityFilter !== "all") {
      data = data.filter((s) => s.city === cityFilter);
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
  }, [stores, searchTerm, openOnly, sellerFilter, cityFilter, ordersFilter]);

  const openAddModal = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setFormValues({
      ...initialFormState,
      slug: `store-${stores.length + 1}`,
      opening_hours: "09:00",
      status: "open",
    });
    setModalOpen(true);
  };

  const openViewOrEditModal = (mode, record) => {
    setModalMode(mode);
    setCurrentRecord(record);
    setFormValues({
      seller_id: record.seller_id,
      user_id: record.user_id,
      store_name: record.store_name,
      slug: record.slug,
      store_phone: record.store_phone,
      store_email: record.store_email,
      address: record.address,
      city: record.city,
      postcode: record.postcode,
      status: record.status,
      opening_hours: record.opening_hours,
      logo: record.logo || "",
      todaysOrders: record.todaysOrders,
      totalOrders: record.totalOrders,
      totalCustomersOrders: record.totalCustomersOrders,
      productsCount: record.productsCount,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormValues((prev) => ({ ...prev, [name]: checked ? "open" : "closed" }));
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
        seller_id: formValues.seller_id,
        user_id: formValues.user_id,
        store_name: formValues.store_name,
        slug: formValues.slug,
        store_phone: formValues.store_phone,
        store_email: formValues.store_email,
        address: formValues.address,
        city: formValues.city,
        postcode: formValues.postcode,
        status: formValues.status || "open",
        opening_hours: formValues.opening_hours || "09:00",
        logo: formValues.logo || defaultLogo,
        todaysOrders: formValues.todaysOrders || 0,
        totalOrders: formValues.totalOrders || 0,
        totalCustomersOrders: formValues.totalCustomersOrders || 0,
        productsCount: formValues.productsCount || 0,
      };
      setStores((prev) => [...prev, newStore]);
    } else if (modalMode === "edit" && currentRecord) {
      setStores((prev) =>
        prev.map((s) =>
          s.slug === currentRecord.slug
            ? {
                ...s,
                seller_id: formValues.seller_id,
                user_id: formValues.user_id,
                store_name: formValues.store_name,
                slug: formValues.slug,
                store_phone: formValues.store_phone,
                store_email: formValues.store_email,
                address: formValues.address,
                city: formValues.city,
                postcode: formValues.postcode,
                status: formValues.status,
                opening_hours: formValues.opening_hours,
                logo: formValues.logo || s.logo,
                todaysOrders: formValues.todaysOrders,
                totalOrders: formValues.totalOrders,
                totalCustomersOrders: formValues.totalCustomersOrders,
                productsCount: formValues.productsCount,
              }
            : s
        )
      );
    }
    setModalOpen(false);
  };

  const handleRemove = (slug) => {
    if (!window.confirm("Remove this store?")) return;
    setStores((prev) => prev.filter((s) => s.slug !== slug));
  };

  const toggleOpenStatus = (slug) => {
    setStores((prev) =>
      prev.map((s) =>
        s.slug === slug ? { ...s, status: s.status === "open" ? "closed" : "open" } : s
      )
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
                <Label>Show Stores by City</Label>
                <Input
                  type="select"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <option value="all">All cities</option>
                  {uniqueCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
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
                          <th>Store Name</th>
                          <th>Address</th>
                          <th>City</th>
                          <th>Status</th>
                          <th>Opening Hours</th>
                          <th>Today's Orders</th>
                          <th>Info</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStores.map((row) => (
                          <tr key={row.slug}>
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
                                <span>{row.store_name}</span>
                              </div>
                            </td>
                            <td>{row.address}</td>
                            <td>{row.city}</td>
                            <td>
                              <div className="d-flex flex-column small">
                                <span
                                  className={
                                    row.status === "open"
                                      ? "text-success fw-semibold"
                                      : "text-muted fw-semibold"
                                  }
                                >
                                  {row.status === "open" ? "Opened" : "Closed"}
                                </span>
                                <div className="form-check form-switch mt-1">
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`open-${row.slug}`}
                                    checked={row.status === "open"}
                                    onChange={() => toggleOpenStatus(row.slug)}
                                  />
                                  <Label
                                    className="form-check-label"
                                    htmlFor={`open-${row.slug}`}
                                  >
                                    {row.status === "open" ? "On" : "Off"}
                                  </Label>
                                </div>
                              </div>
                            </td>
                            <td>{row.opening_hours}</td>
                            <td>{row.todaysOrders}</td>
                            <td>
                              <div className="small">
                                <div>Orders: {row.totalOrders}</div>
                                <div>Customers: {row.totalCustomersOrders}</div>
                                <div>Products: {row.productsCount}</div>
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
                                  title="Remove Store"
                                  iconClass="bx-trash"
                                  colorClass="text-danger"
                                  onClick={() => handleRemove(row.slug)}
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
              <Col md={6}>
                <FormGroup>
                  <Label for="field-store_name">Store Name</Label>
                  <Input
                    id="field-store_name"
                    name="store_name"
                    type="text"
                    value={formValues.store_name}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-seller_id">Seller ID</Label>
                  <Input
                    id="field-seller_id"
                    name="seller_id"
                    type="text"
                    value={formValues.seller_id}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-store_phone">Phone</Label>
                  <Input
                    id="field-store_phone"
                    name="store_phone"
                    type="text"
                    value={formValues.store_phone}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-store_email">Email</Label>
                  <Input
                    id="field-store_email"
                    name="store_email"
                    type="email"
                    value={formValues.store_email}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <FormGroup>
                  <Label for="field-city">City</Label>
                  <Input
                    id="field-city"
                    name="city"
                    type="text"
                    value={formValues.city}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="field-postcode">Postcode</Label>
                  <Input
                    id="field-postcode"
                    name="postcode"
                    type="text"
                    value={formValues.postcode}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="field-opening_hours">Opening Hours</Label>
                  <Input
                    id="field-opening_hours"
                    name="opening_hours"
                    type="time"
                    value={formValues.opening_hours}
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

            {modalMode !== "view" && (
              <Row>
                <Col md={6} className="d-flex align-items-end pb-3">
                  <FormGroup check className="form-switch">
                    <Input
                      type="checkbox"
                      name="status"
                      id="field-status"
                      checked={formValues.status === "open"}
                      onChange={handleFormChange}
                    />
                    <Label check htmlFor="field-status">
                      Store Open Today
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
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
    </React.Fragment>
  );
};

export default StoresBreakdown;
