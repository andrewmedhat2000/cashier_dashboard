import React, { useState } from "react";
import "../contact/contact.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { FormHelperText } from "@mui/material";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosInstance } from "../config/axios";

const Login = () => {
  const [passwordType, setPasswordType] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handelShowPassword = () => {
    setPasswordType(!passwordType);
  };

  const getPofile = async () => {
    await axiosInstance
      .get("/user/profile")
      .then(async (response) => {
        console.log(response.data.user._id);
        if (response.data.user.role === "tailor") {
          navigate(`/TailorHome/${response.data.user._id}`);
        } else {
          check();
        }
      })

      .catch((e) => {
        console.log(e);
        toast.error(e.response.data.message);
      });
  };

  const check = async () => {
    const QR = localStorage.getItem("QrId");

    if (QR) {
      navigate(`/BuyProductQR/${QR}`);
    } else {
      navigate("/home");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Should be a valid email").required("Required"),
      password: yup.string().required("Required").min(8),
    }),
    onSubmit: (values) => {
      setLoading(true);

      axios
        .post("https://andrew-demo.onrender.com/user/loginforall", values)
        .then(async (res) => {
          setLoading(false);
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          await getPofile();
        })

        .catch((e) => {
          setLoading(false);

          console.log(e);
          toast.error(e.response.data.message);
        });
    },
  });

  return (
    <>
      <div className="contact">
        <div style={{ marginTop: "300px" }}>
          <div className="container">
            <div className="form">
              <h2>Login To System</h2>
              <form onSubmit={formik.handleSubmit}>
                <div className="box">
                  <div className="lable">
                    <h4>E-mail</h4>
                  </div>
                  <div className="input">
                    <input
                      type="text"
                      name="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      placeholder="E-MAIL"
                      onBlur={formik.handleBlur}
                    ></input>
                    {formik.errors.email && formik.touched.email && (
                      <FormHelperText sx={{ color: "red" }} id="email">
                        {formik.errors.email}
                      </FormHelperText>
                    )}
                  </div>
                </div>
                <div className="box">
                  <div className="lable">
                    <h4>Password</h4>
                  </div>
                  <div className="input">
                    <div className="password-input">
                      <input
                        type={passwordType ? "text" : "password"}
                        placeholder="PASSWORD"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                      ></input>
                      <span
                        className="showPassword"
                        onClick={handelShowPassword}
                      >
                        {passwordType ? <AiFillEye /> : <AiFillEyeInvisible />}
                      </span>
                    </div>
                    {formik.errors.password && formik.touched.password && (
                      <FormHelperText sx={{ color: "red" }}>
                        {formik.errors.password}
                      </FormHelperText>
                    )}
                  </div>
                </div>

                <button
                  type="sublit"
                  style={loading ? { padding: "8px 38px" } : {}}
                >
                  {loading ? (
                    <CircularProgress size="1rem" />
                  ) : (
                    <div>Login</div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
