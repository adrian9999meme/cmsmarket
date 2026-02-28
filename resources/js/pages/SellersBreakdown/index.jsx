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
} from "reactstrap";

import { addNewSellerRequest, deleteSellerRequest, editSellerRequest, getSellersRequest } from "../../store/actions";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import defaultLogoImg from "../../../images/companies/img-1.png";

// Placeholder logo - in real app would be seller logo URL

const initialFormState = {
  company_name: "",
  address: "",
  postcode: "",
  city: "",
  phone_no: "",
  company_email: "",
  license_no: "",
  company_website: "",
  company_type: "",
  number_employees: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
  status: 0,
};

const SellersBreakdown = () => {

  document.title = "Sellers Breakdown | LEKIT Ltd";

  const { status } = useParams();
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formValues, setFormValues] = useState(initialFormState);
  const [query, setQuery] = useState({
    status: 'all',
    searchKeyword: ''
  })

  const ecommerceSelector = createSelector(
    state => state.ecommerce,
    ecommerce => ({
      allsellers: ecommerce.sellers,
    })
  );
  const { allsellers } = useSelector(ecommerceSelector);

  useEffect(() => {
    setSellers(allsellers)
  }, [allsellers]);

  useEffect(() => {
    if (status === 'all') {
      setQuery({ ...query, status: '' })
      dispatch(getSellersRequest(query));
    } else if (status === 'pending') {
      setQuery({ ...query, status: 'pending' })
      dispatch(getSellersRequest(query));
    } else if (status === 'blocked') {
      setQuery({ ...query, status: 'blocked' })
      dispatch(getSellersRequest(query));
    } else if (status === 'add') {

    }
  }, [dispatch]);

  const togglePublish = (id) => {
    const seller = sellers.find(seller => seller.seller_profile.id === id);
    if (seller) {
      const updatedSeller = { ...seller, status: !seller.status };
      // dispatch(editSellerRequest(updatedSeller));
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setFormValues({
      ...initialFormState,
    });
    setModalOpen(true);
  };

  const openViewOrEditModal = (mode, row) => {
    const record = sellers.find(s => s.seller_profile.id === row.seller_profile.id)
    setModalMode(mode);
    setCurrentRecord(record);
    setFormValues({
      company_name: record.seller_profile?.company_name || "",
      address: record.seller_profile?.address || "",
      postcode: record.seller_profile?.postcode || "",
      city: record.seller_profile?.city || "",
      phone_no: record.seller_profile?.phone_no || "",
      company_email: record.seller_profile?.company_email || "",
      license_no: record.seller_profile?.license_no || "",
      company_website: record.seller_profile?.company_website || "",
      company_type: record.seller_profile?.company_type || "",
      number_employees: record.seller_profile?.number_employees || "",
      status: record.seller_profile.status,
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      phone: record.phone,
      password: '',
      password_confirmation: ''
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (modalMode === "view") {
      setModalOpen(true);
      return;
    }

    if (modalMode === "add") {
      const newSeller = {
        company_name: formValues.company_name || "",
        address: formValues.address || "",
        postcode: formValues.postcode || "",
        city: formValues.city || "",
        phone_no: formValues.phone_no || "",
        company_email: formValues.company_email || "",
        license_no: formValues.license_no || "",
        company_website: formValues.company_website || "",
        company_type: formValues.company_type || "",
        number_employees: formValues.number_employees || "",
        status: formValues.status,
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        phone: formValues.phone,
        password: formValues.password,
        password_confirmation: formValues.password_confirmation
      };

      // dispatch(addNewSellerRequest(newSeller))
    } else if (modalMode === "edit" && currentRecord) {
      const seller = sellers.find(item => item.seller_profile.id === currentRecord.seller_profile.id)
      let updatedSeller = {
        ...seller,
        company_name: formValues.company_name,
        address: formValues.address,
        postcode: formValues.postcode,
        city: formValues.city,
        phone_no: formValues.phone_no,
        company_email: formValues.company_email,
        license_no: formValues.license_no,
        company_website: formValues.company_website,
        company_type: formValues.company_type,
        number_employees: formValues.number_employees,
        status: formValues.status,
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        phone: formValues.phone,
        password: formValues.password,
        password_confirmation: formValues.password_confirmation
      }

      // dispatch(editSellerRequest(updatedSeller))
    }
    // setModalOpen(false);
  };

  const handleRemove = (id) => {
    if (window.confirm("Remove this seller?")) {
      // dispatch(deleteSellerRequest(id))
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
                  value={query.searchKeyword}
                  onChange={(e) => setQuery({ ...query, searchKeyword: e.target.value })}
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
                          <th>Company Name</th>
                          <th>Director / Manager</th>
                          <th>Info</th>
                          <th>Seller Publish</th>
                          <th className="text-center">Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellers.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <img
                                    src={row.seller_profile?.logo?.original_image || defaultLogoImg}
                                    alt=""
                                    className="rounded me-2"
                                    style={{ width: 36, height: 36, objectFit: "contain" }}
                                    onError={(e) => {
                                      e.target.src = defaultLogoImg;
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="mb-1">{row.seller_profile?.company_name}</p>
                                  <p className="mb-1">{row.seller_profile?.company_email}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-2 align-items-center">
                                <div>
                                  <img
                                    src={row.profile_image || defaultLogoImg}
                                    alt=""
                                    className="rounded me-2"
                                    style={{ width: 36, height: 36, objectFit: "contain" }}
                                    onError={(e) => {
                                      e.target.src = defaultLogoImg;
                                    }}
                                  />
                                </div>
                                <div className="d-flex flex-column small">
                                  <span className="fw-medium">{row.full_name}</span>
                                  <span className="text-muted">{row.email}</span>
                                  <span>{row.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="small">
                                <div>Current Balance: {row.balance}</div>
                                <div>Last Login: {row.last_login}</div>
                              </div>
                            </td>
                            <td>
                              <div className="form-check form-switch">
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`pub-${row.id}`}
                                  checked={row.status}
                                  onChange={() => togglePublish(row.seller_profile.id)}
                                />
                                <label className="form-check-label" htmlFor={`pub-${row.id}`}>
                                  {row.status ? "On" : "Off"}
                                </label>
                              </div>
                            </td>
                            <td className="text-center">
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
              <Col>
                <FormGroup>
                  <Label for="field-company-name">Company Name *</Label>
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

            <Row className="mb-3">
              <Col>
                <FormGroup>
                  <Label for="field-companyAddress">Address *</Label>
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
              <Col md={6}>
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
              <Col md={6}>
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
            </Row>

            <Row className="mb-3">
              <Col>
                <FormGroup>
                  <Label for="field-phone_no">Company Telephone</Label>
                  <Input
                    id="field-phone_no"
                    name="phone_no"
                    type="text"
                    value={formValues.phone_no}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-company_email">Company Email</Label>
                  <Input
                    id="field-company_email"
                    name="company_email"
                    type="email"
                    value={formValues.company_email}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-license_no">Company Number</Label>
                  <Input
                    id="field-license_no"
                    name="license_no"
                    type="text"
                    value={formValues.license_no}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <FormGroup>
                  <Label for="field-company_website">Company Website</Label>
                  <Input
                    id="field-company_website"
                    name="company_website"
                    type="text"
                    value={formValues.company_website || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-company_type">Company Type</Label>
                  <Input
                    id="field-company_type"
                    name="company_type"
                    type="text"
                    value={formValues.company_type || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-number_employees">Number of Employees</Label>
                  <Input
                    id="field-number_employees"
                    name="number_employees"
                    type="number"
                    value={formValues.number_employees || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-1">
              {modalMode !== "view" && (
                <Col md={6} className="d-flex align-items-end pb-3">
                  <FormGroup check className="form-switch">
                    <Input
                      type="checkbox"
                      name="published"
                      id="field-published"
                      checked={formValues.status}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, status: e.target.checked }))
                      }
                    />
                    <Label check for="field-published">
                      Seller Published
                    </Label>
                  </FormGroup>
                </Col>
              )}
            </Row>

            <Row className="mt-2">
              <Col>
                <br />
                <p className="mt-5 mb-3">Director / Manager</p>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-first_name">First Name</Label>
                  <Input
                    id="field-first_name"
                    name="first_name"
                    type="text"
                    value={formValues.first_name || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-last_name">Last Name</Label>
                  <Input
                    id="field-last_name"
                    name="last_name"
                    type="text"
                    value={formValues.last_name || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label for="field-email">Email</Label>
                  <Input
                    id="field-email"
                    name="email"
                    type="text"
                    value={formValues.email || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label for="field-phone">Phone</Label>
                  <Input
                    id="field-phone"
                    name="phone"
                    type="text"
                    value={formValues.phone || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="field-password">Password</Label>
                  <Input
                    id="field-password"
                    name="password"
                    type="text"
                    value={formValues.password || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="field-password_confirmation">Confirm Password</Label>
                  <Input
                    id="field-password_confirmation"
                    name="password_confirmation"
                    type="text"
                    value={formValues.password_confirmation || ""}
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
    </React.Fragment>
  );
};

export default SellersBreakdown;
