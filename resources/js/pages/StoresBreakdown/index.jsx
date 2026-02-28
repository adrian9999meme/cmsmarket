import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
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

import { addNewStoreRequest, deleteStoreRequest, editStoreRequest, getStoresRequest } from "../../store/actions";
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

const initialFormState = {
  id: "",
  seller_id: "",
  store_id: "", // for some forms/usecases
  user_id: "", // left for legacy support if needed
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
  store_name: "",
  store_code: "",
  address: "",
  postcode: "",
  city: "",
  country_id: "",
  store_phone: "",
  store_email: "",
  latitude: "",
  longitude: "",
  store_description: "",
  store_comments: "",
  logo: {
    storage: "",
    original_image: "",
    image_100x38: "",
    image_89x33: "",
    image_118x45: "",
    image_138x52: "",
    image_48x25: "",
    image_40x40: "",
    image_197x152: "",
    image_120x80: "",
    image_82x82: "",
    image_617x145: "",
    image_297x203: "",
    image_72x72: "",
    image_270x260: "",
    image_320x320: "",
    image_1900x625: "",
    image_1300x400: "",
  },
  main_banner: {
    storage: "",
    original_image: "",
    image_100x38: "",
    image_89x33: "",
    image_118x45: "",
    image_138x52: "",
    image_48x25: "",
    image_40x40: "",
    image_197x152: "",
    image_120x80: "",
    image_82x82: "",
    image_617x145: "",
    image_297x203: "",
    image_72x72: "",
    image_270x260: "",
    image_320x320: "",
    image_1900x625: "",
    image_1300x400: "",
  },
  banner: {
    storage: "",
    original_image: "",
    image_100x38: "",
    image_89x33: "",
    image_118x45: "",
    image_138x52: "",
    image_48x25: "",
    image_40x40: "",
    image_197x152: "",
    image_120x80: "",
    image_82x82: "",
    image_617x145: "",
    image_297x203: "",
    image_72x72: "",
    image_270x260: "",
    image_320x320: "",
    image_1900x625: "",
    image_1300x400: "",
  },
  status: 1, // 1 for active, 0 for inactive
  // Opening/closing times and is_closed for each day, e.g. open_time[0] = "08:00", close_time[0] = "17:00"
  open_time: ["", "", "", "", "", "", ""],
  close_time: ["", "", "", "", "", "", ""],
  is_closed0: 0,
  is_closed1: 0,
  is_closed2: 0,
  is_closed3: 0,
  is_closed4: 0,
  is_closed5: 0,
  is_closed6: 0,
  facebook: "",
  youtube: "",
  twitter: "",
  linkedin: "",
  instagram: "",
  category: "",
};

