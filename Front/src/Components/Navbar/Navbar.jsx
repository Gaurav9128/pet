import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [openCategories, setOpenCategories] = useState(false);
  const [openCat, setOpenCat] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const {
    setShowSearch,
    getTotalCartAmount,
    token,
    setToken
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  /* Toggle + / − only */
  const toggleCategory = (id) => {
    setOpenCat(openCat === id ? null : id);
  };

  /* CATEGORY CLICK → CLOSE DROPDOWN */
  const handleCategoryClick = () => {
    setOpenCategories(false);
    setOpenCat(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* OUTSIDE CLICK CLOSE */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenCategories(false);
        setOpenCat(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* AUTO CLOSE ON SCROLL */
  useEffect(() => {
    const handleScroll = () => {
      setOpenCategories(false);
      setOpenCat(null);
      setShowUserMenu(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* LOGOUT */
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken("");
    setShowUserMenu(false);
    // navigate("/login");
  };

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="logo" />
        </Link>

        <button
          className="category-btn"
          onClick={() => setOpenCategories(!openCategories)}
          ref={buttonRef}
        >
          <span className="category-text"> ☰ All Categories</span>
        </button>

        {/* CATEGORY DROPDOWN */}
        {openCategories && (
          <div className="category-dropdown" ref={dropdownRef}>
            <div className="category-row">
              <div className="category-title">
                <Link
                  to="/cats"
                  className="cat-link"
                  onClick={handleCategoryClick}
                >
                  CAT FOOD
                </Link>
                <span
                  className="toggle-btn"
                  onClick={() => toggleCategory(1)}
                >
                  {openCat === 1 ? "−" : "+"}
                </span>
              </div>
            </div>

            {[
              "DOG FOOD",
              "SMALL PETS",
              "PET PARENT",
              "HENLO",
              "PHARMACY",
              "SHOP BY BREED"
            ].map((item, index) => (
              <div className="category-row" key={item}>
                <div className="category-title">
                  <h3 onClick={handleCategoryClick}>{item}</h3>
                  <span
                    className="toggle-btn"
                    onClick={() => toggleCategory(index + 2)}
                  >
                    {openCat === index + 2 ? "−" : "+"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <img onClick={()=> { setShowSearch(true); navigate('/cats') }} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.cart_icon} alt="Cart" className="nav-icon" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {/* USER MENU */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div
            className="user-menu"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <button className="user-btn">Account ▾</button>

            {showUserMenu && (
              <div className="user-dropdown">
                <Link to="/payment" onClick={() => setShowUserMenu(false)}>
                  My Orders
                </Link>

                <Link to="/admin" onClick={() => setShowUserMenu(false)}>
                  Admin Panel
                </Link>

                <button onClick={logoutHandler} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
