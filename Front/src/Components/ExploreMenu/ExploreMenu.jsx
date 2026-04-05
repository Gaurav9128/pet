import React, { useState } from "react"; // useState add kiya
import { useNavigate } from "react-router-dom";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  const navigate = useNavigate();
  
  // State: Default me false rahega (yani sirf 2 lines dikhengi)
  const [isExpanded, setIsExpanded] = useState(false);

  // Maan lijiye ek line mein 4 items hain, toh 2 lines ke liye 8 items show karenge
  const itemsToShow = isExpanded ? menu_list.length : 10;

  const categoryMap = {
    // Sabko array [] mein rakhein
    "Dry Pet Food": ["dogs", "cats"], 
    "Wet Food": ["cats"],
    "Treats": ["small-pets"],
    "Biscuits": ["pet-parent"],
    "Dental Sticks": ["henlo"],
    "Food Bowl": ["pharmacy"],
    "Water Bowls": ["vet"],
    "Travel Feeding Bottles": ["travel"],
    "Shampoos": ["shampoos"],
    "Wipes": ["Wipes"],
    "Combs, Brushes": ["Combs, Brushes"],
    "Nail Clippers": ["Nail Clippers"],
    "Ear & Eye Cleaning": ["cleaning"]
};

const handleCategoryClick = (menuName) => {
    setCategory(menuName);
    const categoryValues = categoryMap[menuName];

    // Check karein ki categoryValues exist karta hai aur wo ek array hai
    if (categoryValues && Array.isArray(categoryValues)) {
        const queryString = categoryValues.join(',');
        navigate(`/cats?category=${queryString}`);
    } else if (typeof categoryValues === 'string') {
        // Fallback: Agar galti se string reh gayi ho
        navigate(`/cats?category=${categoryValues}`);
    }
};

  return (
    <div className="explore-menu" id="explore-menu">
      <h1 className="explore-menu-title">Everyday essentials</h1>
      
      <div className="explore-menu-list">
        {/* slice(0, itemsToShow) se list control hogi */}
        {menu_list.slice(0, itemsToShow).map((item, index) => {
          const isActive = category === item.menu_name;

          return (
            <div
              key={index}
              className={`explore-menu-item ${isActive ? "active" : ""}`}
              onClick={() => handleCategoryClick(item.menu_name)}
            >
              <div className="badge-container">
                <div className="image-wrapper">
                  <img src={item.menu_image} alt={item.menu_name} />
                </div>
              </div>

              <div className="text-section">
                <h3 className="main-label">{item.menu_name}</h3>
                {/* <p className="sub-label">{item.menu_name}</p> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More / Show Less Button */}
      <div className="show-more-container" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          className="show-more-btn" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less ↑" : "Show More ↓"}
        </button>
      </div>

      <hr className="divider" />
    </div>
  );
};

export default ExploreMenu;