const StoresBreakdown = () => {
  document.title = "Stores Breakdown | LEKIT Ltd";
  const dispatch = useDispatch()
  const { status } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState([]);
  const [openOnly, setOpenOnly] = useState(true);
  const [sellerFilter, setSellerFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [ordersFilter, setOrdersFilter] = useState("all"); // all | 0-100 | 100-500 | 500+

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
      allstores: ecommerce.stores,
    })
  );
  const { allstores } = useSelector(ecommerceSelector);

  useEffect(() => {
    setStores(allstores)
  }, [allstores])

  useEffect(() => {
    if (status === 'all') {
      setQuery({ ...query, status: '' })
      dispatch(getStoresRequest(query));
    } else if (status === 'pending') {
      setQuery({ ...query, status: 'pending' })
      dispatch(getStoresRequest(query));
    } else if (status === 'blocked') {
      setQuery({ ...query, status: 'blocked' })
      dispatch(getStoresRequest(query));
    } else if (status === 'add') {

    }
    dispatch(getStoresRequest(query))
  }, [dispatch])

  const openAddModal = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setFormValues({
      ...initialFormState,
    });
    setModalOpen(true);
  };

  const openViewOrEditModal = (mode, record) => {
    setModalMode(mode);
    setCurrentRecord(record);
    setFormValues({
      // Top-level user fields
      id: record.id,
      email: record.email,
      country_id: record.country_id,
      phone: record.phone,
      first_name: record.first_name,
      last_name: record.last_name,
      status: record.status,
      is_user_banned: record.is_user_banned,
      newsletter_enable: record.newsletter_enable,
      lang_code: record.lang_code,
      is_password_set: record.is_password_set,
      profile_image: record.profile_image,
      user_profile_image: record.user_profile_image,
      full_name: record.full_name,
      last_recharge: record.last_recharge,
      // Shipping/billing can be left for address lists if needed
      // Nested store profile info
      store_profile_id: record.store_profile?.id ?? "",
      seller_id: record.store_profile?.seller_id ?? "",
      user_id: record.store_profile?.user_id ?? "",
      store_name: record.store_profile?.store_name ?? "",
      store_code: record.store_profile?.store_code ?? "",
      store_status: record.store_profile?.status ?? "",
      address: record.store_profile?.address ?? "",
      postcode: record.store_profile?.postcode ?? "",
      city: record.store_profile?.city ?? "",
      store_phone: record.store_profile?.store_phone ?? "",
      store_email: record.store_profile?.store_email ?? "",
      latitude: record.store_profile?.latitude ?? "",
      longitude: record.store_profile?.longitude ?? "",
      store_description: record.store_profile?.store_description ?? "",
      store_comments: record.store_profile?.store_comments ?? "",
      // Opening and closing times as arrays, and week handling. Map as separate fields for each day if needed.
      open_time: Array.isArray(record.store_profile?.opening_hours) 
        ? record.store_profile.opening_hours.map(x => x.open)
        : [],
      close_time: Array.isArray(record.store_profile?.opening_hours)
        ? record.store_profile.opening_hours.map(x => x.close)
        : [],
      is_closed: Array.isArray(record.store_profile?.opening_hours)
        ? record.store_profile.opening_hours.map(x => x.is_closed)
        : [],
      // Images
      logo: record.store_profile?.logo ?? "",
      main_banner: record.store_profile?.main_banner ?? "",
      banner: record.store_profile?.banner ?? "",
      // Social
      facebook: record.store_profile?.facebook ?? "",
      youtube: record.store_profile?.youtube ?? "",
      twitter: record.store_profile?.twitter ?? "",
      linkedin: record.store_profile?.linkedin ?? "",
      instagram: record.store_profile?.instagram ?? "",
      // For backward compatibility and to preserve any additional store props
      category: record.category,
      store_id: record.store_profile?.store_id ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormValues((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
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
        store_id: formValues.store_id,
        user_id: formValues.user_id,
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        phone: formValues.phone,
        password: formValues.password,
        password_confirmation: formValues.password_confirmation,       
        store_name: formValues.store_name,
        store_code: formValues.store_code,
        address: formValues.address,
        postcode: formValues.postcode,
        city: formValues.city,
        country_id: formValues.country_id,
        store_phone: formValues.store_phone,
        store_email: formValues.store_email,
        latitude: formValues.latitude,
        longitude: formValues.longitude,
        store_description: formValues.store_description,
        store_comments: formValues.store_comments,
        logo: formValues.logo,
        main_banner: formValues.main_banner,
        banner: formValues.banner,
        facebook: formValues.facebook,
        youtube: formValues.youtube,
        twitter: formValues.twitter,
        linkedin: formValues.linkedin,
        instagram: formValues.instagram,
        status: formValues.status || 1,
        open_time: Array.isArray(formValues.open_time) ? [...formValues.open_time] : [],
        close_time: Array.isArray(formValues.close_time) ? [...formValues.close_time] : [],
        category: formValues.category,
      };
      // setStores((prev) => [...prev, newStore]);
      dispatch(addNewStoreRequest(newStore))
    } else if (modalMode === "edit" && currentRecord) {
      const updateStore = {
        id: currentRecord.id,
        seller_id: formValues.seller_id,
        store_name: formValues.store_name,
        store_code: formValues.store_code,
        address: formValues.address,
        postcode: formValues.postcode,
        city: formValues.city,
        store_phone: formValues.store_phone,
        store_email: formValues.store_email,
        latitude: formValues.latitude,
        longitude: formValues.longitude,
        store_description: formValues.store_description,
        status: formValues.status,
        open_time: Array.isArray(formValues.open_time) ? [...formValues.open_time] : [],
        close_time: Array.isArray(formValues.close_time) ? [...formValues.close_time] : [],
        logo: formValues.logo,
        main_banner: formValues.main_banner,
        banner: formValues.banner,
        facebook: formValues.facebook,
        youtube: formValues.youtube,
        twitter: formValues.twitter,
        linkedin: formValues.linkedin,
        instagram: formValues.instagram,
        store_comments: formValues.store_comments,
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        phone: formValues.phone,
        category: formValues.category,
        country_id: formValues.country_id,
        store_id: formValues.store_id,
      }
      dispatch(editStoreRequest(updateStore))
    }
    // setModalOpen(false);
  };

  const handleRemove = (id) => {
    if (!window.confirm("Remove this store?")) return;
    dispatch(deleteStoreRequest(id))
    // setStores((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleOpenStatus = (id) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.store_profile.status === 1 ? 0 : 1 } : s
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
                  {/* {uniqueSellers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))} */}
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
                  {/* {uniqueCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))} */}
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
                      Total: {stores.length} store{stores.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="table-responsive">
                    <Table className="table table-bordered table-nowrap align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Store Name</th>
                          <th>Manager</th>
                          <th>Info</th>
                          <th>Status</th>
                          <th className="text-center">Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stores.map((row) => (
                          <tr key={row.store_profile.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={row.store_profile.logo.original_image || defaultLogo}
                                  alt=""
                                  className="rounded me-2"
                                  style={{ width: 32, height: 32, objectFit: "contain" }}
                                  onError={(e) => {
                                    e.target.src = defaultLogo;
                                  }}
                                />
                                <div> 
                                  <p className="mb-1">{row.store_profile?.store_name}</p>
                                  <p className="mb-1">{row.store_profile?.store_phone}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <img
                                    src={row.profile_image || defaultLogo}
                                    alt=""
                                    className="rounded me-2"
                                    style={{ width: 32, height: 32, objectFit: "contain" }}
                                    onError={(e) => {
                                      e.target.src = defaultLogo;
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="mb-1">{row.full_name}</p>
                                  <p className="mb-1">{row.email}</p>
                                  <p className="mb-1">{row.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="mb-1">{`Current Balance: ${row?.balance}`}</p>
                              <p className="mb-1">{`Last Login: ${row?.last_login}`}</p>
                            </td>
                            <td>
                              <div className="d-flex flex-column small">
                                <span
                                  className={
                                    row.store_profile.status === 1
                                      ? "text-success fw-semibold"
                                      : "text-muted fw-semibold"
                                  }
                                >
                                  {row.store_profile.status === 1 ? "Opened" : "Closed"}
                                </span>
                                <div className="form-check form-switch mt-1">
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`open-${row.slug}`}
                                    checked={row.store_profile.status === 1}
                                    onChange={() => toggleOpenStatus(row.id)}
                                  />
                                  <Label
                                    className="form-check-label"
                                    htmlFor={`open-${row.id}`}
                                  >
                                    {row.store_profile.status === 1 ? "On" : "Off"}
                                  </Label>
                                </div>
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
                    value={formValues.store_name || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-store_code">Store Code</Label>
                  <Input
                    id="field-store_code"
                    name="store_code"
                    type="text"
                    value={formValues.store_code || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-store_phone">Store Phone</Label>
                  <Input
                    id="field-store_phone"
                    name="store_phone"
                    type="text"
                    value={formValues.store_phone || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-store_email">Store Email</Label>
                  <Input
                    id="field-store_email"
                    name="store_email"
                    type="email"
                    value={formValues.store_email || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-address">Address</Label>
                  <Input
                    id="field-address"
                    name="address"
                    type="text"
                    value={formValues.address || ""}
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
                    value={formValues.city || ""}
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
                    value={formValues.postcode || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-slug">Slug</Label>
                  <Input
                    id="field-slug"
                    name="slug"
                    type="text"
                    value={formValues.slug || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="field-latitude">Latitude</Label>
                  <Input
                    id="field-latitude"
                    name="latitude"
                    type="text"
                    value={formValues.latitude || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="field-longitude">Longitude</Label>
                  <Input
                    id="field-longitude"
                    name="longitude"
                    type="text"
                    value={formValues.longitude || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <FormGroup>
                  <Label for="field-store_description">Store Description</Label>
                  <Input
                    id="field-store_description"
                    name="store_description"
                    type="textarea"
                    value={formValues.store_description || ""}
                    onChange={handleFormChange}
                    readOnly={modalMode === "view"}
                    rows="4"
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
                      checked={formValues.status === 1}
                      onChange={handleFormChange}
                    />
                    <Label check htmlFor="field-status">
                      Active/Inactive
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
