import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
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
  FormText,
  Label,
  Badge,
  Spinner,
  FormFeedback,
  Nav,
  NavItem,
  NavLink,
  Toast,
  ToastBody,
  ToastHeader,
  TabContent,
} from "reactstrap";

import classnames from "classnames";

import { addNewStoreRequest, deleteStoreRequest, editStoreRequest, getStoresRequest, setStoreActiveRequest, getSellersListSuccess, getCategoriesSuccess, getSellersRequest, getSellersListRequest, getCategoriesRequest } from "../../store/e-commerce/actions";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import defaultLogoImg from "../../../images/companies/img-2.png";
import api from "../../store/api";

const defaultLogo = defaultLogoImg;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_OPENING_HOURS = [
  { open: "09:00 AM", close: "06:00 PM", is_closed: "0" }, // Monday
  { open: "09:00 AM", close: "06:00 PM", is_closed: "0" }, // Tuesday
  { open: "09:00 AM", close: "06:00 PM", is_closed: "0" }, // Wednesday
  { open: "09:00 AM", close: "06:00 PM", is_closed: "0" }, // Thursday
  { open: "09:00 AM", close: "06:00 PM", is_closed: "0" }, // Friday
  { open: "09:00 AM", close: "06:00 PM", is_closed: "0" }, // Saturday
  { open: "09:00 AM", close: "06:00 PM", is_closed: "1" }, // Sunday
];

const CATEGORIES = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Food & Beverage" },
  { id: 4, name: "Home & Garden" },
  { id: 5, name: "Books & Media" },
  { id: 6, name: "Sports & Outdoors" },
  { id: 7, name: "Health & Beauty" },
  { id: 8, name: "Toys & Games" },
  { id: 9, name: "Other" },
];

const initialFormState = {
  seller_id: "",
  store_name: "",
  store_code: "",
  address: "",
  postcode: "",
  city: "",
  store_phone: "",
  store_email: "",
  latitude: "",
  longitude: "",
  store_description: "",
  status: 1,
  opening_hours: [...DEFAULT_OPENING_HOURS],
  logo: null,
  main_banner: null,
  banner: null,
  logo_preview: null,
  main_banner_preview: null,
  banner_preview: null,
  facebook: "",
  youtube: "",
  twitter: "",
  linkedin: "",
  instagram: "",
  store_comments: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmatoin: "",
  category_id: "",
};

