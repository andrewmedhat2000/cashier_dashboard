import React, { useState } from "react";
import "../contact/contact.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Box, FormHelperText } from "@mui/material";

import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosInstance } from "../config/axios";
import "./login.css";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

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
    <Box className="login">
      <Box className="login_box">
        <Box className="left">
          <Box className="contact">
            <form onSubmit={formik.handleSubmit}>
              <h3>SIGN IN</h3>
              <input
                type="text"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="EMAIL"
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email && (
                <FormHelperText sx={{ color: "red" }} id="email">
                  {formik.errors.email}
                </FormHelperText>
              )}
              <Box className="password-input">
                <input
                  type={passwordType ? "text" : "password"}
                  placeholder="PASSWORD"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                />
                <Box className="showPassword" onClick={handelShowPassword}>
                  {passwordType ? <AiFillEye /> : <AiFillEyeInvisible />}
                </Box>
              </Box>
              {formik.errors.password && formik.touched.password && (
                <FormHelperText sx={{ color: "red" }} id="email">
                  {formik.errors.password}
                </FormHelperText>
              )}
              <button
                className="submit"
                style={loading ? { padding: "10px 75px" } : {}}
                type="submit"
              >
                {loading ? (
                  <CircularProgress
                    size="1.5rem"
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : (
                  <div>Login</div>
                )}
              </button>
            </form>
          </Box>
        </Box>
        <Box className="right">
          <Box className="right-text">
            <h5>Welcome to your control panal </h5>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
