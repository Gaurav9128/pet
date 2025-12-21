import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(StoreContext);

  return (
    <div className="bg-white shadow-md rounded-md p-4 flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      
      {/* Product Image */}
      <Link to={`/product/${id}`} className="overflow-hidden rounded-md">
        <img
          src={image[0]}
          alt={name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Info */}
      <div className="mt-3 flex-1">
        <p className="text-sm font-semibold line-clamp-2">{name}</p> {/* limits name to 2 lines */}
        <p className="text-sm font-medium mt-1">₹{currency}{price}</p>
      </div>

      {/* Buy Now Button */}
      <Link
        to={`/product/${id}`}
        className="mt-3  bg-red-500 text-black py-2 px-4 rounded-md text-sm text-center"
      >
        BUY NOW
      </Link>
    </div>
  );
};

export default ProductItem;
