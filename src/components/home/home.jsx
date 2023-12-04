import React, { useEffect, useState } from "react";
import "./home.css";

import Homeproduct from "./home_product";

import {
  Box,
  OutlinedInput,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import ProductCard from "../shop/ProductCard";
import CircularProgress from "@mui/material/CircularProgress";

import { axiosInstance } from "../config/axios";
import { toast } from "react-toastify";

const Home = ({ addtocart }) => {
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoryList] = useState(["All"]);
  const [category, setCategory] = useState("All");

  // Product category
  const [products, setAllProducts] = useState([]);
  const [filteredProducts, setFilterProducts] = useState([]);

  const [newProduct, setNewProduct] = useState([]);
  const [featuredProduct, setFeaturdProduct] = useState([]);
  const [topProduct, setTopProduct] = useState([]);

  useEffect(() => {
    if (category === "All") {
      setFilterProducts(products);
    } else {
      var list = products.filter((e) => e.categories.includes(category));
      // var list = category.map((el) =>
      //   products.filter((e) => e.categories.includes(el))
      // );

      console.log(list);
      setFilterProducts(list);
    }
  }, [category]);
  //Tranding Product
  const [trendingProduct, setTrendingProduct] = useState(Homeproduct);
  // Filter of tranding product
  const filtercate = (x) => {
    const filterproduct = Homeproduct.filter((curElm) => {
      return curElm.type === x;
    });
    setTrendingProduct(filterproduct);
  };
  //All Trending Product
  const allTrendingProduct = () => {
    setTrendingProduct(Homeproduct);
  };

  //Product Type
  useEffect(() => {
    productcategory();
  }, []);
  const productcategory = () => {
    // New Product
    const newcategory = Homeproduct.filter((x) => {
      return x.type === "new";
    });
    setNewProduct(newcategory);

    // Featured Product
    const featuredcategory = Homeproduct.filter((x) => {
      return x.type === "featured";
    });
    setFeaturdProduct(featuredcategory);

    // Top Product
    const topcategory = Homeproduct.filter((x) => {
      return x.type === "top";
    });
    setTopProduct(topcategory);
  };
  const getCategory = async () => {
    await axiosInstance
      .get("/category/getallcategories")
      .then((response) => {
        setCategoryList([
          ...categoriesList,
          ...response.data.categories.map((e) => e.name),
        ]);
      })
      .catch((e) => console.log(e));
  };

  const fetchData = async () => {
    setLoading(true);
    await axiosInstance
      .get("/product/getallproducts?page=1&pageSize=10")
      .then((response) => {
        setLoading(false);
        setAllProducts(response.data.products);
        setFilterProducts(response.data.products);
      })
      .catch((e) => {
        setLoading(false);

        console.log(e);
        toast.error(e.response.data.message);
      });
  };

  useEffect(() => {
    fetchData().then(() => getCategory());
  }, []);
  // useEffect(() => {
  //   getCategory();
  // }, []);
  return (
    <>
      <div className="home">
        <div className="trending">
          <div className="container">
            <div className="left_box">
              <div className="header">
                <div className="heading">
                  <h2 onClick={() => allTrendingProduct()}>trending product</h2>
                </div>
                <div className="cate">
                  <InputLabel className="category-lable">Category</InputLabel>
                  <Select
                    style={{ width: "10rem", height: "2rem" }}
                    name="category"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    {categoriesList.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <Box display="flex" justifyContent="center" className="products">
                {loading ? (
                  <CircularProgress size="3rem" sx={{ m: 8 }} />
                ) : (
                  <div className="container">
                    {filteredProducts.length > 0 ? (
                      <>
                        {" "}
                        {filteredProducts.map((curElm) => {
                          return (
                            <>
                              <div className="product_container">
                                <ProductCard
                                  i={curElm}
                                  key={curElm.id}
                                  title={curElm.title}
                                />
                              </div>
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <div style={{ margin: "3rem", fontSize: "2rem" }}>
                        Not found
                      </div>
                    )}
                  </div>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
