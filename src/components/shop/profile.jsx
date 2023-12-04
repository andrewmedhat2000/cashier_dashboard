import { axiosInstance } from "../config/axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, TextField, Box } from "@mui/material";

import * as yup from "yup";

import { useFormik } from "formik";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [data, setData] = useState();

  const getPofile = async () => {
    setLoading(true);
    await axiosInstance
      .get("/user/profile")
      .then((response) => {
        setLoading(false);
        setData(response.data.user);
      })
      .catch((e) => {
        setLoading(false);

        console.log(e);
        toast.error(e.response.data.message);
      });
  };

  useEffect(() => {
    getPofile();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.name,
      email: data?.email,
      password: data?.password,
      phone: data?.phone,
      role: data?.role,
      discountPercentage: data?.discountPercentage,
      employeeId: data?.employeeId,
      wallet: data?.wallet,
    },

    validationSchema: yup.object({
      name: yup.string().required("Required"),
      email: yup.string().email().required("Required"),
      phone: yup.string().required("Required"),
      role: yup.string().required("Required"),
      DOB: yup.string(),
    }),
    onSubmit: async (values) => {
      setUpdateLoading(true);
      await axiosInstance
        .patch(`/user/${data._id}`, values, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setUpdateLoading(false);

          toast.success(res.data.message);
        })
        .then(() => getPofile())
        .catch((e) => {
          setUpdateLoading(false);

          console.log(e);
          toast.error(e.response.data.message);
        });
    },
  });

  return (
    <div
      className="profile"
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "2rem",
        textAlign: "center",
      }}
    >
      {loading ? (
        <CircularProgress size="3rem" sx={{ m: 8 }} />
      ) : (
        <div style={{ width: "85%", marginBottom: "1.5rem" }}>
          <img src={data?.image?.path} alt="Profie_Image"></img>
          <form onSubmit={formik.handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values?.name}
                name="name"
                error={formik.touched.name && formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values?.email}
                name="email"
                error={formik.touched.email && formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values?.phone}
                name="phone"
                error={formik.touched.phone && formik.errors.phone}
                helperText={formik.touched.phone && formik.errors.phone}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                disabled
                fullWidth
                variant="filled"
                type="text"
                label="Employee Id"
                value={formik.values?.employeeId}
                name="employeeId"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                disabled
                variant="filled"
                type="text"
                label="Wallet"
                value={formik.values?.wallet}
                name="wallet"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                disabled
                variant="filled"
                type="text"
                label="discountPercentage"
                value={`${formik.values?.discountPercentage} %`}
                name="Discount Percentage"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                disabled
                variant="filled"
                type="text"
                label="User Role"
                value={formik.values?.role}
                onChange={formik.handleChange}
                name="role"
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {updateLoading ? (
                  <CircularProgress
                    size="1.5rem"
                    sx={{
                      mx: 5,
                    }}
                  />
                ) : (
                  <div> Update Now</div>
                )}
              </Button>
            </Box>
          </form>
        </div>
      )}
    </div>
  );
}
