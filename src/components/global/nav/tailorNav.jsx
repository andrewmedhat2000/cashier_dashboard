import React from "react";
import { MdLocalShipping } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { CiLogout, CiUser } from "react-icons/ci";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "./nav.css";
const TailorNav = ({ search, setSearch, searchproduct }) => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("tailorId");
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
          <div className="logo">
            <img src="image/logo.webp" alt="logo"></img>
          </div>
          <div className="nav-bottom">
            <NavLink to={`/TailorHome/${id}`} className="search_box">
              Home
            </NavLink>

            <NavLink to="/TailorProfile" className="search_box">
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
      </div>
    </>
  );
};

export default TailorNav;