const StoresBreakdown = () => {
  document.title = "Stores Breakdown | LEKIT Ltd";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subdomain } = useParams();
  const appConfig = useSelector((state) => state.config?.appConfig);

  useEffect(() => {
    if (appConfig && !appConfig.seller_system) {
      navigate("/dashboard", { replace: true });
    }
  }, [appConfig, navigate]);

  const [stores, setStores] = useState([]);
  // sellers and categories loaded directly in this component

  const [openOnly, setOpenOnly] = useState(true);
  const [sellerFilter, setSellerFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [ordersFilter, setOrdersFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

  const [query, setQuery] = useState({
    subdomain: 'all',
    searchKeyword: ''
  });

  const ecommerceSelector = createSelector(
    state => state.ecommerce || {},
    state => state.Login?.user,
    (ecommerce, user) => ({
      allstores: ecommerce.stores || [],
      sellersListForStore: ecommerce.sellersList || [],
      storesCategories: ecommerce.storesCategories || [],
      currentUser: user,
      isSeller: user?.role === "seller",
    })
  );
  const { allstores, sellersListForStore, storesCategories, currentUser, isSeller } = useSelector(ecommerceSelector);

  // Keep a ref to ensure latest value of query
  const queryRef = useRef(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    setStores(allstores)
  }, [allstores]);

  useEffect(() => {
    if (!isSeller) {
      dispatch(getSellersListRequest());
    }
    dispatch(getCategoriesRequest());
  }, [dispatch, isSeller])

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      subdomain: typeof subdomain === "string" ? subdomain.trim().toLowerCase() : "all"
    }))
  }, [subdomain])

  useEffect(() => {
    if (query.subdomain === 'all') {
      dispatch(getStoresRequest({...queryRef.current}));
    } else if (query.subdomain === 'trade-pending') {
      dispatch(getStoresRequest({...queryRef.current}));
    } else if (query.subdomain === 'blocked') {
      dispatch(getStoresRequest({...queryRef.current}));
    } else if (query.subdomain === 'active') {
      dispatch(getStoresRequest({...queryRef.current}));
    } else if (query.subdomain === 'add') {
      setModalOpen(true);
    }
  }, [dispatch, query.subdomain])

  const resetForm = () => {
    setFormValues({ ...initialFormState });
    setErrors({});
    setTouched({});
    setPasswordsMatch(true);
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentRecord(null);
    const initial = { ...initialFormState };
    if (isSeller && currentUser?.id) {
      initial.seller_id = String(currentUser.id);
    }
    setFormValues(initial);
    setActiveTab("1");
    setModalOpen(true);
  };

  const openViewOrEditModal = (mode, record) => {
    setModalMode(mode);
    setCurrentRecord(record);
    setActiveTab("1");
    if (record && record.store_profile) {
      const profile = record.store_profile;
      const formattedHours = Array.isArray(profile.opening_hours)
        ? profile.opening_hours
        : DEFAULT_OPENING_HOURS;

      setFormValues({
        ...initialFormState,
        seller_id: profile?.seller_id || "",
        store_name: profile?.store_name || "",
        store_code: profile?.store_code || "",
        address: profile?.address || "",
        postcode: profile?.postcode || "",
        city: profile?.city || "",
        store_phone: profile?.store_phone || "",
        store_email: profile?.store_email || "",
        latitude: profile?.latitude || "",
        longitude: profile?.longitude || "",
        store_description: profile?.store_description || "",
        store_comments: profile?.store_comments || "",
        opening_hours: formattedHours,
        facebook: profile?.facebook || "",
        youtube: profile?.youtube || "",
        twitter: profile?.twitter || "",
        linkedin: profile?.linkedin || "",
        instagram: profile?.instagram || "",
        status: profile?.status === 1 ? 1 : 0,
        first_name: record.first_name || '',
        last_name: record.last_name || '',
        email: record.email || '',
        phone: record.phone || '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isSeller && !formValues.seller_id) newErrors.seller_id = "Seller is required";
    if (!formValues.store_name) newErrors.store_name = "Store Name is required";
    if (!formValues.store_code) newErrors.store_code = "Store Code is required";
    if (!formValues.address) newErrors.address = "Address is required";
    if (!formValues.city) newErrors.city = "City is required";
    if (!formValues.store_phone) newErrors.store_phone = "Store Telephone is required";
    if (!formValues.store_email) newErrors.store_email = "Store Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.store_email))
      newErrors.store_email = "Invalid email format";

    if (!formValues.latitude) newErrors.latitude = "Latitude is required";
    else if (isNaN(parseFloat(formValues.latitude)))
      newErrors.latitude = "Latitude must be numeric";

    if (!formValues.longitude) newErrors.longitude = "Longitude is required";
    else if (isNaN(parseFloat(formValues.longitude)))
      newErrors.longitude = "Longitude must be numeric";

    if (!formValues.store_description)
      newErrors.store_description = "Store Description is required";

    // Validate opening hours (array format)
    if (Array.isArray(formValues.opening_hours)) {
      formValues.opening_hours.forEach((hours, dayIndex) => {
        if (hours.is_closed !== "1" && hours.is_closed !== 1) {
          if (!hours.open) newErrors[`day_${dayIndex}_open`] = `Open time required`;
          if (!hours.close) newErrors[`day_${dayIndex}_close`] = `Close time required`;
          if (hours.open && hours.close && hours.open >= hours.close) {
            newErrors[`day_${dayIndex}_close`] = `Close time must be after open time`;
          }
        }
      });
    }

    if (!formValues.first_name)
      newErrors.first_name = "Manager First Name is required";
    if (!formValues.last_name)
      newErrors.last_name = "Manager Last Name is required";
    if (!formValues.email) newErrors.email = "Manager Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email))
      newErrors.email = "Invalid email format";

    if (modalMode === "add") {
      if (!formValues.password)
        newErrors.password = "Password is required";
      else if (formValues.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";

      if (!formValues.password_confirmatoin)
        newErrors.password_confirmatoin = "Confirm Password is required";
      else if (formValues.password !== formValues.password_confirmatoin) {
        newErrors.password_confirmatoin = "Passwords do not match";
        setPasswordsMatch(false);
      } else {
        setPasswordsMatch(true);
      }
    }

    // if (!formValues.category_id) newErrors.category_id = "Category is required";

    const urlFields = ["facebook", "youtube", "twitter", "linkedin", "instagram"];
    urlFields.forEach((field) => {
      if (formValues[field] && !/^https?:\/\/.+/.test(formValues[field])) {
        newErrors[field] = "Must be valid URL (http:// or https://)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "File must be an image",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormValues((prev) => ({
          ...prev,
          [fieldName]: file,
          [`${fieldName}_preview`]: reader.result,
        }));
        setErrors((prev) => {
          const newErrs = { ...prev };
          delete newErrs[fieldName];
          return newErrs;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (fieldName) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: null,
      [`${fieldName}_preview`]: null,
    }));
  };

  const handleOpeningHoursChange = (dayIndex, field, value) => {
    setFormValues((prev) => {
      const newHours = [...prev.opening_hours];
      newHours[dayIndex] = {
        ...newHours[dayIndex],
        [field]: value,
      };
      return {
        ...prev,
        opening_hours: newHours,
      };
    });
  };

  const toggleDayOpen = (dayIndex) => {
    setFormValues((prev) => {
      const newHours = [...prev.opening_hours];
      const isClosed = newHours[dayIndex].is_closed;
      newHours[dayIndex] = {
        ...newHours[dayIndex],
        is_closed: isClosed === "1" || isClosed === 1 ? 0 : 1,
      };
      return {
        ...prev,
        opening_hours: newHours,
      };
    });
  };

  const copyMondayToAllDays = () => {
    const mondayHours = formValues.opening_hours[0];
    setFormValues((prev) => {
      const newHours = [...prev.opening_hours];
      for (let i = 1; i < newHours.length; i++) {
        newHours[i] = { ...mondayHours };
      }
      return {
        ...prev,
        opening_hours: newHours,
      };
    });
  };

  const hasError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToastMessage("Please fix validation errors");
      setToastType("danger");
      return;
    }

    setIsLoading(true);

    try {
      if (modalMode === "add") {
        const formData = new FormData();

        formData.append('seller_id', formValues.seller_id);
        formData.append('store_name', formValues.store_name);
        formData.append('store_code', formValues.store_code);
        formData.append('address', formValues.address);
        formData.append('postcode', formValues.postcode);
        formData.append('city', formValues.city);
        formData.append('store_phone', formValues.store_phone);
        formData.append('store_email', formValues.store_email);
        formData.append('latitude', formValues.latitude);
        formData.append('longitude', formValues.longitude);
        formData.append('store_description', formValues.store_description);
        formData.append('store_comments', formValues.store_comments);
        formData.append('status', formValues.status === 1 ? 1 : 0);

        // Format opening hours as array
        if (Array.isArray(formValues.opening_hours)) {
          formData.append('opening_hours', JSON.stringify(formValues.opening_hours));
        }

        formData.append('facebook', formValues.facebook || '');
        formData.append('youtube', formValues.youtube || '');
        formData.append('twitter', formValues.twitter || '');
        formData.append('linkedin', formValues.linkedin || '');
        formData.append('instagram', formValues.instagram || '');

        formData.append('first_name', formValues.first_name);
        formData.append('last_name', formValues.last_name);
        formData.append('email', formValues.email);
        formData.append('phone', formValues.phone || '');
        formData.append('password', formValues.password);
        formData.append('category_id', formValues.category_id);

        if (formValues.logo instanceof File) {
          formData.append('logo', formValues.logo);
        }
        if (formValues.main_banner instanceof File) {
          formData.append('main_banner', formValues.main_banner);
        }
        if (formValues.banner instanceof File) {
          formData.append('banner', formValues.banner);
        }

        dispatch(addNewStoreRequest(formData));
      } else if (modalMode === "edit" && currentRecord) {
        const updateStore = {
          id: currentRecord.store_profile.id,
          ...formValues,
          status: formValues.status === 1 ? 1 : 0,
        };
        dispatch(editStoreRequest(updateStore));
      }

      setIsLoading(false);
      closeModal();
    } catch (error) {
      setIsLoading(false);
      setToastMessage("Error: " + (error.message || "An error occurred"));
      setToastType("danger");
    }
  };

  const handleRemove = (id) => {
    if (!window.confirm("Remove this store?")) return;
    dispatch(deleteStoreRequest(id))
  };

  const toggleOpenStatus = (row) => {
    const updatedRow = {
      ...row,
      store_profile: {
        ...row.store_profile,
        status: row.store_profile.status === 1 ? 0 : 1,
      },
    };
    dispatch(setStoreActiveRequest(updatedRow));
    dispatch(getStoresRequest({ ...queryRef.current }));
  };

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
                  value={query.searchKeyword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuery(prev => ({ ...prev, searchKeyword: value }));
                  }}
                  className="form-control"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      dispatch(getStoresRequest({...queryRef.current}));
                    }
                  }}
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
          {/* <Row className="mb-3 gy-2 align-items-end">
            <Col md={3}>
              <FormGroup>
                <Label>Show Stores by Seller</Label>
                <Input
                  type="select"
                  value={sellerFilter}
                  onChange={(e) => setSellerFilter(e.target.value)}
                >
                  <option value="all">All sellers</option>
                  {(sellersListForStore || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.seller_profile.shop_name || '-'}
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
          </Row> */}

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
                                  src={`storage/${row.store_profile.logo.original_image}` || defaultLogo}
                                  alt=""
                                  className="rounded me-3"
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
                                    className="rounded me-3"
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
                              <p className="mb-1">{`Current Balance: ${row?.balance || '-'}`}</p>
                              <p className="mb-1">{`Last Login: ${row?.last_login || '-'}`}</p>
                            </td>
                            <td>
                              <div className="d-flex flex-column small">
                                <div className="form-check form-switch mt-1">
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`open-${row.id}`}
                                    checked={row.store_profile.status === 1}
                                    onClick={() => toggleOpenStatus(row)}
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
                        {stores.length === 0 && (
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
        </Container>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed" style={{ top: "20px", right: "20px", zIndex: 1050 }}>
          <Toast isOpen={!!toastMessage}>
            <ToastHeader
              icon={toastType === "success" ? "success" : "danger"}
              toggle={() => setToastMessage(null)}
            >
              {toastType === "success" ? "Success" : "Error"}
            </ToastHeader>
            <ToastBody>{toastMessage}</ToastBody>
          </Toast>
        </div>
      )}

      {/* Add / Edit / View Store Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal} size="lg" className="modal-dialog-scrollable">
        <ModalHeader toggle={closeModal}>
          {modalMode === "add" ? "Add New Store" : modalMode === "edit" ? "Edit Store" : "View Store"}
        </ModalHeader>
        <ModalBody>
          <Nav tabs className="mb-3">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => setActiveTab("1")}
                style={{ cursor: "pointer" }}
              >
                Store Details
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => setActiveTab("2")}
                style={{ cursor: "pointer" }}
              >
                Opening Hours
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={() => setActiveTab("3")}
                style={{ cursor: "pointer" }}
              >
                Media Upload
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "4" })}
                onClick={() => setActiveTab("4")}
                style={{ cursor: "pointer" }}
              >
                Social & Other
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "5" })}
                onClick={() => setActiveTab("5")}
                style={{ cursor: "pointer" }}
              >
                Store Manager
              </NavLink>
            </NavItem>
          </Nav>

          <Form onSubmit={handleSave}>
            {/* TAB 1: Store Details */}
            {activeTab === "1" && (
              <TabContent tabId="1">
                {!isSeller && (
                  <FormGroup>
                    <Label for="seller_id">Seller *</Label>
                    <Input
                      type="select"
                      name="seller_id"
                      id="seller_id"
                      value={formValues.seller_id}
                      onChange={handleInputChange}
                      invalid={hasError("seller_id")}
                    >
                      <option>Select Seller</option>
                      {(sellersListForStore || []).map((seller) => (
                        <option key={seller.id} value={seller.id}>
                          {seller.seller_profile?.shop_name || '-'}
                        </option>
                      ))}
                    </Input>
                    {hasError("seller_id") && (
                      <FormFeedback>{errors.seller_id}</FormFeedback>
                    )}
                  </FormGroup>
                )}

                <FormGroup>
                  <Label for="store_name">Store Name *</Label>
                  <Input
                    type="text"
                    name="store_name"
                    id="store_name"
                    value={formValues.store_name}
                    onChange={handleInputChange}
                    placeholder="Enter store name"
                    invalid={hasError("store_name")}
                  />
                  {hasError("store_name") && (
                    <FormFeedback>{errors.store_name}</FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="store_code">Store Code *</Label>
                  <Input
                    type="text"
                    name="store_code"
                    id="store_code"
                    value={formValues.store_code}
                    onChange={handleInputChange}
                    placeholder="Unique store code"
                    invalid={hasError("store_code")}
                  />
                  {hasError("store_code") && (
                    <FormFeedback>{errors.store_code}</FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="address">Address *</Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    value={formValues.address}
                    onChange={handleInputChange}
                    placeholder="Full address"
                    invalid={hasError("address")}
                  />
                  {hasError("address") && (
                    <FormFeedback>{errors.address}</FormFeedback>
                  )}
                </FormGroup>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="postcode">Post Code</Label>
                      <Input
                        type="text"
                        name="postcode"
                        id="postcode"
                        value={formValues.postcode}
                        onChange={handleInputChange}
                        placeholder="Postcode"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="city">City *</Label>
                      <Input
                        type="text"
                        name="city"
                        id="city"
                        value={formValues.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        invalid={hasError("city")}
                      />
                      {hasError("city") && (
                        <FormFeedback>{errors.city}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="store_phone">Store Telephone *</Label>
                      <Input
                        type="text"
                        name="store_phone"
                        id="store_phone"
                        value={formValues.store_phone}
                        onChange={handleInputChange}
                        placeholder="Phone number"
                        invalid={hasError("store_phone")}
                      />
                      {hasError("store_phone") && (
                        <FormFeedback>{errors.store_phone}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="store_email">Store Email *</Label>
                      <Input
                        type="email"
                        name="store_email"
                        id="store_email"
                        value={formValues.store_email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        invalid={hasError("store_email")}
                      />
                      {hasError("store_email") && (
                        <FormFeedback>{errors.store_email}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="latitude">Latitude *</Label>
                      <Input
                        type="text"
                        name="latitude"
                        id="latitude"
                        value={formValues.latitude}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        invalid={hasError("latitude")}
                      />
                      {hasError("latitude") && (
                        <FormFeedback>{errors.latitude}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="longitude">Longitude *</Label>
                      <Input
                        type="text"
                        name="longitude"
                        id="longitude"
                        value={formValues.longitude}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        invalid={hasError("longitude")}
                      />
                      {hasError("longitude") && (
                        <FormFeedback>{errors.longitude}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="store_description">Store Description *</Label>
                  <Input
                    type="textarea"
                    name="store_description"
                    id="store_description"
                    value={formValues.store_description}
                    onChange={handleInputChange}
                    placeholder="Describe your store"
                    rows="3"
                    invalid={hasError("store_description")}
                  />
                  {hasError("store_description") && (
                    <FormFeedback>{errors.store_description}</FormFeedback>
                  )}
                </FormGroup>

                <Row className="mb-1">
                  {modalMode !== "view" && (
                    <Col md={6} className="d-flex align-items-end pb-3">
                      <FormGroup check className="form-switch">
                        <Input
                          type="checkbox"
                          name="status"
                          id="field-published"
                          checked={formValues.status === 1}
                          onClick={(e) => handleInputChange({
                            target: { name: 'status', value: e.target.checked ? 0 : 1, type: 'checkbox' }
                          })}
                        />
                        <Label check for="field-published">
                          Active / Inactive
                        </Label>
                      </FormGroup>
                    </Col>
                  )}
                </Row>
              </TabContent>
            )}

            {/* TAB 2: Opening Hours */}
            {activeTab === "2" && (
              <TabContent tabId="2">
                <Button
                  type="button"
                  color="secondary"
                  size="sm"
                  className="mb-3"
                  onClick={copyMondayToAllDays}
                >
                  Copy Monday to All Days
                </Button>

                {DAYS.map((day, dayIndex) => (
                  <div key={dayIndex} className="border-bottom pb-3 mb-3">
                    <Row className="align-items-center">
                      <Col md={2}>
                        <strong>{day}</strong>
                      </Col>
                      <Col md={10}>
                        <FormGroup check className="form-switch">
                          <Input
                            type="checkbox"
                            id={`${dayIndex}-closed`}
                            checked={formValues.opening_hours[dayIndex]?.is_closed === "1" || formValues.opening_hours[dayIndex]?.is_closed === 1}
                            onClick={() => toggleDayOpen(dayIndex)}
                          />
                          <Label check htmlFor={`${dayIndex}-closed`}>
                            Closed
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>

                    {formValues.opening_hours[dayIndex]?.is_closed !== "1" && formValues.opening_hours[dayIndex]?.is_closed !== 1 && (
                      <Row className="mt-2">
                        <Col md={6}>
                          <FormGroup>
                            <Label for={`${dayIndex}-open`}>
                              Opening Time {hasError(`day_${dayIndex}_open`) && "*"}
                            </Label>
                            <Input
                              type="text"
                              id={`${dayIndex}-open`}
                              value={formValues.opening_hours[dayIndex]?.open || ""}
                              onChange={(e) =>
                                handleOpeningHoursChange(dayIndex, "open", e.target.value)
                              }
                              placeholder="09:00 AM"
                              invalid={hasError(`day_${dayIndex}_open`)}
                            />
                            {hasError(`day_${dayIndex}_open`) && (
                              <FormFeedback>{errors[`day_${dayIndex}_open`]}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for={`${dayIndex}-close`}>
                              Closing Time {hasError(`day_${dayIndex}_close`) && "*"}
                            </Label>
                            <Input
                              type="text"
                              id={`${dayIndex}-close`}
                              value={formValues.opening_hours[dayIndex]?.close || ""}
                              onChange={(e) =>
                                handleOpeningHoursChange(dayIndex, "close", e.target.value)
                              }
                              placeholder="06:00 PM"
                              invalid={hasError(`day_${dayIndex}_close`)}
                            />
                            {hasError(`day_${dayIndex}_close`) && (
                              <FormFeedback>{errors[`day_${dayIndex}_close`]}</FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    )}
                  </div>
                ))}
              </TabContent>
            )}

            {/* TAB 3: Media Upload */}
            {activeTab === "3" && (
              <TabContent tabId="3">
                <FormGroup>
                  <Label>Store Logo</Label>
                  <div className="border rounded p-3 text-center bg-light mb-3">
                    {formValues.logo_preview ? (
                      <div>
                        <img
                          src={formValues.logo_preview}
                          alt="Logo preview"
                          style={{ maxHeight: "150px", marginBottom: "10px" }}
                        />
                        <div>
                          <Button
                            type="button"
                            color="danger"
                            size="sm"
                            onClick={() => handleImageRemove("logo")}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p>No logo selected</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "logo")}
                        />
                      </div>
                    )}
                  </div>
                  {hasError("logo") && (
                    <FormFeedback className="d-block">{errors.logo}</FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Main Banner</Label>
                  <div className="border rounded p-3 text-center bg-light mb-3">
                    {formValues.main_banner_preview ? (
                      <div>
                        <img
                          src={formValues.main_banner_preview}
                          alt="Main banner preview"
                          style={{ maxHeight: "150px", marginBottom: "10px" }}
                        />
                        <div>
                          <Button
                            type="button"
                            color="danger"
                            size="sm"
                            onClick={() => handleImageRemove("main_banner")}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p>No banner selected</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "main_banner")}
                        />
                      </div>
                    )}
                  </div>
                  {hasError("main_banner") && (
                    <FormFeedback className="d-block">
                      {errors.main_banner}
                    </FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Banner</Label>
                  <div className="border rounded p-3 text-center bg-light mb-3">
                    {formValues.banner_preview ? (
                      <div>
                        <img
                          src={formValues.banner_preview}
                          alt="Banner preview"
                          style={{ maxHeight: "150px", marginBottom: "10px" }}
                        />
                        <div>
                          <Button
                            type="button"
                            color="danger"
                            size="sm"
                            onClick={() => handleImageRemove("banner")}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p>No banner selected</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "banner")}
                        />
                      </div>
                    )}
                  </div>
                  {hasError("banner") && (
                    <FormFeedback className="d-block">{errors.banner}</FormFeedback>
                  )}
                </FormGroup>
              </TabContent>
            )}

            {/* TAB 4: Social Links & Comments */}
            {activeTab === "4" && (
              <TabContent tabId="4">
                <FormGroup>
                  <Label for="facebook">Facebook URL</Label>
                  <Input
                    type="text"
                    name="facebook"
                    id="facebook"
                    value={formValues.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                    invalid={hasError("facebook")}
                  />
                  {hasError("facebook") && (
                    <FormFeedback>{errors.facebook}</FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="youtube">YouTube URL</Label>
                  <Input
                    type="text"
                    name="youtube"
                    id="youtube"
                    value={formValues.youtube}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/..."
                    invalid={hasError("youtube")}
                  />
                  {hasError("youtube") && (
                    <FormFeedback>{errors.youtube}</FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="twitter">Twitter URL</Label>
                  <Input
                    type="text"
                    name="twitter"
                    id="twitter"
                    value={formValues.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/..."
                    invalid={hasError("twitter")}
                  />
                  {hasError("twitter") && (
                    <FormFeedback>{errors.twitter}</FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="linkedin">LinkedIn URL</Label>
                  <Input
                    type="text"
                    name="linkedin"
                    id="linkedin"
                    value={formValues.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/..."
                    invalid={hasError("linkedin")}
                  />
                  {hasError("linkedin") && (
                    <FormFeedback>{errors.linkedin}</FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="instagram">Instagram URL</Label>
                  <Input
                    type="text"
                    name="instagram"
                    id="instagram"
                    value={formValues.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                    invalid={hasError("instagram")}
                  />
                  {hasError("instagram") && (
                    <FormFeedback>{errors.instagram}</FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="store_comments">Comments</Label>
                  <Input
                    type="textarea"
                    name="store_comments"
                    id="store_comments"
                    value={formValues.store_comments}
                    onChange={handleInputChange}
                    placeholder="Additional comments"
                    rows="3"
                  />
                </FormGroup>
              </TabContent>
            )}

            {/* TAB 5: Store Manager */}
            {activeTab === "5" && (
              <TabContent tabId="5">
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="first_name">First Name *</Label>
                      <Input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={formValues.first_name}
                        onChange={handleInputChange}
                        placeholder="Manager's first name"
                        invalid={hasError("first_name")}
                      />
                      {hasError("first_name") && (
                        <FormFeedback>
                          {errors.first_name}
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="last_name">Last Name *</Label>
                      <Input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={formValues.last_name}
                        onChange={handleInputChange}
                        placeholder="Manager's last name"
                        invalid={hasError("last_name")}
                      />
                      {hasError("last_name") && (
                        <FormFeedback>{errors.last_name}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="email">Email *</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    placeholder="manager@email.com"
                    invalid={hasError("email")}
                  />
                  {hasError("email") && (
                    <FormFeedback>{errors.email}</FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="phone">Phone</Label>
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formValues.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                  />
                </FormGroup>

                {modalMode === "add" && (
                  <>
                    <FormGroup>
                      <Label for="password">Password *</Label>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        value={formValues.password}
                        onChange={handleInputChange}
                        placeholder="Minimum 8 characters"
                        invalid={hasError("password")}
                      />
                      {hasError("password") && (
                        <FormFeedback>
                          {errors.password}
                        </FormFeedback>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label for="password_confirmatoin">Confirm Password *</Label>
                      <Input
                        type="password"
                        name="password_confirmatoin"
                        id="password_confirmatoin"
                        value={formValues.password_confirmatoin}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        invalid={hasError("password_confirmatoin")}
                      />
                      {hasError("password_confirmatoin") && (
                        <FormFeedback>
                          {errors.password_confirmatoin}
                        </FormFeedback>
                      )}
                      {!passwordsMatch && modalMode === "add" && (
                        <FormText color="danger">
                          Passwords do not match
                        </FormText>
                      )}
                    </FormGroup>
                  </>
                )}

                <FormGroup>
                  <Label for="category_id">Category *</Label>
                  <Input
                    type="select"
                    name="category_id"
                    id="category_id"
                    value={formValues.category_id}
                    onChange={handleInputChange}
                    invalid={hasError("category_id")}
                  >
                    <option>Select Category</option>
                    {storesCategories.length > 0
                      ? storesCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title || '-'}
                        </option>
                      ))
                      : ''}
                  </Input>
                  {hasError("category_id") && (
                    <FormFeedback>{errors.category_id}</FormFeedback>
                  )}
                </FormGroup>
              </TabContent>
            )}
            <Row>
              <Col md={6} className="d-flex gap-2">
                <Button color="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                {modalMode !== "view" && (
                  <Button
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default StoresBreakdown;
