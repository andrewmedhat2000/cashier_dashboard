import { axiosInstance } from "../config/axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

export default function BuyProductQR() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    await axiosInstance
      .get("/retrieved/all")
      .then((response) => {
        setLoading(false);
        setData(response.data.retrieved);

        console.log(response.data.retrieved);
      })
      .catch((e) => {
        setLoading(false);

        console.log(e);
        toast.error(e.response.data.message);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {loading ? (
        <CircularProgress size="3rem" sx={{ m: 8 }} />
      ) : (
        <div className="invoce-card" style={{ marginBottom: "1.5rem" }}>
          {data ? (
            data.map((el) => (
              <div className="box" key={el._id} style={{ height: "205px" }}>
                <div className="text">Time: {el.updatedAt}</div>
                <div className="text">Client: {el.clientId.name}</div>
                <div className="text">Client Id: {el.clientId._id}</div>
                <div className="text">Product Id: {el._id}</div>
                <div className="text">Payment Method: {el.paymentMethod}</div>
                {/* <div className="text">Invoice Id: {el.invoiceId.invoiceId}</div> */}
              </div>
            ))
          ) : (
            <div>No Data </div>
          )}
        </div>
      )}
    </div>
  );
}
