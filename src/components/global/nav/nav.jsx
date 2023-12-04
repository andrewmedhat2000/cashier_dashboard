import React from "react";
import { MdLocalShipping } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { CiLogout, CiUser } from "react-icons/ci";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "./nav.css";
const Nav = ({ search, setSearch, searchproduct }) => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const logout = () => {
    localStorage.clear();
    navigate("/");

    toast.success("See you soon!");
  };

  return (
    <>
      <div className="header">
        {/* <div className='top_header'>
          <div className='icon'>
            <MdLocalShipping />
          </div>
          <div className='info'>
            <p>Free Shipping When Shopping upto $1000</p>
          </div>
        </div> */}
        <div className="mid_header">
          <div className="logo" style={{ width: "25%" }}>
            <img
              style={{ width: "50%" }}
              src="https://res.cloudinary.com/dbsv7xv90/image/upload/v1701474605/andrew/f55b5682-50c2-4063-a449-94882d0061a7_btkoos.jpg"
              alt="logo"
            ></img>
          </div>
          <div className="nav-bottom">
            <NavLink to="/home" className="search_box">
              Home
            </NavLink>
            <NavLink to="/returnProduct" className="search_box">
              Return Product
            </NavLink>
            <NavLink to="/ReturnedProduct" className="search_box">
              Returned Product
            </NavLink>
            <NavLink to="/Notification" className="search_box">
              Notification
            </NavLink>
            <NavLink to="/Profile" className="search_box">
              Profile
            </NavLink>
            {token ? (
              // if user is login then Logout Button will shown and also user profile
              <div className="user">
                <div className="icon">
                  <CiLogout />
                </div>
                <div className="btn">
                  <button
                    onClick={() =>
                      logout({
                        logoutParams: { returnTo: window.location.origin },
                      })
                    }
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // if user is not Login then login button will shown
              <div className="user">
                <div className="icon">
                  <FiLogIn />
                </div>
                <div className="btn">
                  <button onClick={() => loginWithRedirect()}>Login</button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <div className="last_header">
          <div className="user_profile">
            {
              // User Profile Will Shown Here
              isAuthenticated ? (
                <>
                  <div className="icon">
                    <CiUser />
                  </div>
                  <div className="info">
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="icon">
                    <CiUser />
                  </div>
                  <div className="info">
                    <p>Please Login</p>
                  </div>
                </>
              )
            }
          </div>
          <div className="nav">
            <ul>
              <li>
                <Link to="/home" className="link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="link">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="link">
                  Cart
                </Link>
              </li>
              <li>
                <Link to='/about' className='link'>
                  About
                </Link>
              </li> 
              <li>
                <Link to="/contact" className="link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className='offer'><p>flat 10% over all iphone</p></div> 
        </div> */}
      </div>
    </>
  );
};

export default Nav;
