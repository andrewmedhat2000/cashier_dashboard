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
  Dialog,
} from "@mui/material";

import { useFormik } from "formik";
import * as yup from "yup";
import { axiosInstance } from "../config/axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function BuyProductQR() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [tailoringDetails, setTailorDetails] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAddCard, setIsAddCard] = useState(false);
  const creditCardType = ["visa", "master card", "american", "express", "knet"];
  const [tailors, setTailor] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isBuyCard, setIsBuyCard] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialog, setDialog] = useState();
  const [data, setData] = useState();

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
  const getProduct = async () => {
    await axiosInstance
      .get(`/product/getproduct/${id}`)
      .then((res) => {
        console.log(res.data.product);
        setData(res.data.product);
        //toast.success(res.data.message);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data.message);
      });
  };
  useEffect(() => {
    checkLogin();
    getAllTailors();
    getProduct();
  }, []);
  const buyProduct = (values) => {
    setLoading(true);
    return axiosInstance
      .post(`/user/buy`, values)
      .then((response) => {
        toast.success(response.data.message);
        formik.resetForm();
        setDialog(response.data.invoice);
        setIsClient(false);
        setIsAddCard(false);
        setLoading(false);
        setShowDialog(true);
      })
      .catch((error) => {
        setLoading(false);

        if (error.response) {
          console.log(error.response);
          if (error.response.data.err.statusCode === 404) {
            setIsClient(true);
            //Navigate("/addClient");
          } else if (error.response.data.err.statusCode === 401) {
            setIsAddCard(true);
            toast.warn(error.response.data.message);

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
    enableReinitialize: true,

    initialValues: {
      quantity: "",
      tailoring: "",
      tailoringDescription: "",
      phone: "",
      phoneName: "",
      price: "",
      paymentMethod: "",
      name: "Buy",
      description: "",
      gender: "",
      creditCardNumber: "1234567890123456",
      creditCardExpiryDate: "12/26",
      creditCardCVV: "555",
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
      if (isClient && !isAddCard) {
        buyProduct(values);
      } else if (!isClient && !isAddCard) {
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
  useEffect(() => {
    getUser();
  }, [formik.values.phone]);

  const getUser = async () => {
    await axiosInstance
      .get(`/user/getclient/${formik.values.phone}`)
      .then((res) => {
        setIsClient(true);

        formik.values.phoneName = res.data?.client?.name;
        formik.values.gender = res.data?.client?.gender;
        console.log(res.data);
      })
      .catch((e) => {
        setIsClient(false);

        formik.values.phoneName = "";
        formik.values.gender = "";
      });
  };
  return (
    <Box sx={{ mx: "50px", my: "30px" }}>
      <div className="qr-product">
        <div
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Product
        </div>
        <div className="data" style={{ columnCount: 3 }}>
          <img src={data?.image.path} alt="img"></img>
          <div className="text">
            <h4>Name:</h4>
            {data?.name}
          </div>
          <div className="text">
            <h4>Size:</h4>
            {data?.size}
          </div>
          <div className="text">
            <h4>Color:</h4>
            {data?.color}
          </div>
          <div className="text">
            <h4>Stock:</h4>
            {data?.stock}
          </div>
          <div className="text">
            <h4>Price:</h4>
            {data?.price}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: "25px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Buy Product Now
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
          </Box>

          <TextField
            sx={{ gridColumn: "span 2" }}
            id="description"
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
                id="tailoringDescription"
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
                id="price"
                label="Price"
                type="text"
                fullWidth
                variant="filled"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && formik.errors.price}
                helperText={formik.touched.price && formik.errors.price}
              />
            </>
          )}
          <TextField
            sx={{ gridColumn: "span 2" }}
            id="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="filled"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && formik.errors.phone}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <TextField
            sx={{ gridColumn: "span 2" }}
            id="text"
            label="Name"
            multiline
            type="text"
            fullWidth
            variant="filled"
            name="phoneName"
            value={formik.values.phoneName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneName && formik.errors.phoneName}
            helperText={formik.touched.phoneName && formik.errors.phoneName}
          />

          <FormControl sx={{ gridColumn: "span 2" }}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
            {formik.errors.gender && formik.touched.gender && (
              <FormHelperText sx={{ color: "red" }} id="gender">
                {formik.errors.gender}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl sx={{ gridColumn: "span 2" }}>
            <FormLabel id="demo-row-radio-buttons-group-label">
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
                onChange={() => {
                  setIsBuyCard(false);
                  setIsAddCard(false);
                }}
              />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="Card"
                name="paymentMethod"
                onChange={() => setIsBuyCard(true)}
              />
            </RadioGroup>
            {formik.errors.paymentMethod && formik.touched.paymentMethod && (
              <FormHelperText sx={{ color: "red" }} id="paymentMethod">
                {formik.errors.paymentMethod}
              </FormHelperText>
            )}
          </FormControl>
          {isBuyCard && isAddCard && (
            <>
              {/* <TextField
                sx={{ gridColumn: "span 2" }}
                autoFocus
                id="creditCardNumber"
                label="Credit Card Number"
                type="text"
                fullWidth
                variant="filled"
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
                sx={{ gridColumn: "span 2" }}
                id="creditCardExpiryDate"
                label="Credit Card Expiry Date M/Y"
                type="text"
                fullWidth
                variant="filled"
                name="creditCardExpiryDate"
                value={formik.values.creditCardExpiryDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.creditCardExpiryDate}
                helperText={formik.errors.creditCardExpiryDate}
              />
              <TextField
                sx={{ gridColumn: "span 2" }}
                id="creditCardCVV"
                label="Credit Card CVV"
                type="text"
                fullWidth
                variant="filled"
                name="creditCardCVV"
                value={formik.values.creditCardCVV}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.creditCardCVV}
                helperText={formik.errors.creditCardCVV}
              /> */}
              <TextField
                sx={{ gridColumn: "span 2" }}
                id=""
                label="Reference Number"
                type="text"
                fullWidth
                variant="filled"
                name=""
                onChange={formik.handleChange}
              />{" "}
              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel>Credit Card Type</InputLabel>
                <Select
                  name="creditCardType"
                  id="creditCardType"
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
        </Box>

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
      <Dialog open={showDialog} className="Dialog-invoice">
        <div style={{ padding: "20px" }}>
          <h3 style={{ textAlign: "center" }}>Done</h3>
          <span className="text">
            <h4>Time:</h4> {dialog?.updatedAt.replace("T", " ").slice(0, -8)}
          </span>

          <span className="text">
            <h4>Client Id: </h4> {dialog?.client}
          </span>
          <div className="text">
            <h4>Product Id: </h4>
            {dialog?.productId}
          </div>
          <div className="text">
            <h4>Items :</h4> {dialog?.numberOfItems}
          </div>
          <div className="text">
            <h4>Tailored :</h4>
            {dialog?.tailored ? "true" : "false"}
          </div>
          <div className="text">
            <h4>Invoice Id :</h4> {dialog?.invoiceId}
          </div>
          <div className="text">
            <h4>Total Price :</h4> {dialog?.totalPrice}
          </div>
          {/* <div className="text">Invoice Id: {el.invoiceId.invoiceId}</div> */}
        </div>
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={() => {
            toast.info("Printing");
            navigate("/home");
          }}
        >
          Print
        </Button>
      </Dialog>
    </Box>
  );
}
