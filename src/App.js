import React, { useState } from 'react';
import Nav from './components/global/nav/nav';
import { BrowserRouter } from 'react-router-dom';
import Rout from './components/Router/Router';
import Footer from './components/global/footer/footer';
import Homeproduct from './components/home/home_product';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  // Add To cart
  const [cart, setCart] = useState([]);
  //Shop Page product
  const [shop, setShop] = useState(Homeproduct);
  //Shop Search Filter
  const [search, setSearch] = useState('');
  //Shop category filter
  const Filter = (x) => {
    const catefilter = Homeproduct.filter((product) => {
      return product.cat === x;
    });
    setShop(catefilter);
  };
  const allcatefilter = () => {
    setShop(Homeproduct);
  };
  //Shop Search Filter

  //Add To cart
  const addtocart = (product) => {
    const exist = cart.find((x) => {
      return x.id === product.id;
    });
    if (exist) {
      alert('This product is alleardy added in cart');
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      alert('Added To cart');
    }
  };
  console.log(cart);
  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      <BrowserRouter>
        {/* <Nav
          search={search}
          setSearch={setSearch}
          searchproduct={searchproduct}
        /> */}
        <Rout
          setCart={setCart}
          cart={cart}
          shop={shop}
          Filter={Filter}
          allcatefilter={allcatefilter}
          addtocart={addtocart}
        />
        {/* <Footer /> */}
      </BrowserRouter>
    </>
  );
};

export default App;
