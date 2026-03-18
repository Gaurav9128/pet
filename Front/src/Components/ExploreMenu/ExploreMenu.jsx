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

    <div className="explore-menu">

      <h1>Everyday essentials</h1>

      <div className="explore-menu-list">

        {menu_list.map((item) => {

          const isActive =
            category?.toLowerCase().trim() ===
            item.menu_name.toLowerCase().trim();

          return (

            <div
              key={item.menu_name}
              className={`explore-menu-list-item ${isActive ? "active" : ""}`}
              onClick={() => handleCategoryClick(item.menu_name)}
            >

              <img src={item.menu_image} alt={item.menu_name} />

              <p>{item.menu_name}</p>

            </div>

          );

        })}

      </div>

    </div>

  );

};

export default ExploreMenu;