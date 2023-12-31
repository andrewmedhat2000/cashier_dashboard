import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { axiosInstance } from "../config/axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function AddCardInfo() {
  const { phone } = useParams();
  console.log(phone);

  const creditCardInfo = useFormik({
    initialValues: {
      creditCardNumber: "",
      creditCardExpiryDate: "",
      creditCardCVV: "",
      creditCardType: "",
    },
    validationSchema: yup.object({
      creditCardNumber: yup.string().required("Required").min(16),
      creditCardExpiryDate: yup.string().required("Required"),
      creditCardCVV: yup.string().required("Required"),
      creditCardType: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      values = { ...values, phone: phone };
      axiosInstance
        .post(`/user/addcardinfo/`, values)
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
        })
        .catch((e) => {
          console.log(e);
          toast.error(e.response.data.message);
        });
    },
  });
  return (
    <div className="contact">
      <div>
        <div className="container">
          <div className="form">
            <h2>Add Your Card Info</h2>
            <form onSubmit={creditCardInfo.handleSubmit}>
              <div className="box">
                <div className="lable">
                  <h4>Credit Card Number</h4>
                </div>
                <div className="input">
                  <input
                    type="text"
                    name="creditCardNumber"
                    onChange={creditCardInfo.handleChange}
                    value={creditCardInfo.values.creditCardNumber}
                    placeholder="Credit Card Number"
                  ></input>
                </div>
              </div>
              <div className="box">
                <div className="lable">
                  <h4>Credit Card Expiry Date</h4>
                </div>
                <div className="input">
                  <input
                    type="text"
                    placeholder="Credit Card Expiry Date"
                    name="creditCardExpiryDate"
                    onChange={creditCardInfo.handleChange}
                    value={creditCardInfo.values.creditCardExpiryDate}
                  ></input>
                </div>
              </div>

              <div className="box">
                <div className="lable">
                  <h4>credit Card CVV</h4>
                </div>
                <div className="input">
                  <input
                    type="text"
                    placeholder="credit Card CVV"
                    name="creditCardCVV"
                    onChange={creditCardInfo.handleChange}
                    value={creditCardInfo.values.creditCardCVV}
                  ></input>
                </div>
              </div>

              <div className="box">
                <div className="lable">
                  <h4>credit Card Type</h4>
                </div>
                <div className="input">
                  <input
                    type="text"
                    placeholder="credit Card Type"
                    name="creditCardType"
                    onChange={creditCardInfo.handleChange}
                    value={creditCardInfo.values.creditCardType}
                  ></input>
                </div>
              </div>
              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
