import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets';
import { StoreContext } from '../context/StoreContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(StoreContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState(0); // selected size price
  const [sizesWithPrice, setSizesWithPrice] = useState([]);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        // Hardcoded sizes with price
        const sizesPrice = item.sizes.map((s, i) => {
          let newPrice = item.price + i * 50; // Example: price increment per size
          return { size: s, price: newPrice };
        });
        setSizesWithPrice(sizesPrice);
        setPrice(item.price);
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  const handleSizeSelect = (selected) => {
    setSize(selected.size);
    setPrice(selected.price);
  }

  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size before adding to cart");
      return;
    }
    addToCart(productData._id, size, price); // Add product with selected size & price
    toast.success("Your product is added to your cart!"); // Show toast
  }

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img 
                onClick={() => setImage(item)} 
                src={item} 
                key={index} 
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' 
                alt="" 
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

          <div className=' flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            {/* <p className='pl-2'>(122)</p> */}
          </div>

          {/* Price display */}
          <p className='mt-5 text-3xl font-medium'>₹{currency}{price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <br />

          {/* Size buttons */}
          <div className="flex flex-wrap gap-3 mb-3">
            {sizesWithPrice.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSizeSelect(item)}
                className={`border px-4 py-2 rounded bg-white min-w-[60px] text-center text-sm shadow-sm transition hover:border-gray-500
                  ${item.size === size ? 'border-black font-semibold' : 'border-gray-300'} `}
              > {item.size} </button>
            ))}
          </div>

          {/* Add to Cart button */}
          <br />
          <button
            onClick={handleAddToCart}
            className="border border-white-500 text-white-500 bg-white px-10 py-3 text-base font-semibold hover:bg-blue-50 active:bg-blue-100 transition-all duration-200">
            Add to cart
          </button>

          {/* Info */}
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <br/>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      {/* Description & Reviews */}
      <div className='mt-20'>
        <div className='flex gap-3'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews</p>
        </div>
        <br/>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet...</p>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product;
