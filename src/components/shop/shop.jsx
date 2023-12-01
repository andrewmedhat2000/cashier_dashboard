import React, { useState, useEffect } from "react";
import "./shop.css";
import { axiosInstance } from "../config/axios";
import {
  AiFillHeart,
  AiFillEye,
  AiOutlineClose,
  AiFillCaretRight,
  AiOutlineShoppingCart,
} from "react-icons/ai";

import ProductCard from "./ProductCard";
const Shop = ({ shop, Filter, allcatefilter, addtocart }) => {
  // Toggle Product Detail
  const [showDetail, setShowDetail] = useState(false);
  // Detail Page Data
  const [detail, setDetail] = useState([]);
  const [products, setAllProducts] = useState([]);
  const productList = products.map((data) => {
    return <ProductCard i={data} key={data.id} title={data.title} />;
  });
  //Showing Detail Box
  const detailpage = (product) => {
    const detaildata = [{ product }];
    const productdetail = detaildata[0]["product"];
    // console.log(productdetail)
    setDetail(productdetail);
    setShowDetail(true);
  };

  const fetchData = () => {
    axiosInstance
      .get("/product/getallproducts?page=1&pageSize=10")
      .then((response) => {
        console.log(response.data.products);
        setAllProducts(response.data.products);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="shop">
        <h2>shop</h2>
        <p>Home . shop</p>
        <div className="container">
          <div className="left_box">
            <div className="category">
              <div className="header">
                <h3>all categories</h3>
              </div>
              <div className="box">
                <ul>
                  <li onClick={() => allcatefilter()}># All</li>
                  <li onClick={() => Filter("Laptop")}># Laptop</li>
                  {/* <li onClick={() => Filter('laptop')}># laptop</li> */}
                  <li onClick={() => Filter("watch")}># watch</li>
                  <li onClick={() => Filter("speaker")}># speaker</li>
                  <li onClick={() => Filter("electronics")}># electronics</li>
                  <li onClick={() => Filter("headphone")}># headphone</li>
                  <li onClick={() => Filter("phone")}># phone</li>
                </ul>
              </div>
            </div>
            <div className="banner">
              <div className="img_box">
                <img src="image/shop_left.avif" alt=""></img>
              </div>
            </div>
          </div>
          <div className="right_box">
            <div className="banner">
              <div className="img_box">
                <img src="image/shop_top.webp" alt=""></img>
              </div>
            </div>
            <div className="product_box">
              <h2>Shop Product</h2>
              <div className="product_container">{productList}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
