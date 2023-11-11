import React, { useEffect, useState } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import Homeproduct from './home_product';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import {
  BiLogoFacebook,
  BiLogoTwitter,
  BiLogoInstagram,
  BiLogoYoutube,
} from 'react-icons/bi';
import { axiosInstance } from '../config/axios';
const Home = ({ addtocart }) => {
  // Product category
  const [products, setAllProducts] = useState([]);
  const [newProduct, setNewProduct] = useState([]);
  const [featuredProduct, setFeaturdProduct] = useState([]);
  const [topProduct, setTopProduct] = useState([]);
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
      return x.type === 'new';
    });
    setNewProduct(newcategory);

    // Featured Product
    const featuredcategory = Homeproduct.filter((x) => {
      return x.type === 'featured';
    });
    setFeaturdProduct(featuredcategory);

    // Top Product
    const topcategory = Homeproduct.filter((x) => {
      return x.type === 'top';
    });
    setTopProduct(topcategory);
  };
  const fetchData = () => {
    axiosInstance
      .get('/product/getallproducts?page=1&pageSize=10')
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
      <div className='home'>
        <div className='top_banner'>
          <div className='contant'>
            <h3>silver aluminum</h3>
            <h2>Apple Watch</h2>
            <p>30% off at your first odder</p>
            <Link to='/shop' className='link'>
              Shop Now
            </Link>
          </div>
        </div>
        <div className='trending'>
          <div className='container'>
            <div className='left_box'>
              <div className='header'>
                <div className='heading'>
                  <h2 onClick={() => allTrendingProduct()}>trending product</h2>
                </div>
                <div className='cate'>
                  <h3 onClick={() => filtercate('new')}>New</h3>
                  <h3 onClick={() => filtercate('featured')}>Featured</h3>
                  <h3 onClick={() => filtercate('top')}>top selling</h3>
                </div>
              </div>
              <div className='products'>
                <div className='container'>
                  {products.map((curElm) => {
                    return (
                      <>
                        <div className='box'>
                          <div className='img_box'>
                            <img src={curElm.image.path} alt=''></img>
                            <div className='icon'>
                              <div className='icon_box'>
                                <AiFillEye />
                              </div>
                              <div className='icon_box'>
                                <AiFillHeart />
                              </div>
                            </div>
                          </div>
                          <div className='info'>
                            <h3>{curElm.name}</h3>
                            <p>${curElm.price}</p>
                            <button
                              className='btn'
                              onClick={() => addtocart(curElm)}
                            >
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
                <button>Show More</button>
              </div>
            </div>
            <div className='right_box'>
              <div className='right_container'>
                <div className='testimonial'>
                  <div className='head'>
                    <h3>our testmonial</h3>
                  </div>
                  <div className='detail'>
                    <div className='img_box'>
                      <img src='image/T1.avif' alt='testmonial'></img>
                    </div>
                    <div className='info'>
                      <h3>stephan robot</h3>
                      <h4>web designer</h4>
                      <p>
                        Duis faucibus enim vitae nunc molestie, nec facilisis
                        arcu pulvinar nullam mattisr nullam mattis.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='newsletter'>
                  <div className='head'>
                    <h3>newsletter</h3>
                  </div>
                  <div className='form'>
                    <p>join our malling list</p>
                    <input
                      type='email'
                      placeholder='E-mail'
                      autoComplete='off'
                    ></input>
                    <button>subscribe</button>
                    <div className='icon_box'>
                      <div className='icon'>
                        <BiLogoFacebook />
                      </div>
                      <div className='icon'>
                        <BiLogoTwitter />
                      </div>
                      <div className='icon'>
                        <BiLogoInstagram />
                      </div>
                      <div className='icon'>
                        <BiLogoYoutube />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
