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

import defaultLogoImg from "../../../images/companies/img-1.png";

// Placeholder logo - in real app would be seller logo URL
const defaultLogo = defaultLogoImg;

// Mock data - no database (MVP)
const MOCK_SELLERS = [
  {
    id: "S001",
    sellerNumber: "SEL-001",
    companyName: "HomePro Supplies Ltd",
    companyLogo: defaultLogoImg,
    director: {
      name: "James Wilson",
      position: "Managing Director",
      email: "j.wilson@homepro.co.uk",
      tel: "+44 7700 900100",
    },
    industry: "Domestic products",
    storesCount: 5,
    lastLogin: "2024-01-16 09:22",
    orders: 1240,
    published: true,
  },
  {
    id: "S002",
    sellerNumber: "SEL-002",
    companyName: "ElectroWorld Ltd",
    companyLogo: defaultLogoImg,
    director: {
      name: "Sarah Mitchell",
      position: "Sales Director",
      email: "s.mitchell@electroworld.com",
      tel: "+44 7700 900200",
    },
    industry: "Electrical products",
    storesCount: 3,
    lastLogin: "2024-01-15 14:18",
    orders: 892,
    published: true,
  },
  {
    id: "S003",
    sellerNumber: "SEL-003",
    companyName: "BuildRight Materials",
    companyLogo: defaultLogoImg,
    director: {
      name: "David Clarke",
      position: "Operations Manager",
      email: "d.clarke@buildright.co.uk",
      tel: "+44 7700 900300",
    },
    industry: "Construction & building materials",
    storesCount: 8,
    lastLogin: "2024-01-14 11:05",
    orders: 2156,
    published: false,
  },
];

const initialFormState = {
  sellerNumber: "",
  companyName: "",
  companyLogo: "",
  directorName: "",
  directorPosition: "",
  directorEmail: "",
  directorTel: "",
  industry: "",
  storesCount: 0,
  lastLogin: "",
  orders: 0,
  published: true,
};

