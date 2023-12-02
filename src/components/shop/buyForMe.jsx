import React, { useState, useEffect } from "react";
import {
  FormControlLabel,
  Button,
  TextField,
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
import { axiosInstance } from "../config/axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";

export default function BuyForMySelf() {
  const [loading, setLoading] = useState(false);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [tailoringDetails, setTailorDetails] = useState(false);
  const [tailors, setTailor] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();

  const item = location.state;
  console.log(item);
  const getAllTailors = () => {
    return axiosInstance
      .get("/user/alltailors")
      .then((res) => {
        console.log(res.data.tailors);
        setTailor(res.data.tailors);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getAllTailors();
  }, []);
  const formik = useFormik({
    initialValues: {
      quantity: "",
      tailoring: "",
      description: "",
      price: "",
      tailoringDescription: "",
      name: item?.name ? item?.name : "t-shirt",
      tailorId: "",
    },
    validationSchema: yup.object({
      quantity: yup.string().required("Required"),
      tailoring: yup.string().required("Required"),

      description: tailoringDetails && yup.string().required("Required"),
      price: tailoringDetails && yup.string().required("Required"),

      tailoringDescription:
        tailoringDetails && yup.string().required("Required"),
      tailorId: tailoringDetails && yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setLoading(true);

      values = { ...values, productId: item?._id };

      return axiosInstance
        .post("/user/buyformyself", values)
        .then((res) => {
          toast.success(res.data.message);

          setLoading(false);

          navigate("/home");
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);

          toast.error(e.response.data.message);
        });
    },
  });

  return (
    <Box sx={{ mx: "50px", my: "30px" }}>
      <div
        style={{
          fontSize: "25px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Buy Product For My Self Now
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            mt: "30px",
          }}
        >
          <Box sx={{ gridColumn: "span 2" }}>
            <TextField
              multiline
              id="quantity"
              label="Quantity"
              type="text"
              fullWidth
              variant="filled"
              name="quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.quantity && formik.errors.quantity}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />
            <div style={{ marginTop: "5px" }}>In Stock {item.stock}</div>
          </Box>

          <TextField
            sx={{ gridColumn: "span 2" }}
            id="text"
            label="Description"
            multiline
            type="text"
            fullWidth
            variant="filled"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
            helperText={formik.touched.description && formik.errors.description}
          />

          <FormControl sx={{ gridColumn: "span 2" }}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Tailoring
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={formik.values.tailoring}
              onChange={formik.handleChange}
            >
              <FormControlLabel
                name="tailoring"
                control={<Radio />}
                label="Yes "
                value="yes"
                onChange={() => setTailorDetails(true)}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="No"
                name="tailoring"
                onChange={() => setTailorDetails(false)}
              />
            </RadioGroup>

            {formik.errors.tailoring && formik.touched.tailoring && (
              <FormHelperText sx={{ color: "red" }} id="tailoring">
                {formik.errors.tailoring}
              </FormHelperText>
            )}
          </FormControl>
          {tailoringDetails && (
            <>
              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel>Tailor Name</InputLabel>
                <Select
                  name="tailorId"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.tailorId}
                  input={<OutlinedInput label="Tailor Name" />}
                >
                  {tailors.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.errors.tailorId && formik.touched.tailorId && (
                  <FormHelperText sx={{ color: "red" }} id="tailorId">
                    {formik.errors.tailorId}
                  </FormHelperText>
                )}
              </FormControl>
              <TextField
                sx={{ gridColumn: "span 2" }}
                id="text"
                label="Tailoring Description"
                multiline
                type="text"
                fullWidth
                variant="filled"
                name="tailoringDescription"
                value={formik.values.tailoringDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tailoringDescription &&
                  formik.errors.tailoringDescription
                }
                helperText={
                  formik.touched.tailoringDescription &&
                  formik.errors.tailoringDescription
                }
              />
              <TextField
                sx={{ gridColumn: "span 2" }}
                autoFocus
                id="price"
                label="Price"
                type="text"
                fullWidth
                variant="filled"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && formik.errors.price}
                helperText={formik.touched.price && formik.errors.price}
              />
            </>
          )}
        </Box>
        <div style={{ marginTop: "10px", fontWeight: 600 }}>
          Total Price:{" "}
          {item?.price * formik.values.quantity +
            (formik.values.price && Number(formik.values.price))}
        </div>

        <div style={{ textAlign: "end" }}>
          <Button type="submit" color="secondary" variant="contained">
            {loading ? (
              <CircularProgress
                size="1.6rem"
                sx={{
                  mx: 1,
                }}
              />
            ) : (
              <div>Buy</div>
            )}
          </Button>
        </div>
      </form>
    </Box>
  );
}
