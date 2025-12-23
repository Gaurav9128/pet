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

  /* ✅ CATEGORY CLICK → CLOSE DROPDOWN */
  const handleCategoryClick = () => {
    setOpenCategories(false);
    setOpenCat(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Outside click close */
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

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="logo" />
        </Link>

        {/* <button
          ref={buttonRef}
          className="category-btn"
          onClick={() => setOpenCategories(!openCategories)}
        >
          ☰ All Categories
        </button> */}

        <button className="category-btn" onClick={() => setOpenCategories(!openCategories)} ref={buttonRef}>
          <span className="category-text"> ☰ All Categories</span>
        </button>

        {/* CATEGORY DROPDOWN */}
        {openCategories && (
          <div className="category-dropdown" ref={dropdownRef}>

            {/* CAT FOOD */}
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

            {/* DOG FOOD */}
            <div className="category-row">
              <div className="category-title">
                <h3 onClick={handleCategoryClick}>DOG FOOD</h3>
                <span
                  className="toggle-btn"
                  onClick={() => toggleCategory(2)}
                >
                  {openCat === 2 ? "−" : "+"}
                </span>
              </div>
            </div>

            {/* SMALL PETS */}
            <div className="category-row">
              <div className="category-title">
                <h3 onClick={handleCategoryClick}>SMALL PETS</h3>
                <span
                  className="toggle-btn"
                  onClick={() => toggleCategory(3)}
                >
                  {openCat === 3 ? "−" : "+"}
                </span>
              </div>
            </div>

            {/* PET PARENT */}
            <div className="category-row">
              <div className="category-title">
                <h3 onClick={handleCategoryClick}>PET PARENT</h3>
                <span
                  className="toggle-btn"
                  onClick={() => toggleCategory(4)}
                >
                  {openCat === 4 ? "−" : "+"}
                </span>
              </div>
            </div>

            {/* HENLO */}
            <div className="category-row">
              <div className="category-title">
                <h3 onClick={handleCategoryClick}>HENLO</h3>
                <span
                  className="toggle-btn"
                  onClick={() => toggleCategory(5)}
                >
                  {openCat === 5 ? "−" : "+"}
                </span>
              </div>
            </div>

            {/* PHARMACY */}
            <div className="category-row">
              <div className="category-title">
                <h3 onClick={handleCategoryClick}>PHARMACY</h3>
                <span
                  className="toggle-btn"
                  onClick={() => toggleCategory(6)}
                >
                  {openCat === 6 ? "−" : "+"}
                </span>
              </div>
            </div>

            {/* SHOP BY BREED */}
            <div className="category-row">
              <div className="category-title">
                <h3 onClick={handleCategoryClick}>SHOP BY BREED</h3>
                <span
                  className="toggle-btn"
                  onClick={() => toggleCategory(7)}
                >
                  {openCat === 7 ? "−" : "+"}
                </span>
              </div>
            </div>

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
