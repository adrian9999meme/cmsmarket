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
});

const RegisterAsCustomer = ({ navigate }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(registerUser({ ...values, registration_type: "customer" }, navigate));
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
      <div className="mt-4">
        <button className="btn btn-primary w-100" type="submit">
          Register as Customer
        </button>
      </div>
    </Form>
  );
};

export default RegisterAsCustomer;
