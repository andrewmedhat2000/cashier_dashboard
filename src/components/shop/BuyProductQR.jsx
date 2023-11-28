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
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function BuyProductQR() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [tailoringDetails, setTailorDetails] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAddCard, setIsAddCard] = useState(false);
  const creditCardType = ["Visa", "Master Card"];
  const [tailors, setTailor] = useState([]);

  const checkLogin = async () => {
    localStorage.removeItem("QrId");
    const user = await localStorage.getItem("token");
    if (!user) {
      toast.error("Please Login First");
      localStorage.setItem("QrId", id);
      navigate("/");
    }
  };

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
    checkLogin();
    getAllTailors();
  }, []);
  const buyProduct = (values) => {
    setLoading(true);
    return axiosInstance
      .post(`/user/buy`, values)
      .then((response) => {
        toast.success(response.data.message);
        setIsClient(false);
        setIsAddCard(false);
        setLoading(false);
        navigate("/home");
      })
      .catch((error) => {
        setLoading(false);

        toast.error(error.response.data.message);
        if (error.response) {
          console.log(error.response);
          if (error.response.data.err.statusCode === 404) {
            setIsClient(true);
            //Navigate("/addClient");
          } else if (error.response.data.err.statusCode === 401) {
            setIsAddCard(true);
            //Navigate(`/addCardInfo/${values.phone}`);
          } else {
            toast.error(error);
            console.log(error);
          }
        } else {
          toast.error("Something wrong happened while logining");
        }
      });
  };
  const addClient = (values) => {
    setLoading(true);

    //return console.log(values);
    return axiosInstance
      .post("/user/addclient", values)
      .then((res) => {
        console.log(res.data.message);

        //toast.success(res.data.message);
      })
      .catch((e) => {
        setLoading(false);

        console.log(e);
        toast.error(e.response.data.message);
      });
  };
  const addCard = (values) => {
    setLoading(true);

    return axiosInstance
      .post(`/user/addcardinfo/`, values)
      .then((res) => {
        //toast.success(res.data.message);
      })
      .catch((e) => {
        setLoading(false);

        console.log(e);
        toast.error(e.response.data.message);
      });
  };
  const formik = useFormik({
    initialValues: {
      quantity: "",
      tailoring: "",
      tailoringDescription: "",
      phone: "",
      phoneName: "",
      price: "",
      paymentMethod: "",
      name: "",
      description: "",
      gender: "",
      creditCardNumber: "",
      creditCardExpiryDate: "",
      creditCardCVV: "",
      creditCardType: "",
      tailorId: "",
    },

    validationSchema: yup.object({
      quantity: yup.string().required("Required"),
      tailoring: yup.string().required("Required"),
      phone: yup.string().required("Required"),
      paymentMethod: yup.string().required("Required"),
      tailoringDescription:
        tailoringDetails && yup.string().required("Required"),
      description: yup.string().required("Required"),
      price: tailoringDetails && yup.string().required("Required"),
      tailorId: tailoringDetails && yup.string().required("Required"),

      name: yup.string().required("Required"),
      gender: isClient && yup.string().required("Required"),
      phoneName: isClient && yup.string().required("Required"),

      creditCardNumber: isAddCard && yup.string().required("Required").min(16),
      creditCardExpiryDate: isAddCard && yup.string().required("Required"),
      creditCardCVV: isAddCard && yup.string().required("Required"),
      creditCardType: isAddCard && yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      values = { ...values, productId: id };

      const valuesAddClient = {
        phone: values.phone,
        name: values.name,
        gender: values.gender,
      };
      const valuesAddCard = {
        phone: values.phone,
        creditCardNumber: values.creditCardNumber,
        creditCardExpiryDate: values.creditCardExpiryDate,
        creditCardCVV: values.creditCardCVV,
        creditCardType: values.creditCardType,
      };
      if (!isClient && !isAddCard) {
        buyProduct(values);
      } else if (isClient && !isAddCard) {
        addClient(valuesAddClient).then(() => {
          buyProduct(values);
        });
      } else if (isAddCard) {
        addCard(valuesAddCard).then(() => {
          buyProduct(values);
        });
      }
    },
  });
  return (
    <Box>
      <form
        onSubmit={formik.handleSubmit}
        style={{ marginInline: "20%", marginTop: "5%", marginBottom: "5%" }}
      >
        <TextField
          autoFocus
          margin="dense"
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

        <TextField
          sx={{ mt: "30px" }}
          id="text"
          label="name"
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
          helperText={formik.touched.description && formik.errors.description}
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
                  sx={{ mt: "30px" }}
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
        <TextField
          sx={{ mt: "30px" }}
          id="text"
          label="Phone"
          multiline
          type="text"
          fullWidth
          variant="standard"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && formik.errors.phone}
          helperText={formik.touched.phone && formik.errors.phone}
        />
        {isClient && (
          <Box>
            <TextField
              sx={{ mt: "30px" }}
              id="text"
              label="Name"
              multiline
              type="text"
              fullWidth
              variant="standard"
              name="phoneName"
              value={formik.values.phoneName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneName && formik.errors.phoneName}
              helperText={formik.touched.phoneName && formik.errors.phoneName}
            />

            <FormControl>
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ padding: "30px" }}
              >
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  name="gender"
                  control={<Radio />}
                  label="Male "
                  value="male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                  name="gender"
                />
              </RadioGroup>
            </FormControl>
            {formik.errors.gender && formik.touched.gender && (
              <FormHelperText sx={{ color: "red" }} id="gender">
                {formik.errors.gender}
              </FormHelperText>
            )}
          </Box>
        )}
        <FormControl>
          <FormLabel
            id="demo-row-radio-buttons-group-label"
            sx={{ padding: "30px" }}
          >
            Payment Method
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={formik.values.paymentMethod}
            onChange={formik.handleChange}
          >
            <FormControlLabel
              name="paymentMethod"
              control={<Radio />}
              label="Cash "
              value="cash"
            />
            <FormControlLabel
              value="card"
              control={<Radio />}
              label="Card"
              name="paymentMethod"
            />
          </RadioGroup>
          {formik.errors.paymentMethod && formik.touched.paymentMethod && (
            <FormHelperText sx={{ color: "red" }} id="paymentMethod">
              {formik.errors.paymentMethod}
            </FormHelperText>
          )}
        </FormControl>
        {isAddCard && (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="creditCardNumber"
              label="Credit Card Number"
              type="text"
              fullWidth
              variant="standard"
              name="creditCardNumber"
              placeholder="Credit Card Number"
              value={formik.values.creditCardNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.creditCardNumber &&
                formik.errors.creditCardNumber
              }
              helperText={
                formik.touched.creditCardNumber &&
                formik.errors.creditCardNumber
              }
            />
            <TextField
              margin="dense"
              id="creditCardExpiryDate"
              label="Credit Card Expiry Date M/Y"
              type="text"
              fullWidth
              variant="standard"
              name="creditCardExpiryDate"
              value={formik.values.creditCardExpiryDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.creditCardExpiryDate &&
                formik.errors.creditCardExpiryDate
              }
              helperText={
                formik.touched.creditCardExpiryDate &&
                formik.errors.creditCardExpiryDate
              }
            />
            <TextField
              margin="dense"
              id="creditCardCVV"
              label="Credit Card CVV"
              type="text"
              fullWidth
              variant="standard"
              name="creditCardCVV"
              value={formik.values.creditCardCVV}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.creditCardCVV && formik.errors.creditCardCVV
              }
              helperText={
                formik.touched.creditCardCVV && formik.errors.creditCardCVV
              }
            />
            <FormControl className="creditCardType">
              <InputLabel>Credit Card Type</InputLabel>
              <Select
                style={{ width: "16rem", height: "3rem" }}
                name="creditCardType"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.creditCardType}
                input={<OutlinedInput label="creditCardType" />}
              >
                {creditCardType.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.creditCardType &&
                formik.touched.creditCardType && (
                  <FormHelperText sx={{ color: "red" }} id="creditCardType">
                    {formik.errors.creditCardType}
                  </FormHelperText>
                )}
            </FormControl>
          </>
        )}

        <div style={{ textAlign: "end" }}>
          <Button type="submit" sx={{ fontSize: "20px" }}>
            {loading ? <CircularProgress size="1.4rem" /> : <Box>Buy</Box>}{" "}
          </Button>
        </div>
      </form>
    </Box>
  );
}