const SellersBreakdown = () => {
  document.title = "Sellers Breakdown | LEKIT Ltd";

  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState(MOCK_SELLERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formValues, setFormValues] = useState(initialFormState);

  const togglePublish = (id) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, published: !s.published } : s))
    );
  };

  const filteredSellers = useMemo(() => {
    if (!searchTerm.trim()) return sellers;
    const term = searchTerm.toLowerCase();
    return sellers.filter(
      (s) =>
        s.sellerNumber.toLowerCase().includes(term) ||
        s.companyName.toLowerCase().includes(term) ||
        s.director.name.toLowerCase().includes(term) ||
        s.industry.toLowerCase().includes(term)
    );
  }, [sellers, searchTerm]);

  const openAddModal = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setFormValues({
      ...initialFormState,
      sellerNumber: `SEL-${String(sellers.length + 1).padStart(3, "0")}`,
    });
    setModalOpen(true);
  };

  const openViewOrEditModal = (mode, record) => {
    setModalMode(mode);
    setCurrentRecord(record);
    setFormValues({
      sellerNumber: record.sellerNumber,
      companyName: record.companyName,
      companyLogo: record.companyLogo || "",
      directorName: record.director.name,
      directorPosition: record.director.position,
      directorEmail: record.director.email,
      directorTel: record.director.tel,
      industry: record.industry,
      storesCount: record.storesCount,
      lastLogin: record.lastLogin,
      orders: record.orders,
      published: record.published,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const parsed = name === "storesCount" || name === "orders" ? parseInt(value, 10) || 0 : value;
    setFormValues((prev) => ({ ...prev, [name]: parsed }));
  };

  const handleSave = () => {
    if (modalMode === "view") {
      setModalOpen(false);
      return;
    }

    if (modalMode === "add") {
      const newSeller = {
        id: `S${String(sellers.length + 1).padStart(3, "0")}`,
        sellerNumber: formValues.sellerNumber,
        companyName: formValues.companyName,
        companyLogo: formValues.companyLogo || defaultLogoImg,
        director: {
          name: formValues.directorName,
          position: formValues.directorPosition,
          email: formValues.directorEmail,
          tel: formValues.directorTel,
        },
        industry: formValues.industry,
        storesCount: formValues.storesCount || 0,
        lastLogin: formValues.lastLogin || new Date().toISOString().slice(0, 16).replace("T", " "),
        orders: formValues.orders || 0,
        published: formValues.published,
      };
      setSellers((prev) => [...prev, newSeller]);
    } else if (modalMode === "edit" && currentRecord) {
      setSellers((prev) =>
        prev.map((s) =>
          s.id === currentRecord.id
            ? {
                ...s,
                sellerNumber: formValues.sellerNumber,
                companyName: formValues.companyName,
                companyLogo: formValues.companyLogo || defaultLogoImg || s.companyLogo,
                director: {
                  name: formValues.directorName,
                  position: formValues.directorPosition,
                  email: formValues.directorEmail,
                  tel: formValues.directorTel,
                },
                industry: formValues.industry,
                storesCount: formValues.storesCount,
                lastLogin: formValues.lastLogin,
                orders: formValues.orders,
                published: formValues.published,
              }
            : s
        )
      );
    }
    setModalOpen(false);
  };

  const handleRemove = (id) => {
    if (window.confirm("Remove this seller?")) {
      setSellers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Reusable action icon – title on hover for tooltip
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
          <Breadcrumbs title="Sellers Breakdown" breadcrumbItem="Sellers Breakdown" />

          <Row className="mb-3">
            <Col sm={6} className="d-flex align-items-center">
              <InputGroup>
                <Input
                  type="text"
                  placeholder="SEARCH SELLER"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </InputGroup>
            </Col>
            <Col sm={6} className="text-end">
              <Button color="primary" onClick={openAddModal}>
                <i className="bx bx-plus me-1"></i> ADD NEW SELLER
              </Button>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <h5 className="card-title mb-3">Our Sellers</h5>
                  <div className="table-responsive">
                    <Table className="table table-bordered table-nowrap align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Seller #</th>
                          <th>Company Name</th>
                          <th>Director / Manager</th>
                          <th>Industry</th>
                          <th>Stats</th>
                          <th>Seller Publish</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSellers.map((row) => (
                          <tr key={row.id}>
                            <td>{row.sellerNumber}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={row.companyLogo}
                                  alt=""
                                  className="rounded me-2"
                                  style={{ width: 36, height: 36, objectFit: "contain" }}
                                  onError={(e) => {
                                    e.target.src = defaultLogoImg;
                                  }}
                                />
                                <span>{row.companyName}</span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-column small">
                                <span className="fw-medium">{row.director.name}</span>
                                <span className="text-muted">{row.director.position}</span>
                                <span>{row.director.email}</span>
                                <span>{row.director.tel}</span>
                              </div>
                            </td>
                            <td>{row.industry}</td>
                            <td>
                              <div className="small">
                                <div>Stores: {row.storesCount}</div>
                                <div>Last Login: {row.lastLogin}</div>
                                <div>Orders: {row.orders}</div>
                              </div>
                            </td>
                            <td>
                              <div className="form-check form-switch">
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`pub-${row.id}`}
                                  checked={row.published}
                                  onChange={() => togglePublish(row.id)}
                                />
                                <label className="form-check-label" htmlFor={`pub-${row.id}`}>
                                  {row.published ? "On" : "Off"}
                                </label>
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-1 flex-wrap">
                                <ActionIcon
                                  iconClass="bx-user"
                                  title="View Profile"
                                  onClick={() => openViewOrEditModal("view", row)}
                                />
                                <ActionIcon
                                  iconClass="bx-edit-alt"
                                  title="Edit Profile"
                                  onClick={() => openViewOrEditModal("edit", row)}
                                />
                                <ActionIcon iconClass="bx-folder" title="Company Files" onClick={() => {}} />
                                <ActionIcon iconClass="bx-store" title="Stores" onClick={() => {}} />
                                <ActionIcon iconClass="bx-envelope" title="Contact Director" onClick={() => {}} />
                                <ActionIcon
                                  iconClass="bx-trash"
                                  title="Remove"
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

      <Modal isOpen={modalOpen} toggle={closeModal} centered size="lg">
        <ModalHeader toggle={closeModal}>
          {modalMode === "view" ? "View Profile" : modalMode === "edit" ? "Edit Profile" : "Add New Seller"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <FormGroup>
                  <Label for="field-sellerNumber">Seller #</Label>
                  <Input
                    id="field-sellerNumber"
                    name="sellerNumber"
                    type="text"
                    value={formValues.sellerNumber}
                    onChange={handleFormChange}
                    readOnly={modalMode !== "add"}
                  />
                </FormGroup>
              </Col>
              <Col md={8}>
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
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-directorName">Director / Manager Name</Label>
                  <Input
                    id="field-directorName"
                    name="directorName"
                    type="text"
                    value={formValues.directorName}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-directorPosition">Position</Label>
                  <Input
                    id="field-directorPosition"
                    name="directorPosition"
                    type="text"
                    value={formValues.directorPosition}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-directorEmail">Email</Label>
                  <Input
                    id="field-directorEmail"
                    name="directorEmail"
                    type="email"
                    value={formValues.directorEmail}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-directorTel">Tel</Label>
                  <Input
                    id="field-directorTel"
                    name="directorTel"
                    type="text"
                    value={formValues.directorTel}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
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
              <Col md={3}>
                <FormGroup>
                  <Label for="field-storesCount">Stores</Label>
                  <Input
                    id="field-storesCount"
                    name="storesCount"
                    type="number"
                    min={0}
                    value={formValues.storesCount}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="field-orders">Orders</Label>
                  <Input
                    id="field-orders"
                    name="orders"
                    type="number"
                    min={0}
                    value={formValues.orders}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

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
              {modalMode !== "view" && (
                <Col md={6} className="d-flex align-items-end pb-3">
                  <FormGroup check className="form-switch">
                    <Input
                      type="checkbox"
                      name="published"
                      id="field-published"
                      checked={formValues.published}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, published: e.target.checked }))
                      }
                    />
                    <Label check for="field-published">
                      Seller Published
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

export default SellersBreakdown;
