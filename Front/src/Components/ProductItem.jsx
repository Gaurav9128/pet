import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(StoreContext);

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

      {/* Product Info (INNER PADDING ADDED HERE ✅) */}
      <div className="px-5 pt-4 pb-5 flex flex-col h-full">

        {/* Product Name */}
        <p className="text-sm font-semibold line-clamp-2 text-gray-800">
          <Link to={`/product/${id}`}>
            {name}
          </Link>
        </p>

        {/* Price */}
        <p className="text-lg font-bold mt-2 text-gray-800 pl-5">
          ₹{currency}{price}
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
