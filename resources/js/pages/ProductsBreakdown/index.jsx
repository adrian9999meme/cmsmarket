import React, { useEffect, useRef, useState } from "react";
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
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";

import {
  getProducts,
  addProductRequest,
  editProductRequest,
  deleteProductRequest,
  getStoresRequest,
} from "../../store/e-commerce/actions";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import api from "../../store/api";
import { GET_PRODUCT_CATEGORIES_API } from "../../store/endpoints";

const initialFormState = {
  name: "",
  price: "",
  store: "",
  category: "",
  current_stock: "0",
  unit: "pc",
};

const ProductsBreakdown = () => {
  document.title = "Products | LEKIT Ltd";

  const { subdomain } = useParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState({
    subdomain: "all",
    keyword: "",
  });

  const queryRef = useRef(query);
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const ecommerceSelector = createSelector(
    (state) => state.ecommerce,
    (ecommerce) => ({
      allProducts: ecommerce.products || [],
      stores: ecommerce.stores || [],
    })
  );
  const { allProducts, stores } = useSelector(ecommerceSelector);

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      subdomain: subdomain || "all",
    }));
  }, [subdomain]);

  useEffect(() => {
    dispatch(
      getProducts({
        subdomain: query.subdomain === "all" ? "" : query.subdomain,
        keyword: query.keyword,
      })
    );
  }, [dispatch, query.subdomain, query.keyword]);

  useEffect(() => {
    setProducts(allProducts);
  }, [allProducts]);

  useEffect(() => {
    dispatch(getStoresRequest({}));
  }, [dispatch]);

  useEffect(() => {
    api.get(GET_PRODUCT_CATEGORIES_API).then((res) => {
      if (res.data?.success) setCategories(res.data.data || []);
    });
  }, []);

  const getRefetchQuery = () => ({
    subdomain: queryRef.current.subdomain === "all" ? "" : queryRef.current.subdomain,
    keyword: queryRef.current.keyword,
  });

  const handleSearch = () => {
    setQuery((prev) => ({ ...prev, keyword }));
    dispatch(
      getProducts({
        subdomain: queryRef.current.subdomain === "all" ? "" : queryRef.current.subdomain,
        keyword,
      })
    );
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentProduct(null);
    setFormValues(initialFormState);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (row) => {
    setModalMode("edit");
    setCurrentProduct(row);
    const statusVal =
      row.status === "published" || row.status === 1 || row.status === "1"
        ? 1
        : 0;
    setFormValues({
      name: row.name || "",
      price: String(row.price || ""),
      current_stock: String(row.current_stock ?? "0"),
      status: statusVal,
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const err = {};
    if (modalMode === "add") {
      if (!formValues.name?.trim()) err.name = "Name is required";
      if (!formValues.price || parseFloat(formValues.price) < 0) err.price = "Valid price is required";
      if (!formValues.store) err.store = "Store is required";
      if (!formValues.category) err.category = "Category is required";
    } else {
      if (!formValues.name?.trim()) err.name = "Name is required";
      if (!formValues.price || parseFloat(formValues.price) < 0) err.price = "Valid price is required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(
      addProductRequest({
        name: formValues.name.trim(),
        price: parseFloat(formValues.price),
        store: formValues.store,
        category: formValues.category,
        current_stock: parseInt(formValues.current_stock, 10) || 0,
        unit: formValues.unit || "pc",
        refetchQuery: getRefetchQuery(),
      })
    );
    closeModal();
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!validateForm() || !currentProduct) return;
    dispatch(
      editProductRequest(currentProduct.id, {
        name: formValues.name.trim(),
        price: parseFloat(formValues.price),
        current_stock: parseInt(formValues.current_stock, 10) ?? 0,
        status: formValues.status,
        refetchQuery: getRefetchQuery(),
      })
    );
    closeModal();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    dispatch(deleteProductRequest(id, getRefetchQuery()));
  };

  const getStatusBadge = (status) => {
    if (status === 1 || status === "1" || status === "published")
      return <Badge color="success">Active</Badge>;
    if (status === 0 || status === "0" || status === "unpublished")
      return <Badge color="warning">Inactive</Badge>;
    if (status === "pending") return <Badge color="info">Pending</Badge>;
    return <Badge color="secondary">Unknown</Badge>;
  };

  const getImageUrl = (thumbnail) => {
    if (!thumbnail || !Array.isArray(thumbnail)) return null;
    const img = thumbnail.find((t) => t?.id);
    return img?.original_image ? `storage/${img.original_image}` : null;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Products" breadcrumbItem="All Products" />

          <Row className="mb-3">
            <Col sm={6} className="d-flex align-items-center gap-2">
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button color="primary" onClick={handleSearch}>
                  Search
                </Button>
              </InputGroup>
            </Col>
            <Col sm={6} className="text-end">
              <Button color="primary" onClick={openAddModal}>
                <i className="bx bx-plus me-1"></i> ADD PRODUCT
              </Button>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">All Products</h5>
                    <p className="text-muted small mb-0">
                      Total: {products.length} product{products.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="table-responsive">
                    <Table className="table table-bordered table-nowrap align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Store</th>
                          <th className="text-center">Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {getImageUrl(row.thumbnail) ? (
                                  <img
                                    src={getImageUrl(row.thumbnail)}
                                    alt=""
                                    className="rounded"
                                    style={{ width: 40, height: 40, objectFit: "cover" }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="rounded bg-light d-flex align-items-center justify-content-center"
                                    style={{ width: 40, height: 40 }}
                                  >
                                    <i className="bx bx-image text-muted" />
                                  </div>
                                )}
                                <div>
                                  <p className="mb-0 fw-medium">{row.name || "-"}</p>
                                  <small className="text-muted">{row.slug || ""}</small>
                                </div>
                              </div>
                            </td>
                            <td>£{parseFloat(row.price || 0).toFixed(2)}</td>
                            <td>{row.current_stock ?? "-"}</td>
                            <td>{getStatusBadge(row.status)}</td>
                            <td>{row.store_name ?? row.stores_id ?? "-"}</td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-1">
                                <Button
                                  color="link"
                                  className="p-1"
                                  title="Edit"
                                  onClick={() => openEditModal(row)}
                                >
                                  <i className="bx bx-edit-alt font-size-18"></i>
                                </Button>
                                <Button
                                  color="link"
                                  className="p-1 text-danger"
                                  title="Delete"
                                  onClick={() => handleDelete(row.id)}
                                >
                                  <i className="bx bx-trash font-size-18"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                              No products found.
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

      <Modal isOpen={modalOpen} toggle={closeModal} centered>
        <ModalHeader toggle={closeModal}>
          {modalMode === "add" ? "Add Product" : "Edit Product"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={modalMode === "add" ? handleAdd : handleEdit}>
            <FormGroup>
              <Label>Name *</Label>
              <Input
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Product name"
                invalid={!!errors.name}
              />
              {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label>Price *</Label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formValues.price}
                onChange={handleInputChange}
                placeholder="0.00"
                invalid={!!errors.price}
              />
              {errors.price && <FormFeedback>{errors.price}</FormFeedback>}
            </FormGroup>
            {modalMode === "add" && (
              <>
                <FormGroup>
                  <Label>Store *</Label>
                  <Input
                    name="store"
                    type="select"
                    value={formValues.store}
                    onChange={handleInputChange}
                    invalid={!!errors.store}
                  >
                    <option value="">Select Store</option>
                    {(stores || []).map((s) => (
                      <option key={s.id} value={s.store_profile?.id}>
                        {s.store_profile?.store_name || s.full_name || s.id}
                      </option>
                    ))}
                  </Input>
                  {errors.store && <FormFeedback>{errors.store}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                  <Label>Category *</Label>
                  <Input
                    name="category"
                    type="select"
                    value={formValues.category}
                    onChange={handleInputChange}
                    invalid={!!errors.category}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </Input>
                  {errors.category && <FormFeedback>{errors.category}</FormFeedback>}
                </FormGroup>
              </>
            )}
            <FormGroup>
              <Label>Stock</Label>
              <Input
                name="current_stock"
                type="number"
                min="0"
                value={formValues.current_stock}
                onChange={handleInputChange}
                placeholder="0"
              />
            </FormGroup>
            {modalMode === "add" && (
              <FormGroup>
                <Label>Unit</Label>
                <Input
                  name="unit"
                  value={formValues.unit}
                  onChange={handleInputChange}
                  placeholder="pc"
                />
              </FormGroup>
            )}
            {modalMode === "edit" && (
              <FormGroup>
                <Label>Status</Label>
                <Input
                  name="status"
                  type="select"
                  value={formValues.status}
                  onChange={handleInputChange}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </Input>
              </FormGroup>
            )}
            <ModalFooter>
              <Button color="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {modalMode === "add" ? "Create" : "Update"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default ProductsBreakdown;
