import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext.jsx';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem.jsx';

const FoodDisplay = ({ category }) => {
  const { products } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2>Food Display</h2>

      <div className="food-display-list">
        {products.map((item) => {
          if (
            category === "All" ||
            category.toLowerCase().trim() === item.category.toLowerCase().trim()
          ) {
            return (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
