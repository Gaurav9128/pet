import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Everyday essentials</h1>

      <div className="explore-menu-list">
        {menu_list.map((item) => {
          const isActive =
            category.toLowerCase().trim() === item.menu_name.toLowerCase().trim();

          return (
            <div
              key={item.menu_name}
              className={`explore-menu-list-item ${isActive ? "active" : ""}`}
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
            >
              <img src={item.menu_image} alt={item.menu_name} />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
