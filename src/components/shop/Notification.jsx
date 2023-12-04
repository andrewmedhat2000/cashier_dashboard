import { axiosInstance } from "../config/axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
export default function BuyProductQR() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    await axiosInstance
      .get("/Notification/all/tailoring")
      .then((response) => {
        setLoading(false);
        setData(response.data.notifications);

        console.log(response.data);
      })
      .catch((e) => {
        setLoading(false);

        console.log(e);
        toast.error(e.response?.data?.message);
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
        <div
          className="notification-card"
          style={{ marginBottom: "1.5rem", marginTop: "2rem" }}
        >
          {data.length > 0 ? (
            data.map((el) => (
              <div className="box" key={el?._id}>
                <h4>{el?.msg}</h4>
                <h6 style={{ marginTop: "3px" }}>
                  {el?.updatedAt.replace("T", " ").slice(0, -8)}
                </h6>
              </div>
            ))
          ) : (
            <h3 style={{ margin: "100px", textAlign: "center" }}>No Data</h3>
          )}
        </div>
      )}
    </div>
  );
}
