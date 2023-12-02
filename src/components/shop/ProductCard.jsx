import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiFillEye,
  AiOutlineClose,
  AiFillCaretRight,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import "./shop.css";
import BuyProduct from "./BuyProduct";
import BuyForMySelf from "./BuyForMySelf";
import { useNavigate } from "react-router-dom";

export default function ProductCard(props, addtocart) {
  console.log(props);
  const [isOpen, setIsOpen] = useState(false);
  const [isBuyForMySelf, setIsBuyForMySelf] = useState(false);

  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState([]);
  const [buy, setBuy] = useState();
  const navigate = useNavigate();

  const handleOpen = (product) => {
    // const buyProduct = [{ product }];
    // const buyNow = buyProduct[0]["product"];
    // setBuy(buyNow);
    // setIsOpen(!isOpen);
    navigate("/buy", { state: product });
  };

  //   console.log(props.i);
  const detailpage = (product) => {
    const detaildata = [{ product }];
    const productdetail = detaildata[0]["product"];
    // console.log(productdetail)
    setDetail(productdetail);
    setShowDetail(true);
  };
  const closedetail = () => {
    setShowDetail(false);
  };
  return (
    <>
      {showDetail ? (
        <>
          <div className="product_detail">
            <button className="close_btn" onClick={closedetail}>
              <AiOutlineClose />
            </button>
            <div className="container">
              <div className="img_box">
                <img src={detail.i.image.path} alt=""></img>
              </div>
              <div className="info">
                <img
                  src={detail.i.qrCode}
                  style={{ width: "250px", height: "250px" }}
                />
                <h2>{detail.i.name}</h2>
                {/* <p>
                  A Searchcreen Everyone Will Love: Whether your family is
                  streaming or video chatting with friends tablet A8...
                </p> */}
                <h3>KWD{detail.i.price}</h3>
                <button onClick={() => addtocart(detail)}>Add To Cart</button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <div className="box">
        <div className="img_box">
          <img src={props.i?.image.path} alt=""></img>

          <BuyProduct
            isFormOpened={isOpen}
            handleCloseDialog={() => setIsOpen(false)}
            props={props.i}
          />
          <BuyForMySelf
            isFormOpened={isBuyForMySelf}
            handleCloseDialog={() => setIsBuyForMySelf(false)}
            props={props.i}
          />
        </div>
        <div className="detail">
          <h3>{props.i?.name}</h3>
          <p>{props.i?.price} KWD</p>
          {props.i?.stock > 0 ? (
            <div>
              <button onClick={() => handleOpen(props.i)}>Buy</button>
              <button onClick={() => navigate("/buyForMe", { state: props.i })}>
                Buy For Me
              </button>
            </div>
          ) : (
            <h5
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              Out Of Stock
            </h5>
          )}
        </div>
      </div>
    </>
  );
}
