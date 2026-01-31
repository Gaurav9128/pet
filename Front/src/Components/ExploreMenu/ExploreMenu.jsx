import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [showArrow, setShowArrow] = useState(true);

  const handleScroll = () => {
    const el = menuRef.current;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
      setShowArrow(false);
    } else {
      setShowArrow(true);
    }
  };

  const handleCategoryClick = (menuName) => {
    setCategory(menuName);
    navigate(`/cats?category=${menuName}`);
  };

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Everyday essentials</h1>

      <div className="menu-wrapper">
        <div
          className="explore-menu-list"
          ref={menuRef}
          onScroll={handleScroll}
        >
          {menu_list.map((item) => {
            const isActive =
              category?.toLowerCase().trim() ===
              item.menu_name.toLowerCase().trim();

            return (
              <div
                key={item.menu_name}
                className={`explore-menu-list-item ${
                  isActive ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(item.menu_name)}
              >
                <img src={item.menu_image} alt={item.menu_name} />
                <p>{item.menu_name}</p>
              </div>
            );
          })}
        </div>

        {showArrow && <div className="swipe-arrow">›</div>}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
