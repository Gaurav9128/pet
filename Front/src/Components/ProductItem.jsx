import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({
  id,
  image = [],
  name,
  sizes = [],
  isAvailable = true,
  rating = 4.5,
}) => {
  const { currency } = useContext(StoreContext);

  const [selectedSize, setSelectedSize] = useState(
    sizes.length ? sizes[0] : null
  );

  const getPriceData = () => {
    if (!sizes.length)
      return {
        price: 0,
        mrp: 0,
        discount: 0,
      };

    const activeSize = selectedSize || sizes[0];

    const price = Number(activeSize.price);
    const mrp = Number(activeSize.mrp);

    const discount =
      mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return { price, mrp, discount };
  };

  const { price, mrp, discount } = getPriceData();

  return (
    <div
      className="
        group
        bg-[#FFFDF6]
        
        border border-amber-100/70
        shadow-[0_8px_30px_rgba(0,0,0,0.02)]
        hover:shadow-[0_16px_40px_rgba(93,25,81,0.08)]
        transition-all duration-300
        overflow-hidden
        flex flex-col
        h-full
        w-full
        max-w-[380px]
        mx-auto
        p-5            {/* Injected solid equal padding around the complete box */}
      "
    >
      {/* 1. BRAND LOGO & WISHLIST ROW */}
      <div className="flex justify-between items-center w-full mb-4 px-1">
        <div className="flex items-center gap-1.5 text-[#5D1951] font-black tracking-tight">
          <span className="text-xl">🐾</span>
          <div className="flex flex-col leading-[0.85] text-[14px] uppercase tracking-wider font-black">
            <span>Belim</span>
            <span>Tails</span>
          </div>
        </div>
      </div>

      {/* 2. PRODUCT IMAGE AREA */}
      {/* PRODUCT IMAGE AREA */}
      {/* PRODUCT IMAGE AREA */}
      <Link
        to={`/product/${id}`}
        className="
          flex
          justify-center
          items-center
          w-full
          h-[290px]
          bg-[#F9F7F1]
          rounded-[24px]
          p-2               {/* Minimum internal padding taaki image edges tak fail sake */}
          overflow-hidden
          border border-[#EFECE0]
        "
      >
        <img
          src={image?.[0]}
          alt={name}
          className="
            max-h-[260px]
            w-full            {/* w-auto se w-full kiya taaki horizontal width poori expand ho */}
            object-contain    {/* object-contain ensure karega ki width badhne par bhi image distort na ho */}
            transition-all
            duration-500
            group-hover:scale-105
          "
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=500";
          }}
        />
      </Link>

      {/* 3. CONTENT BOUNDARY BLOCK (Handles perfect left/right symmetry gaps) */}
      {/* CONTENT AREA: px-1 ko badal kar px-4 kiya hai taaki dono sides se perfect breathing gap mile */}
      {/* CONTENT AREA: px-5 padding ke sath center alignment aur fixed width logic */}
      {/* CONTENT AREA */}
      <div className="w-full px-5 flex flex-col items-center text-center flex-1">
        
        {/* 1. PRODUCT TITLE SECTION */}
        <Link to={`/product/${id}`} className="mt-4 block w-full">
          <h3
            className="
              text-[20px]
              font-bold
              text-[#222222]
              leading-[1.35]
              tracking-tight
              line-clamp-2
              min-h-[54px]
              hover:text-[#5D1951]
              transition-colors
              w-full
              text-center
            "
          >
            {name}
          </h3>
        </Link>
&nbsp;
        {/* 2. RATING SECTION (Title se perfect gap ke liye mt-3 kiya hai) */}
        <div className="flex items-center justify-center gap-1.5 mt-4 w-full">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(rating) ? "#FACC15" : "none"}
                color={i < Math.floor(rating) ? "#FACC15" : "#D1D5DB"}
              />
            ))}
          </div>
          <span className="text-[13px] font-bold text-gray-400 mt-0.5">
            ({rating}/5)
          </span>
        </div>
        {/* 3. PRICING SECTION (Rating se badiya gap ke liye mt-4 kiya hai) */}
        <div className="mt-4 flex items-baseline justify-center gap-2.5 flex-wrap w-full">
          <span className="text-[34px] font-black text-[#222222] tracking-tight leading-none">
            {currency || "₹"}{price}
          </span>

          {mrp > 0 && (
            <span className="text-gray-400 text-[18px] line-through font-medium leading-none">
              {currency || "₹"}{mrp}
            </span>
          )}

          {discount > 0 && (
            <span className="text-[16px] font-bold text-[#2E7D32] leading-none">
              ({discount}% OFF)
            </span>
          )}
        </div>
&nbsp;
        {/* 4. SELECT WEIGHT HEADING (Price se clear gap ke liye mt-6 kiya hai) */}
        <p className="text-[13px] font-black text-[#222222] uppercase tracking-wider mt-6 mb-3 w-full text-center">
          Select Weight:
        </p>

        {/* 5. STRUCTURED BUTTONS GRID */}
        {sizes.length > 0 && (
          <div className="w-full px-1">
            <div className="grid grid-cols-3 gap-3 w-full justify-items-center">
              {sizes.slice(0, 5).map((size, index) => {
                const isSelected = selectedSize?.label === size.label;
                const shortLabel = size.label.length > 8 ? size.label.split(" ")[0] : size.label;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      w-full
                      py-2.5 
                      px-1
                      text-center 
                      font-black 
                      text-[15px]
                      rounded-full 
                      border-[1.5px]
                      transition-all 
                      duration-150
                      truncate
                      ${isSelected
                        ? "bg-[#5D1951] text-white border-[#5D1951] shadow-sm"
                        : "bg-white text-[#222222] border-gray-300 hover:border-gray-500"
                      }
                    `}
                    title={size.label}
                  >
                    {shortLabel}
                  </button>
                );
              })}

              {/* MORE OPTIONS CHIP */}
              <Link to={`/product/${id}`} className="w-full">
                <button className="w-full py-2.5 px-1 text-center font-black text-[15px] rounded-full border-[1.5px] border-gray-300 bg-white text-[#222222] hover:border-gray-500 transition-all duration-150 cursor-pointer">
                  {"more..."}
                </button>
              </Link>
            </div>
          </div>
        )}
&nbsp;
        {/* PUSHES THE BUY BUTTON RIGIDLY DOWN */}
        <div className="flex-1" />

        {/* 6. BUY NOW CTA BUTTON (Weight selector se neat spacing ke liye mt-5 kiya hai) */}
        <div className="mt-5 mb-2 w-full">
          {isAvailable ? (
            <Link to={`/product/${id}`} className="block w-full">
              <button
                className="
                  w-full
                  bg-[#5D1951]
                  hover:bg-[#461243]
                  text-white
                  py-4 
                  rounded-[16px] 
                  font-black
                  text-[20px] 
                  tracking-wider
                  uppercase
                  flex
                  items-center
                  justify-center 
                  gap-2.5
                  transition-colors
                  duration-200
                  shadow-sm
                "
              >
                BUY NOW
                <ShoppingCart size={22} fill="currentColor" />
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="
                w-full
                py-4
                rounded-[16px]
                bg-gray-200
                text-gray-400
                font-black
                text-[20px]
                cursor-not-allowed
              "
            >
              OUT OF STOCK
            </button>
          )}
        </div>
        &nbsp;
      </div>
    </div>
  );
};

export default ProductItem;