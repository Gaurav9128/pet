import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({ id, image = [], name, sizes = [], isAvailable = true, rating, reviewsCount }) => {
  const { currency } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(null);

  const getPriceData = () => {
    if (!sizes.length) return { price: 0, mrp: 0, discount: 0 };
    const validSizes = sizes.filter(s => Number(s.price) > 0 && Number(s.mrp) > 0);
    if (!validSizes.length) return { price: 0, mrp: 0, discount: 0 };

    const activeSize = selectedSize || validSizes.reduce((min, curr) => Number(curr.price) < Number(min.price) ? curr : min);
    const price = Number(activeSize.price);
    const mrp = Number(activeSize.mrp);
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return { price, mrp, discount };
  };

  const { price, mrp, discount } = getPriceData();

  // Helper function to render stars based on rating number
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-[#FAF7F0] border border-[#E8E2D2] rounded-3xl flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      
      {/* IMAGE SECTION */}
      <Link to={`/product/${id}`} className="relative m-2 rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-white shadow-inner">
        <img src={image?.[0]} alt={name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
      </Link>

      {/* CONTENT SECTION */}
      <div className="px-5 py-4 flex flex-col flex-1">
        
        {/* Product Name */}
        <p className="text-[15px] sm:text-[16px] font-extrabold text-[#2D2D2D] line-clamp-2 leading-tight min-h-[40px] mb-1">
          <Link to={`/product/${id}`}>{name}</Link>
        </p>

        {/* DYNAMIC RATING - Only shows if rating exists in database */}
        {rating > 0 ? (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-sm">
              {renderStars(rating)}
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              ({rating}/5) {reviewsCount && `· ${reviewsCount}`}
            </span>
          </div>
        ) : (
          <div className="mb-2 h-4"></div> // Spacer if no rating
        )}

        {/* PRICE SECTION */}
        <div className="flex items-baseline gap-2 flex-wrap mb-3">
          <span className="text-xl font-black text-[#1a1a1a]">₹{price}</span>
          {mrp > price && <span className="text-sm text-gray-400 line-through font-medium">₹{mrp}</span>}
          {discount > 0 && <span className="text-sm text-[#1B5E20] font-bold">({discount}% OFF)</span>}
        </div>

        {/* SIZES SECTION */}
        <div className="flex-grow">
          <p className="text-[11px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Weight:</p>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size, index) => {
              const isActive = selectedSize?.label === size.label;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`py-1.5 text-[10px] font-bold border-2 rounded-xl transition-all ${isActive ? "border-[#5B215E] bg-white text-[#5B215E]" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"}`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* BUY NOW BUTTON */}
        <div className="mt-5">
          {isAvailable ? (
            <Link 
              to={`/product/${id}`} 
              className="flex items-center justify-center gap-2 w-full bg-[#5B215E] text-white py-3 text-sm font-black uppercase tracking-widest rounded-xl hover:bg-[#4A1A4C] transition-all shadow-md active:scale-95 border-none"
            >
              <span className="text-white">BUY NOW 🛒</span>
            </Link>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-500 py-3 text-sm font-bold rounded-xl cursor-not-allowed">
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;