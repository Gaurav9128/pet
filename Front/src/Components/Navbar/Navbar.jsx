import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [openCategories, setOpenCategories] = useState(false);
  const [openCat, setOpenCat] = useState(null);

  const { setShowSearch, getTotalCartAmount } = useContext(StoreContext);

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
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* 🔥 AUTO CLOSE ON SCROLL (MOBILE ONLY) */
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 640) {
        setOpenCategories(false);
        setOpenCat(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                <Link to="/cats" className="cat-link" onClick={handleCategoryClick}>
                  CAT FOOD
                </Link>
                <span className="toggle-btn" onClick={() => toggleCategory(1)}>
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
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="nav-icon"
          alt="Search"
        />

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.cart_icon} alt="Cart" className="nav-icon" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        <button onClick={() => setShowLogin(true)}>sign in</button>
      </div>
    </div>
  );
};

export default Navbar;
