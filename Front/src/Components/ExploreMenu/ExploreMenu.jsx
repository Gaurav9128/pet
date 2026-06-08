import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // 1 row mein 5 items hain, toh default 10 items (2 rows)
  const itemsToShow = isExpanded ? menu_list.length : 10;

  const categoryMap = {
    "Dry Food": ["dogs", "cats"],
    "Wet Food": ["cats"],
    "Treats": ["small-pets"],
    "Biscuits": ["pet-parent"],
    "Dental Sticks": ["henlo"],
    "Food Bowl": ["bowls"],
    "Cages": ["cages"],
    "Shampoos": ["shampoos"],
    "Wipes": ["wipes"],
    "Combs, Brushes": ["combs-brushes"],
  };

 const accessoriesMap = {
  "Bowl": "bowls",
  "Cages": "cages",
  "Shampoos": "shampoos",
  "Wipes": "wipes",
  "Combs, Brushes": "combs-brushes",
};

const handleCategoryClick = (menuName) => {

  setCategory(menuName);

  if (accessoriesMap[menuName]) {
    navigate(`/accessories?subcategory=${accessoriesMap[menuName]}`);
    return;
  }

  const categoryValues = categoryMap[menuName];

  if (categoryValues) {
    navigate(`/cats?category=${categoryValues.join(",")}`);
  }
};

  return (
    <div className="explore-menu" id="explore-menu">
      <h1 className="explore-menu-title">Everyday essentials</h1>

      <div className="explore-menu-grid">
        {menu_list.slice(0, itemsToShow).map((item, index) => {
          const isActive = category === item.menu_name;

          return (
            <div
              key={index}
              className={`explore-menu-card ${isActive ? "active" : ""}`}
              onClick={() => handleCategoryClick(item.menu_name)}
            >
              <div className="image-container">
                <img src={item.menu_image} alt={item.menu_name} />
              </div>

              <div className="text-container">
                <p>{item.menu_name}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="show-more-container">
        <button
          className="show-more-btn-red"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
          <span> →</span>
        </button>
      </div>

      <hr className="divider" />
    </div>
  );
};

export default ExploreMenu;