import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const ProductItem = ({ id, image, name, price, sizes = [] }) => {
  const { currency } = useContext(StoreContext);

  // 🔹 Hardcoded values (later DB se aayenge)
  const mrp = price + 100;
  const rating = 4;
  const reviews = 2;
  const deliveryDate = "Fri, 2 Jan";

  return (
    <div className="bg-white shadow-md rounded-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">

      {/* Product Image */}
      <Link
        to={`/product/${id}`}
        className="w-full h-48 bg-gray-100 rounded-t-md overflow-hidden block"
      >
        <img
          src={image[0]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Product Info */}
      <div className="px-5 pt-4 pb-5 flex flex-col">

        {/* Product Name */}
        <p className="text-sm font-semibold line-clamp-2 text-gray-800">
          <Link to={`/product/${id}`}>
            {name}
          </Link>
        </p>

        {/* ⭐ Rating */}
        <div className="flex items-center gap-1 mt-2 text-sm">
          <span className="text-yellow-500">
            {"★".repeat(rating)}{"☆".repeat(5 - rating)}
          </span>
          <span className="text-gray-500">({reviews})</span>
        </div>

        {/* 💰 Price Section */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xl font-bold text-black">
            ₹{currency}{price}
          </span>

          <span className="text-sm text-gray-500 line-through">
            ₹{currency}{mrp}
          </span>

          <span className="text-sm text-green-600 font-semibold">
            ({Math.round(((mrp - price) / mrp) * 100)}% off)
          </span>
        </div>

        {sizes.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-2.5">
    {sizes.map((size, index) => (
      <button
        key={index}
        className="
          px-3.5 py-1.5
          text-[13px] font-semibold
          border-2 border-gray-400
          rounded-md
          text-gray-800
          min-w-[70px]
          hover:border-red-500
          hover:text-red-500
          transition-all
        "
      >
        {size}
      </button>
    ))}
  </div>
)}

        {/* 🚚 Delivery */}
        <p className="text-sm text-gray-700 mt-1">
          FREE delivery <span className="font-semibold">{deliveryDate}</span>
        </p>


        {/* Buy Now Button */}
        <Link
          to={`/product/${id}`}
          className="
            mt-4
            border border-red-500
            text-red-500
            bg-white
            py-3
            text-lg font-semibold
            rounded-lg
            text-center
            hover:bg-red-500 hover:text-white
            transition-all duration-200
          "
        >
          BUY NOW
        </Link>

      </div>
    </div>
  );
};

export default ProductItem;
