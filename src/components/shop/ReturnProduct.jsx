import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { axiosInstance } from "../config/axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";

export default function ReturnProduct() {
  const [loading, setLoading] = useState(false);
  const [Phoneloading, setPhoneLoading] = useState(false);
  const [test, setTest] = useState(false);
  const [invoces, setInvoces] = useState([]);
  const [client, setClient] = useState();
  const Navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      invoiceId: "",
    },
    validationSchema: yup.object({
      invoiceId: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      axiosInstance
        .post("/user/returnproduct", values)
        .then((res) => {
          toast.success(res.data.message);
          setLoading(false);

          console.log(res);
          console.log(res.data.message);

          formik.resetForm();
          formikPhone.handleSubmit();
        })
        .catch((e) => {
          setLoading(false);

          console.log(e);
          toast.error(e.response.data.message);
        });
    },
  });

  const formikPhone = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: yup.object({
      phone: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setPhoneLoading(true);
      axiosInstance
        .get(`/user/invoice/${values.phone}`)
        .then((res) => {
          setPhoneLoading(false);

          console.log(res);
          console.log(res.data);
          setInvoces(res.data.invoices);
          setClient(res.data.client);
          !formik.values.invoiceId && toast.success(res.data.message);
        })
        .catch((e) => {
          setPhoneLoading(false);

          console.log(e);
          toast.error(e.response.data.message);
        });
    },
  });
  const setInvoice = (val) => {
    formik.values.invoiceId = val;
    setTest(!test);
  };
  return (
    <div className="contact">
      <div className="container return-product">
        <div className="form">
          <h2>Return Product</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="box">
              <div className="lable">
                <h4>Invoice Id</h4>
              </div>
              <div className="input">
                <input
                  type="text"
                  placeholder="Invoice Id"
                  value={formik.values.invoiceId}
                  name="invoiceId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></input>
              </div>
            </div>
            <button
              type="submit"
              style={loading ? { padding: "6px 36px" } : {}}
            >
              {loading ? <CircularProgress size="1.1rem" /> : <div>Done</div>}{" "}
            </button>
          </form>
        </div>
        <div className="form">
          <h2>Get Invoice</h2>
          <form onSubmit={formikPhone.handleSubmit}>
            <div className="box">
              <div className="lable">
                <h4>Phone</h4>
              </div>
              <div className="input">
                <input
                  type="text"
                  placeholder="Phone"
                  value={formikPhone.values.phone}
                  name="phone"
                  onChange={formikPhone.handleChange}
                  onBlur={formikPhone.handleBlur}
                ></input>
              </div>
            </div>
            <button
              type="submit"
              style={Phoneloading ? { padding: "6px 36px" } : {}}
            >
              {Phoneloading ? (
                <CircularProgress size="1.1rem" />
              ) : (
                <div>Done</div>
              )}{" "}
            </button>
          </form>
        </div>
      </div>
      <div className="invoce-card">
        <div className="invoce-card">
          {invoces.map((el) => (
            <div className="box" key={el._id}>
              <div className="text">
                <h4>Time: </h4>
                {el.updatedAt.replace("T", " ").slice(0, -8)}
              </div>
              <div className="text">
                <h4>Client Name: </h4>
                {client?.name}
              </div>
              <div className="text">
                <h4>Client phone: </h4>
                {client?.phone}
              </div>
              <div className="text">
                <h4>Client Id:</h4> {el?.client}
              </div>
              <div className="text">
                <h4>Product Id:</h4> {el?.productId}
              </div>
              <div className="text">
                <h4>Items: </h4>
                {el?.numberOfItems}
              </div>
              <div className="text">
                <h4>Tailored: </h4>
                {el?.tailored ? "true" : "false"}
              </div>
              <div className="text">
                <h4>Total Price:</h4> {el?.totalPrice}
              </div>
              <div className="text">
                <h4>Invoice Id: </h4>
                {el?.invoiceId}
              </div>
              <div className="text">
                <h4>User Id: </h4>
                {el?.userId}
              </div>

              <button onClick={() => setInvoice(el.invoiceId)}>retuen</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
