import React from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  const navigate = useNavigate();

  const categoryMap = {
"Dog food": "dogs",
 "Cat food": "cats",
 "Small Pets": "small-pets",
 "Pet Parent": "pet-parent",
 "Henlo": "henlo",
 "Pharmacy": "pharmacy",
 "Consult a Vet": "vet"
};

const handleCategoryClick = (menuName) => {

 setCategory(menuName);

 const categoryValue = categoryMap[menuName];

 navigate(`/cats?category=${categoryValue}`);

 };

  return (
    <div className="explore-menu" id="explore-menu">
      <h1 className="explore-menu-title">Everyday essentials</h1>
      
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          const isActive = category === item.menu_name;

          return (
            <div
              key={index}
              className={`explore-menu-item ${isActive ? "active" : ""}`}
              onClick={() => handleCategoryClick(item.menu_name)}
            >
              {/* Pink Box with Image & Offer */}
              <div className="badge-container">
                <div className="image-wrapper">
                  <img src={item.menu_image} alt={item.menu_name} />
                </div>
                {/* Offer tag docked at bottom */}
                <div className="discount-tag">
                  Up to {index % 2 === 0 ? "50%" : "30%"} OFF
                </div>
              </div>

              {/* Labels outside the box */}
              <div className="text-section">
                <h3 className="main-label">{item.menu_name}</h3>
                <p className="sub-label">{item.menu_name}</p>
              </div>
            </div>
          );
        })}
      </div>
      <hr className="divider" />
    </div>
  );
};

export default ExploreMenu;