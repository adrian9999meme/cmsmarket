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

import { addNewStoreRequest, deleteStoreRequest, editStoreRequest, getStoresRequest, setStoreActiveRequest, getSellersListRequest, getCategoriesRequest } from "../../store/e-commerce/actions";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import defaultLogoImg from "../../../images/companies/img-2.png";

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
    manager_first_name: "",
    manager_last_name: "",
    manager_email: "",
    manager_phone: "",
    manager_password: "",
    manager_password_confirm: "",
    category_id: "",
};

const StoresBreakdown = () => {
    document.title = "Stores Breakdown | LEKIT Ltd";
    const dispatch = useDispatch();
    const { status } = useParams();

    const [searchTerm, setSearchTerm] = useState("");
    const [stores, setStores] = useState([]);

    const [sellersList, setSellersList] = useState([]);
    const [storesCategoriesList, setStoresCategoriesList] = useState([]);

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

    const ecommerceSelector = createSelector(
        state => state.ecommerce,
        ecommerce => ({
            allstores: ecommerce.stores,
            sellersListForStore: ecommerce.sellersList,
            storesCategories: ecommerce.storesCategories,
        })
    );
    const { allstores, sellersListForStore, storesCategories } = useSelector(ecommerceSelector);

    useEffect(() => {
        setStores(allstores)
    }, [allstores]);

    useEffect(() => {
        setSellersList(sellersListForStore || []);
        console.log("Sellers List for Store:", sellersListForStore);
    }, [sellersListForStore]);

    useEffect(() => {
        const list = storesCategories || [];
        setStoresCategoriesList(list);
    }, [storesCategories]);

    useEffect(() => {
        dispatch(getCategoriesRequest());
        dispatch(getSellersListRequest());

        const requestQuery = {
            status: status === 'all' ? '' : status,
            searchKeyword: searchTerm
        };
        dispatch(getStoresRequest(requestQuery));
    }, [dispatch, status, searchTerm]);

    const resetForm = () => {
        setFormValues({ ...initialFormState });
        setErrors({});
        setTouched({});
        setPasswordsMatch(true);
    };

    const openAddModal = () => {
        setModalMode("add");
        setCurrentRecord(null);
        resetForm();
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

        if (!formValues.seller_id) newErrors.seller_id = "Seller is required";
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

        if (!formValues.manager_first_name)
            newErrors.manager_first_name = "Manager First Name is required";
        if (!formValues.manager_last_name)
            newErrors.manager_last_name = "Manager Last Name is required";
        if (!formValues.manager_email) newErrors.manager_email = "Manager Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.manager_email))
            newErrors.manager_email = "Invalid email format";

        if (modalMode === "add") {
            if (!formValues.manager_password)
                newErrors.manager_password = "Password is required";
            else if (formValues.manager_password.length < 8)
                newErrors.manager_password = "Password must be at least 8 characters";

            if (!formValues.manager_password_confirm)
                newErrors.manager_password_confirm = "Confirm Password is required";
            else if (formValues.manager_password !== formValues.manager_password_confirm) {
                newErrors.manager_password_confirm = "Passwords do not match";
                setPasswordsMatch(false);
            } else {
                setPasswordsMatch(true);
            }
        }

        if (!formValues.category_id) newErrors.category_id = "Category is required";

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
        let val;
        if (type === "checkbox") {
            // convert checkbox to numeric 1/0 so compare logic remains consistent
            val = checked ? 1 : 0;
        } else {
            val = value;
        }
        setFormValues((prev) => ({
            ...prev,
            [name]: val,
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

                formData.append('manager_first_name', formValues.manager_first_name);
                formData.append('manager_last_name', formValues.manager_last_name);
                formData.append('manager_email', formValues.manager_email);
                formData.append('manager_phone', formValues.manager_phone || '');
                formData.append('manager_password', formValues.manager_password);
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
                    id: currentRecord.id,
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
                                    {sellersList.map((s) => (
                                        <option key={s.id} value={s.seller_profile.id}>
                                            {s.seller_profile?.shop_name || "No Shop Name"}
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
                                        {sellersList.map((seller) => (
                                            <option key={seller.seller_profile.id} value={seller.seller_profile.id}>
                                                {seller.seller_profile?.shop_name || "-"}
                                            </option>
                                        ))}
                                    </Input>
                                    {hasError("seller_id") && (
                                        <FormFeedback>{errors.seller_id}</FormFeedback>
                                    )}
                                </FormGroup>

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

                                <Row>
                                    <Col md={6} className="d-flex align-items-end pb-3">
                                        <FormGroup check className="form-switch">
                                            <Input
                                                type="checkbox"
                                                name="status"
                                                id="field-published"
                                                checked={formValues.status === 1}
                                                onChange={handleInputChange}
                                            />
                                            <Label check for="field-published">
                                                Active / Inactive
                                            </Label>
                                        </FormGroup>
                                    </Col>
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
                                                        checked={Number(formValues.opening_hours[dayIndex]?.is_closed) === 1}
                                                        onChange={() => {
                                                            const closed = Number(formValues.opening_hours[dayIndex]?.is_closed);
                                                            handleOpeningHoursChange(dayIndex, 'is_closed', closed === 1 ? 0 : 1);
                                                        }}
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
                                                        <Label for={`${dayIndex}-open`}>Open</Label>
                                                        <Input
                                                            type="time"
                                                            id={`${dayIndex}-open`}
                                                            value={formValues.opening_hours[dayIndex]?.open || ""}
                                                            onChange={(e) =>
                                                                handleOpeningHoursChange(dayIndex, "open", e.target.value)
                                                            }
                                                            invalid={hasError(`day_${dayIndex}_open`)}
                                                        />
                                                        {hasError(`day_${dayIndex}_open`) && (
                                                            <FormFeedback>{errors[`day_${dayIndex}_open`]}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for={`${dayIndex}-close`}>Close</Label>
                                                        <Input
                                                            type="time"
                                                            id={`${dayIndex}-close`}
                                                            value={formValues.opening_hours[dayIndex]?.close || ""}
                                                            onChange={(e) =>
                                                                handleOpeningHoursChange(dayIndex, "close", e.target.value)
                                                            }
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
                                    <Label>Logo</Label>
                                    {formValues.logo_preview ? (
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={formValues.logo_preview}
                                                alt="Logo Preview"
                                                className="rounded me-2"
                                                style={{ width: 100, height: 100, objectFit: "contain" }}
                                            />
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleImageRemove("logo")}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <Input
                                            type="file"
                                            onChange={(e) => handleImageUpload(e, "logo")}
                                            accept="image/*"
                                            invalid={hasError("logo")}
                                        />
                                    )}
                                    {hasError("logo") && <FormFeedback>{errors.logo}</FormFeedback>}
                                </FormGroup>

                                <FormGroup>
                                    <Label>Main Banner</Label>
                                    {formValues.main_banner_preview ? (
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={formValues.main_banner_preview}
                                                alt="Main Banner Preview"
                                                className="rounded me-2"
                                                style={{ width: 200, height: 100, objectFit: "contain" }}
                                            />
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleImageRemove("main_banner")}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <Input
                                            type="file"
                                            onChange={(e) => handleImageUpload(e, "main_banner")}
                                            accept="image/*"
                                            invalid={hasError("main_banner")}
                                        />
                                    )}
                                    {hasError("main_banner") && (
                                        <FormFeedback>{errors.main_banner}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label>Banner</Label>
                                    {formValues.banner_preview ? (
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={formValues.banner_preview}
                                                alt="Banner Preview"
                                                className="rounded me-2"
                                                style={{ width: 200, height: 100, objectFit: "contain" }}
                                            />
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleImageRemove("banner")}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <Input
                                            type="file"
                                            onChange={(e) => handleImageUpload(e, "banner")}
                                            accept="image/*"
                                            invalid={hasError("banner")}
                                        />
                                    )}
                                    {hasError("banner") && <FormFeedback>{errors.banner}</FormFeedback>}
                                </FormGroup>
                            </TabContent>
                        )}

                        {/* TAB 4: Social & Other */}
                        {activeTab === "4" && (
                            <TabContent tabId="4">
                                <FormGroup>
                                    <Label for="facebook">Facebook</Label>
                                    <Input
                                        type="url"
                                        name="facebook"
                                        id="facebook"
                                        value={formValues.facebook}
                                        onChange={handleInputChange}
                                        placeholder="https://facebook.com/yourpage"
                                        invalid={hasError("facebook")}
                                    />
                                    {hasError("facebook") && (
                                        <FormFeedback>{errors.facebook}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="youtube">YouTube</Label>
                                    <Input
                                        type="url"
                                        name="youtube"
                                        id="youtube"
                                        value={formValues.youtube}
                                        onChange={handleInputChange}
                                        placeholder="https://youtube.com/yourchannel"
                                        invalid={hasError("youtube")}
                                    />
                                    {hasError("youtube") && (
                                        <FormFeedback>{errors.youtube}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="twitter">Twitter</Label>
                                    <Input
                                        type="url"
                                        name="twitter"
                                        id="twitter"
                                        value={formValues.twitter}
                                        onChange={handleInputChange}
                                        placeholder="https://twitter.com/yourprofile"
                                        invalid={hasError("twitter")}
                                    />
                                    {hasError("twitter") && (
                                        <FormFeedback>{errors.twitter}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="linkedin">LinkedIn</Label>
                                    <Input
                                        type="url"
                                        name="linkedin"
                                        id="linkedin"
                                        value={formValues.linkedin}
                                        onChange={handleInputChange}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        invalid={hasError("linkedin")}
                                    />
                                    {hasError("linkedin") && (
                                        <FormFeedback>{errors.linkedin}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="instagram">Instagram</Label>
                                    <Input
                                        type="url"
                                        name="instagram"
                                        id="instagram"
                                        value={formValues.instagram}
                                        onChange={handleInputChange}
                                        placeholder="https://instagram.com/yourprofile"
                                        invalid={hasError("instagram")}
                                    />
                                    {hasError("instagram") && (
                                        <FormFeedback>{errors.instagram}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="store_comments">Store Comments</Label>
                                    <Input
                                        type="textarea"
                                        name="store_comments"
                                        id="store_comments"
                                        value={formValues.store_comments}
                                        onChange={handleInputChange}
                                        placeholder="Internal comments about the store"
                                        rows="3"
                                    />
                                </FormGroup>
                            </TabContent>
                        )}

                        {/* TAB 5: Store Manager */}
                        {activeTab === "5" && (
                            <TabContent tabId="5">
                                <FormGroup>
                                    <Label for="manager_first_name">Manager First Name *</Label>
                                    <Input
                                        type="text"
                                        name="manager_first_name"
                                        id="manager_first_name"
                                        value={formValues.manager_first_name}
                                        onChange={handleInputChange}
                                        placeholder="First Name"
                                        invalid={hasError("manager_first_name")}
                                    />
                                    {hasError("manager_first_name") && (
                                        <FormFeedback>{errors.manager_first_name}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="manager_last_name">Manager Last Name *</Label>
                                    <Input
                                        type="text"
                                        name="manager_last_name"
                                        id="manager_last_name"
                                        value={formValues.manager_last_name}
                                        onChange={handleInputChange}
                                        placeholder="Last Name"
                                        invalid={hasError("manager_last_name")}
                                    />
                                    {hasError("manager_last_name") && (
                                        <FormFeedback>{errors.manager_last_name}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="manager_email">Manager Email *</Label>
                                    <Input
                                        type="email"
                                        name="manager_email"
                                        id="manager_email"
                                        value={formValues.manager_email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        invalid={hasError("manager_email")}
                                    />
                                    {hasError("manager_email") && (
                                        <FormFeedback>{errors.manager_email}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="manager_phone">Manager Phone</Label>
                                    <Input
                                        type="text"
                                        name="manager_phone"
                                        id="manager_phone"
                                        value={formValues.manager_phone}
                                        onChange={handleInputChange}
                                        placeholder="Phone number"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="manager_password">Password *</Label>
                                    <Input
                                        type="password"
                                        name="manager_password"
                                        id="manager_password"
                                        value={formValues.manager_password}
                                        onChange={handleInputChange}
                                        placeholder="Password (min 8 characters)"
                                        invalid={hasError("manager_password")}
                                    />
                                    {hasError("manager_password") && (
                                        <FormFeedback>{errors.manager_password}</FormFeedback>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="manager_password_confirm">Confirm Password *</Label>
                                    <Input
                                        type="password"
                                        name="manager_password_confirm"
                                        id="manager_password_confirm"
                                        value={formValues.manager_password_confirm}
                                        onChange={handleInputChange}
                                        placeholder="Confirm Password"
                                        invalid={hasError("manager_password_confirm") || !passwordsMatch}
                                    />
                                    {(hasError("manager_password_confirm") || !passwordsMatch) && (
                                        <FormFeedback>
                                            {errors.manager_password_confirm || "Passwords do not match"}
                                        </FormFeedback>
                                    )}
                                </FormGroup>

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
                                        {storesCategoriesList.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                    </Input>
                                    {hasError("category_id") && (
                                        <FormFeedback>{errors.category_id}</FormFeedback>
                                    )}
                                </FormGroup>
                            </TabContent>
                        )}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    {modalMode !== "view" && (
                        <Button type="submit" color="primary" onClick={handleSave} disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" /> : "Save"}
                        </Button>
                    )}
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};

export default StoresBreakdown;
