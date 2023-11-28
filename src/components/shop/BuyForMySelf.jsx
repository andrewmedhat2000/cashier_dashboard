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
import { axiosInstance } from "../config/axios";
import { toast } from "react-toastify";

export default function BuyForMySelf({
  isFormOpened,
  handleCloseDialog,
  props,
}) {
  const [tailoringDetails, setTailorDetails] = useState(false);
  const [tailors, setTailor] = useState([]);

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
      name: "",
      tailorId: "",
    },
    validationSchema: yup.object({
      quantity: yup.string().required("Required"),
      tailoring: yup.string().required("Required"),

      description: tailoringDetails && yup.string().required("Required"),
      price: tailoringDetails && yup.string().required("Required"),
      name: tailoringDetails && yup.string().required("Required"),
      tailoringDescription:
        tailoringDetails && yup.string().required("Required"),
      tailorId: tailoringDetails && yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      values = { ...values, productId: props?._id };

      console.log(props?._id);

      return axiosInstance
        .post("/user/buyformyself", values)
        .then((res) => {
          console.log(res.data.message);

          toast.success(res.data.message);
          handleCloseDialog();
        })
        .catch((e) => {
          console.log(e);
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
          Buy Product For My Self Now
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                multiline
                autoFocus
                id="quantity"
                label="Quantity"
                type="text"
                fullWidth
                variant="standard"
                name="quantity"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quantity && formik.errors.quantity}
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
              <div>In Stock {props.stock}</div>
              <TextField
                sx={{ mt: "30px" }}
                id="text"
                label="Name"
                multiline
                type="text"
                fullWidth
                variant="standard"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                sx={{ mt: "30px" }}
                id="text"
                label="Description"
                multiline
                type="text"
                fullWidth
                variant="standard"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && formik.errors.description}
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />

              <FormControl>
                <FormLabel
                  id="demo-row-radio-buttons-group-label"
                  sx={{ padding: "30px" }}
                >
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
                  {tailoringDetails && (
                    <div style={{ width: "100%" }}>
                      <FormControl sx={{ mt: "15px" }} style={{ width: "85%" }}>
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
                        sx={{ mt: "10px" }}
                        id="text"
                        label="Tailoring Description"
                        multiline
                        type="text"
                        fullWidth
                        variant="standard"
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
                        sx={{ mt: "10px" }}
                        autoFocus
                        margin="dense"
                        id="price"
                        label="Price"
                        type="text"
                        fullWidth
                        variant="standard"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        error={formik.touched.price && formik.errors.price}
                        helperText={formik.touched.price && formik.errors.price}
                      />
                    </div>
                  )}
                </RadioGroup>

                {formik.errors.tailoring && formik.touched.tailoring && (
                  <FormHelperText sx={{ color: "red" }} id="tailoring">
                    {formik.errors.tailoring}
                  </FormHelperText>
                )}
              </FormControl>
            </form>
            <div>
              Total Price:{" "}
              {props?.price * formik.values.quantity +
                (formik.values.price && Number(formik.values.price))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              //disabled={formik.isSubmitting}
              sx={{ fontSize: "20px" }}
            >
              Buy
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
