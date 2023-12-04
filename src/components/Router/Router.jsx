import React, { useState } from "react";
import { Routes, Route } from "react-router";
import Home from "../home/home";
import Shop from "../shop/shop";
import Cart from "../cart/cart";
import Contact from "../contact/contact";
import Login from "../login/login";
import Homeproduct from "../home/home_product";
import Nav from "../global/nav/nav";
import TailorNav from "../global/nav/tailorNav";
import Footer from "../global/footer/footer";
import AddClient from "../shop/AddClient";
import AddCardInfo from "../shop/AddCardInfo";
import ReturnProduct from "../shop/ReturnProduct";
import BuyProductQR from "../shop/BuyProductQR";
import ReturnedProduct from "../shop/returnedProduct";
import Profile from "../shop/profile";
import TailorHome from "../shop/tailorHome";
import Buy from "../shop/buyProductt";
import BuyForMe from "../shop/buyForMe";
import Notification from "../shop/Notification";

const Rout = ({
  shop,
  Filter,
  allcatefilter,
  addtocart,
  cart,
  setCart,
  setShop,
}) => {
  const [search, setSearch] = useState("");
  const searchlength = (search || []).length === 0;
  const searchproduct = () => {
    if (searchlength) {
      alert("Please Search Something !");
      setShop(Homeproduct);
    } else {
      const searchfilter = Homeproduct.filter((x) => {
        return x.cat === search;
      });
      setShop(searchfilter);
    }
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <Home addtocart={addtocart} />
            </>
          }
        />
        <Route
          path="/buy"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <Buy />
            </>
          }
        />
        <Route
          path="/buyForMe"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <BuyForMe />
            </>
          }
        />
        <Route
          path="/BuyProductQR/:id"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <BuyProductQR />
            </>
          }
        />
        <Route
          path="/returnProduct"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <ReturnProduct />
            </>
          }
        />
        <Route
          path="ReturnedProduct"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <ReturnedProduct />
            </>
          }
        />
        <Route
          path="Notification"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <Notification />
            </>
          }
        />
        <Route
          path="/Profile"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <Profile />
            </>
          }
        />
        <Route
          path="/TailorHome/:id"
          element={
            <>
              <TailorNav />
              <TailorHome />
            </>
          }
        />
        <Route
          path="TailorProfile"
          element={
            <>
              <TailorNav />
              <Profile />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <Cart cart={cart} setCart={setCart} />
              <Footer />
            </>
          }
        />
        <Route
          path="/shop"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <Shop
                shop={shop}
                Filter={Filter}
                allcatefilter={allcatefilter}
                addtocart={addtocart}
              />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/addClient"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <AddClient />
              <Footer />
            </>
          }
        />
        <Route
          path="/addCardInfo/:phone"
          element={
            <>
              <Nav
                search={search}
                setSearch={setSearch}
                searchproduct={searchproduct}
              />
              <AddCardInfo />
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
};

export default Rout;
