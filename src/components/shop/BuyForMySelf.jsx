import React, { useState, useEffect } from "react";
import {
  FormControlLabel,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
export default function BuyForMySelf({
  isFormOpened,
  handleCloseDialog,
  props,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("*Should be a valid email")
        .required("Required"),
      password: yup.string().required("Required").min(8),
    }),
    onSubmit: (values) => {
      setLoading(true);
      axios
        .post("https://andrew-demo.onrender.com/user/login", values)
        .then((res) => {
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          setLoading(false);
          navigate("/buyForMe", { state: props });
        })
        .catch((e) => {
          setLoading(false);
          toast.error(e.response.data.message);
        });
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Dialog open={isFormOpened} className="buyForMySelf">
        <DialogTitle
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          LOGIN
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                sx={{ gridColumn: "span 2" }}
                id="text"
                label="Email"
                type="text"
                fullWidth
                variant="filled"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
              />
              <br></br>
              <br></br>
              <TextField
                sx={{ gridColumn: "span 2" }}
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="filled"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              //disabled={formik.isSubmitting}
              sx={{ fontSize: "20px" }}
            >
              {loading ? <CircularProgress size="1.5rem" /> : <div>LOGIN</div>}
            </Button>

            <Button onClick={handleCloseDialog} sx={{ fontSize: "20px" }}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
