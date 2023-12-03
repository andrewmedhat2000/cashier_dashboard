import React, { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { axiosInstance } from "../config/axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
const TailorHome = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  localStorage.setItem("tailorId", id);
  // Product category
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    await axiosInstance
      .get(`/user/alltailoringsforspecifictailor/${id}`)
      .then((response) => {
        setData(response.data.tailoring);

        console.log(response);
        console.log(response.data.tailoring);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);

        console.log(e);
        toast.error(e?.response?.data?.message);
      });
  };
  const doneTailoring = (id) => {
    console.log(id);
    return axiosInstance
      .patch(`/user/tailoring/${id}`)
      .then((res) => {
        console.log(res.data);
        toast.success(res?.data?.message);

        fetchData();
      })
      .catch((e) => {
        console.log(e);
        toast.error(e?.response?.data?.message);
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
          {data.length > 0 ? (
            data.map((el) => (
              <div className="box" key={el._id} style={{ height: "286px" }}>
                <div className="text">Time: {el?.updatedAt}</div>
                <div className="text">
                  Discription: {el?.tailoringDescription}
                </div>
                <div className="text">Client: {el.clientId?.name}</div>
                <div className="text">Client Id: {el.clientId?._id}</div>
                <div className="text">Product: {el.productId?.name}</div>
                <div className="text">Status: {el?.status}</div>
                <div className="text">Price: {el?.price}</div>
                {el?.status !== "accepted" ? (
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    onClick={() => doneTailoring(el?._id)}
                  >
                    Ok
                  </Button>
                ) : (
                  <h4 style={{ textAlign: "center", marginTop: "30px" }}>
                    Done
                  </h4>
                )}
              </div>
            ))
          ) : (
            <div style={{ marginTop: "80px" }}>No Data </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TailorHome;
