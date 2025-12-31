import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import { StoreContext } from '../context/StoreContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/* 🔥 Cloudinary Image Optimizer */
const getOptimizedImage = (url, type = "main") => {
  if (!url || !url.includes("/upload/")) return url

  if (type === "thumb") {
    return url.replace(
      "/upload/",
      "/upload/f_auto,q_100,w_150/"
    )
  }

  // MAIN IMAGE (High quality + responsive)
  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto:best,w_600/"
  )
}

const Product = () => {
  const { productId } = useParams()
  const { products, addToCart } = useContext(StoreContext)

  const [showDetails, setShowDetails] = useState(false)
  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [price, setPrice] = useState(0)
  const [mrp, setMrp] = useState(0)
  const [sizesWithPrice, setSizesWithPrice] = useState([])

  /* Fetch Product */
  useEffect(() => {
    const product = products.find(item => item._id === productId)
    if (product) {
      setProductData(product)
      setImage(product.image[0])
      setSizesWithPrice(product.sizes)

      if (product.sizes.length > 0) {
        setSelectedSize(product.sizes[0].label)
        setPrice(product.sizes[0].price)
        setMrp(product.sizes[0].mrp)
      }
    }
  }, [productId, products])

  /* Auto Image Slider */
  useEffect(() => {
    if (!productData || productData.image.length === 0) return

    const interval = setInterval(() => {
      const currentIndex = productData.image.indexOf(image)
      const nextIndex = (currentIndex + 1) % productData.image.length
      setImage(productData.image[nextIndex])
    }, 3000)

    return () => clearInterval(interval)
  }, [image, productData])

  const handleSizeSelect = (item) => {
    setSelectedSize(item.label)
    setPrice(item.price)
    setMrp(item.mrp)
  }

  const discountPercent =
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }
    addToCart(productData._id, selectedSize, price)
    toast.success("Product added to cart")
  }

  return productData ? (
    <div className="border-t-2 pt-10">

      <div className="flex gap-12 flex-col sm:flex-row">

        {/* IMAGE SECTION */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">

          {/* THUMBNAILS */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18%] w-full gap-2">
            {productData.image.map((img, index) => (
              <img
                key={index}
                src={getOptimizedImage(img, "thumb")}
                onClick={() => setImage(img)}
                className={`w-[24%] sm:w-full cursor-pointer border object-contain
                  ${image === img ? 'border-black' : 'border-gray-200'}`}
                alt=""
              />
            ))}
          </div>

          {/* MAIN IMAGE WITH ZOOM */}
          <div className="w-full sm:w-[80%] overflow-hidden rounded-lg border">
            <img
              src={getOptimizedImage(image, "main")}
              className="w-full h-auto object-contain transition-transform duration-300 hover:scale-125 cursor-zoom-in"
              alt=""
            />
          </div>

        </div>

        {/* PRODUCT INFO */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
         <br/>
          {/* RATING */}
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                src={i < productData.rating ? assets.star_icon : assets.star_dull_icon}
                className="w-3"
                alt=""
              />
            ))}
          </div>
          <br/>
          {/* PRICE */}
          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-semibold">₹{price}</span>
            {mrp > price && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{mrp}</span>
                <span className="text-green-600 font-medium">
                  ({discountPercent}% off)
                </span>
              </>
            )}
          </div>
          <br/>
          {/* SIZES */}
          <div className="flex flex-wrap gap-3 mt-4">
            {sizesWithPrice.map(item => (
              <button
                key={item._id}
                onClick={() => handleSizeSelect(item)}
                className={`border px-4 py-2 rounded text-sm
                  ${selectedSize === item.label
                    ? 'border-black font-semibold'
                    : 'border-gray-300'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
           <br/>
          {/* INFO */}
          <div className="text-sm text-gray-500 mt-6 space-y-1">
            <p>100% Original product.</p>
            <p>Cash on delivery available.</p>
            <p>7 days return policy.</p>
          </div>
          <br/>
          <div className="mt-4 bg-gray-50 px-4 py-3 text-sm">
            <p className="font-medium">COD available ₹700 – ₹5000</p>
            <p>Free delivery above ₹599</p>
          </div>
          <br/>
          <br/>
          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="mt-6 border border-orange-500 text-orange-500 px-10 py-3.5 text-lg font-semibold rounded-lg
              hover:bg-orange-500 hover:text-white transition"
          >
            Add to cart
          </button>
          <br/>
          <br/>
          {/* DETAILS */}
          <div className="mt-10 border rounded-lg">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex justify-between px-5 py-4"
            >
              <h2 className="font-semibold">Product Details</h2>
              <img
                src={assets.dropdown_icon}
                className={`w-3 transition-transform ${showDetails ? "rotate-90" : ""}`}
                alt=""
              />
            </button>

            {showDetails && (
              <div className="border-t text-sm">
                {productData.details?.map((d, i) => (
                  <div key={i} className="flex justify-between px-5 py-3">
                    <span className="font-medium">{d.label}</span>
                    <span className="text-gray-600">{d.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      <br/>
      {/* DESCRIPTION */}
      <div className="mt-20">
        <b className="border px-5 py-3 text-sm">Description</b><br/><br/>
        <div className="border px-6 py-6 text-sm text-gray-500 mt-4">
          {productData.description}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  ) : null
}

export default Product
