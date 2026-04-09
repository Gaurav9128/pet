import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({ id, image = [], name, sizes = [], isAvailable = true, rating = 0 }) => {
  const { currency } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);

  const getPriceData = () => {
    if (!sizes.length) return { price: 0, mrp: 0, discount: 0 };
    const activeSize = selectedSize || sizes[0];
    const price = Number(activeSize.price);
    const mrp = Number(activeSize.mrp);
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    return { price, mrp, discount };
  };

  const { price, mrp, discount } = getPriceData();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-500 text-sm" : "text-gray-300 text-sm"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    // Outer Card: max-w maintain kiya hai, p-4 overall card ko
    <div className="bg-[#FCF8F1] border border-gray-200 rounded-xl flex flex-col h-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 max-w-[380px] w-full mx-auto m-2 p-4">
      
      {/* IMAGE SECTION */}
      <div className="relative bg-white rounded-lg overflow-hidden mb-5 p-5 aspect-square flex items-center justify-center shrink-0">
        

        <Link to={`/product/${id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={image?.[0]}
            alt={name}
            className="max-w-[90%] max-h-[90%] object-contain hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* YELLOW/CREAM CONTENT SECTION - BADHAYI GAYI SPACING KE SAATH */}
      {/* py-5 add kiya hai vertical spacing badhane ke liye, px-4 pehle se hai */}
      <div className="flex flex-col flex-1 px-4 py-5 pb-6">
        
        {/* Title: Size text-[20px] pehle hi bada kiya tha, mb-3 badhaya gaya hai */}
        <h2 className="text-[20px] font-extrabold text-[#222] leading-[1.3] mb-3 line-clamp-2 min-h-[52px]">
          {name}
        </h2>

        {/* Rating: mb-4 badhaya gaya hai */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {renderStars()}
          </div>
          <span className="text-gray-500 text-xs font-bold">
            ({rating > 0 ? rating : "0 reviews"})
          </span>
        </div>

        {/* Price Section: mb-5 badhaya gaya hai */}
        <div className="flex items-baseline gap-3 mb-5 flex-wrap">
          <span className="text-3xl font-black text-black tracking-tight">₹{currency}{price}</span>
          <span className="text-lg text-gray-400 line-through font-medium">₹{mrp}</span>
          {discount > 0 && (
            <span className="text-lg font-bold text-green-700">({discount}% OFF)</span>
          )}
        </div>

        {/* DROPDOWN SECTION: mb-6 badhaya gaya hai */}
        <div className="mb-6">
          <label className="text-[12px] font-bold text-gray-700 mb-2.5 block uppercase tracking-wider">
            Select Weight:
          </label>
          <select 
            value={selectedSize?.label} 
            onChange={(e) => {
              const size = sizes.find(s => s.label === e.target.value);
              setSelectedSize(size);
            }}
            // Dropdown size py-3.5 pehle se bada hai
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3.5 text-[15px] font-bold text-gray-700 outline-none focus:border-[#5D2667] transition-colors cursor-pointer appearance-none shadow-sm"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
          >
            {sizes.map((size, index) => (
              <option key={index} value={size.label}>
                {size.label} - ₹{size.price}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON SECTION: mt-auto button ko bottom par rakhega */}
        <div className="mt-auto pt-2">
          {isAvailable ? (
            <Link to={`/product/${id}`} className="no-underline block">
              {/* Button py-4 pehle se bada hai */}
              <button className="w-full bg-[#5D2667] text-white py-4 rounded-xl text-[15px] font-black uppercase tracking-[2px] hover:bg-[#4a1e52] transition-all flex justify-center items-center gap-2 shadow-lg active:scale-95">
                BUY NOW 🛒
              </button>
            </Link>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-400 py-4 rounded-xl text-[15px] font-bold uppercase cursor-not-allowed">
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;