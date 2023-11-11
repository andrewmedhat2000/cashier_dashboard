import React, { useState } from 'react';
import {
  AiFillHeart,
  AiFillEye,
  AiOutlineClose,
  AiFillCaretRight,
  AiOutlineShoppingCart,
} from 'react-icons/ai';

import BuyProduct from './BuyProduct';
export default function ProductCard(props, addtocart) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState([]);
  const [buy, setBuy] = useState();
  const handleOpen = (product) => {
    const buyProduct = [{ product }];
    const buyNow = buyProduct[0]['product'];
    setBuy(buyNow);
    setIsOpen(!isOpen);
  };
  //   console.log(props.i);
  const detailpage = (product) => {
    const detaildata = [{ product }];
    const productdetail = detaildata[0]['product'];
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
          <div className='product_detail'>
            <button className='close_btn' onClick={closedetail}>
              <AiOutlineClose />
            </button>
            <div className='container'>
              <div className='img_box'>
                <img src={detail.i.image.path} alt=''></img>
              </div>
              <div className='info'>
                <img
                  src={detail.i.qrCode}
                  style={{ width: '250px', height: '250px' }}
                />
                <h2>{detail.i.name}</h2>
                {/* <p>
                  A Searchcreen Everyone Will Love: Whether your family is
                  streaming or video chatting with friends tablet A8...
                </p> */}
                <h3>${detail.i.price}</h3>
                <button onClick={() => addtocart(detail)}>Add To Cart</button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <div className='box'>
        <div className='img_box'>
          <img src={props.i?.image.path} alt=''></img>
          <div className='icon'>
            <li>
              <BuyProduct
                isFormOpened={isOpen}
                handleCloseDialog={() => setIsOpen(false)}
                props={props.i}
              />
              <AiOutlineShoppingCart
                onClick={() => handleOpen(props.i)}
                title='Buy Now'
              />
            </li>
            <li onClick={() => detailpage(props)}>
              <AiFillEye />
            </li>
          </div>
        </div>
        <div className='detail'>
          <h3>{props.i?.name}</h3>
          <p>$ {props.i?.price}</p>

          <button onClick={() => addtocart(props)}>Add To Cart</button>
        </div>
      </div>
    </>
  );
}
