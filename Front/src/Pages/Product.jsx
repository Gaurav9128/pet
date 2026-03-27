import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { assets } from '../assets/assets'

const getOptimizedImage = (url, type = "main") => {
  if (!url || !url.includes("/upload/")) return url
  return type === "thumb" 
    ? url.replace("/upload/", "/upload/f_auto,q_auto,w_200/") 
    : url.replace("/upload/", "/upload/f_auto,q_auto:best,w_1000/")
}

const Product = () => {
  const { productId } = useParams()
  const { products, addToCart } = useContext(StoreContext)

  const [activeTab, setActiveTab] = useState('description')
  const [showDetails, setShowDetails] = useState(true)
  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [price, setPrice] = useState(0)
  const [mrp, setMrp] = useState(0)

  useEffect(() => {
    const product = products.find(item => item._id === productId)
    if (product) {
      setProductData(product)
      setImage(product.image[0])
      if (product.sizes?.length > 0) {
        setSelectedSize(product.sizes[0].label)
        setPrice(product.sizes[0].price)
        setMrp(product.sizes[0].mrp)
      }
    }
    window.scrollTo(0, 0);
  }, [productId, products])

  if (!productData) return <div className='py-40 text-center font-medium text-gray-400 animate-pulse'>Loading premium nutrition...</div>

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1300px] mx-auto px-5 py-8 md:py-16">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="flex-1">
            <div className="flex flex-col-reverse md:flex-row gap-5 sticky top-24">
              <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 shrink-0 scrollbar-hide">
                {productData.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(img)}
                    className={`relative w-20 md:w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${image === img ? 'border-orange-500 ring-4 ring-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    <img src={getOptimizedImage(img, "thumb")} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
              
              <div className="flex-1 bg-gray-50 rounded-[2rem] overflow-hidden relative group cursor-zoom-in border border-gray-100">
                 <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                    {productData.bestseller && (
                      <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase">Bestseller</span>
                    )}
                    <span className="bg-white/90 backdrop-blur-md text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-green-100 flex items-center gap-1">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {productData.label || '100% NATURAL'}
                    </span>
                 </div>
                <img 
                  src={getOptimizedImage(image, "main")} 
                  className="w-full h-full min-h-[450px] md:min-h-[600px] object-contain transition-transform duration-700 group-hover:scale-110" 
                  alt={productData.name} 
                />
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-sm tracking-widest uppercase">
                <span>{productData.brand || 'Belim Tails Exclusive'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {productData.name}
              </h1>
              <div className="flex items-center gap-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <img
                    key={i}
                    src={i < (productData.rating || 5) ? assets.star_icon : assets.star_dull_icon}
                    className="w-3"
                    alt=""
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full"></div>

            {/* Price Display */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-gray-900">₹{price}</span>
                {mrp > price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{mrp}</span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-black">
                      SAVE ₹{mrp - price}
                    </span>
                  </>
                )}
              </div>
              <p className="text-green-600 font-bold text-sm">Inclusive of all taxes</p>
            </div>

            {/* Size Selector Grid */}
            {/* Size Selector Grid */}
<div className="space-y-4">
  <span className="font-bold text-gray-900 text-sm uppercase tracking-wider">Select Pack Size</span>
  
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4"> {/* Gap badha kar 4 kar diya */}
    {productData.sizes.map((item) => (
      <div
        key={item._id}
        onClick={() => {
          setSelectedSize(item.label);
          setPrice(item.price);
          setMrp(item.mrp);
        }}
        className={`relative cursor-pointer border-2  overflow-hidden transition-all duration-200 flex flex-col ${
          selectedSize === item.label
            ? "border-orange-500 ring-1 ring-orange-500 shadow-sm"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        {/* Top Section: Size Label (Padding added: py-2.5) */}
        <div className={`px-3 py-1.5 text-xs justify-center font-bold tracking-wide ${
            selectedSize === item.label ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-600"
          }`}>
          {item.label}
        </div>

        {/* Bottom Section: Pricing (Padding added: p-4) */}
        <div className="p-4 flex flex-col items-start gap-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-black text-gray-900">₹{item.price}</span>
            <span className="text-xs text-gray-400 line-through">MRP ₹{item.mrp}</span>
          </div>
          
          {/* Unit Price with better spacing */}
          {/* <span className="text-[11px] font-semibold text-gray-500 mt-0.5">
             (₹{Math.round(item.price / (parseFloat(item.label) || 1) / 10)}/100g)
          </span> */}
        </div>
      </div>
    ))}
  </div>
</div>
<br/>
            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => addToCart(productData._id, selectedSize, price)} 
                className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl shadow-orange-200 flex items-center justify-center gap-3"
              >
                <span>ADD TO BASKET</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </div>
<br/>
            {/* Product Details Accordin */}
            <div className="mt-10 border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex justify-between px-5 py-4 bg-white"
              >
                <h2 className="font-semibold">Product Details</h2>
                <img
                  src={assets.dropdown_icon}
                  className={`w-3 transition-transform ${showDetails ? "rotate-180" : ""}`}
                  alt=""
                />
              </button>

              {showDetails && (
                <div className="border-t text-sm bg-gray-50/50">
                  {productData.details?.map((d, i) => (
                    <div key={i} className="flex justify-between px-5 py-3 border-b last:border-none border-gray-100">
                      <span className="font-medium text-gray-500">{d.label}</span>
                      <span className="text-gray-900 font-semibold">{d.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM TABS */}
        <div className="mt-24">
          <div className="flex gap-12 border-b border-gray-100 mb-10 overflow-x-auto scrollbar-hide">
            {['description', 'manufacturer'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-black tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-300 hover:text-gray-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="max-w-4xl">
            {activeTab === 'description' ? (
              <div className="space-y-8 animate-fadeIn">
                <p className="text-xl text-gray-600 leading-relaxed font-medium italic">
                  "{productData.description}"
                </p>
                {productData.long_description && (
                   <p className="text-gray-500 text-sm leading-loose">{productData.long_description}</p>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                 <h4 className="text-lg font-black text-gray-900">Manufacturer Info</h4>
                 <p className="text-gray-500 text-sm leading-loose">
                    {productData.manufacturer_details || "Manufactured by Belim Tails Pet Nutrition India."}
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={2000} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  )
}

export default Product