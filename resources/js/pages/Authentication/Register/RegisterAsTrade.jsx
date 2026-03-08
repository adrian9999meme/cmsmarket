import React from "react";
import { Form, Input, Label, FormFeedback } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";

import { registerUser } from "../../../store/actions";

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(5, "Min 5 characters").max(30).required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  company_name: Yup.string().required("Company name is required"),
  vat_number: Yup.string().nullable(),
  registration_number: Yup.string().nullable(),
});

const RegisterAsTrade = ({ navigate }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      company_name: "",
      vat_number: "",
      registration_number: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(registerUser({ ...values, registration_type: "trade" }, navigate));
    },
  });

  return (
    <Form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Label className="form-label">First Name</Label>
          <Input
            name="first_name"
            placeholder="First name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={formik.touched.first_name && !!formik.errors.first_name}
          />
          {formik.touched.first_name && formik.errors.first_name && (
            <FormFeedback type="invalid">{formik.errors.first_name}</FormFeedback>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <Label className="form-label">Last Name</Label>
          <Input
            name="last_name"
            placeholder="Last name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={formik.touched.last_name && !!formik.errors.last_name}
          />
          {formik.touched.last_name && formik.errors.last_name && (
            <FormFeedback type="invalid">{formik.errors.last_name}</FormFeedback>
          )}
        </div>
      </div>
      <div className="mb-3">
        <Label className="form-label">Company Name <span className="text-danger">*</span></Label>
        <Input
          name="company_name"
          placeholder="Company name"
          value={formik.values.company_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.company_name && !!formik.errors.company_name}
        />
        {formik.touched.company_name && formik.errors.company_name && (
          <FormFeedback type="invalid">{formik.errors.company_name}</FormFeedback>
        )}
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Label className="form-label">VAT Number</Label>
          <Input
            name="vat_number"
            placeholder="VAT number (optional)"
            value={formik.values.vat_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Label className="form-label">Registration Number</Label>
          <Input
            name="registration_number"
            placeholder="Registration number (optional)"
            value={formik.values.registration_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>
      <div className="mb-3">
        <Label className="form-label">Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="Enter email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.email && !!formik.errors.email}
        />
        {formik.touched.email && formik.errors.email && (
          <FormFeedback type="invalid">{formik.errors.email}</FormFeedback>
        )}
      </div>
      <div className="mb-3">
        <Label className="form-label">Password</Label>
        <Input
          name="password"
          type="password"
          placeholder="Enter password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.password && !!formik.errors.password}
        />
        {formik.touched.password && formik.errors.password && (
          <FormFeedback type="invalid">{formik.errors.password}</FormFeedback>
        )}
      </div>
      <div className="mb-3">
        <Label className="form-label">Confirm Password</Label>
        <Input
          name="password_confirmation"
          type="password"
          placeholder="Confirm password"
          value={formik.values.password_confirmation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.password_confirmation && !!formik.errors.password_confirmation}
        />
        {formik.touched.password_confirmation && formik.errors.password_confirmation && (
          <FormFeedback type="invalid">{formik.errors.password_confirmation}</FormFeedback>
        )}
      </div>
      <div className="alert alert-info py-2 small mb-3">
        Your trade account will require admin approval before you can access trade pricing.
      </div>
      <div className="mt-4">
        <button className="btn btn-primary w-100" type="submit">
          Register as Trade Customer
        </button>
      </div>
    </Form>
  );
};

export default RegisterAsTrade;
