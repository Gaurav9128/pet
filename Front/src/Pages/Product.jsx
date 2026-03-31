import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'
import Swal from 'sweetalert2'
import axios from 'axios' 
import { assets } from '../assets/assets'

const Product = () => {
  const { productId } = useParams()
  const { products, addToCart, backendUrl } = useContext(StoreContext) 

  const [activeTab, setActiveTab] = useState('description')
  const [showDetails, setShowDetails] = useState(true)
  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [price, setPrice] = useState(0)
  const [mrp, setMrp] = useState(0)
  
  /* ================= STATES ================= */
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  /* ================= FETCH COUPONS ================= */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/coupons`);
        if (res.data.success) {
          setAvailableCoupons(res.data.coupons);
        }
      } catch (error) {
        console.log("Failed to fetch coupons", error);
      }
    };
    fetchCoupons();
  }, [backendUrl]);

  /* ================= BODY SCROLL LOCK ================= */
  // Jab drawer khulega toh piche ka page scroll nahi hoga aur overlap issue kam hoga
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isDrawerOpen]);

  /* ================= SORT & FILTER COUPONS ================= */
  const sortedCoupons = useMemo(() => {
    return [...availableCoupons].sort((a, b) => {
      const aIsApplicable = price >= a.minCartValue;
      const bIsApplicable = price >= b.minCartValue;
      if (aIsApplicable && !bIsApplicable) return -1;
      if (!aIsApplicable && bIsApplicable) return 1;
      return b.minCartValue - a.minCartValue;
    });
  }, [availableCoupons, price]);

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

  useEffect(() => {
  if (productData && productData.image && productData.image.length > 1) {
    const interval = setInterval(() => {
      setImage((currentImage) => {
        const currentIndex = productData.image.indexOf(currentImage);
        const nextIndex = (currentIndex + 1) % productData.image.length;
        return productData.image[nextIndex];
      });
    }, 3000); // 3000ms = 3 seconds mein image badlegi

    return () => clearInterval(interval); // Cleanup to prevent memory leaks
  }
}, [productData]);

  const handleAddToCart = () => {
    addToCart(productData._id, selectedSize, price);
    Swal.fire({
      title: 'Added to Basket!',
      text: `${productData.name}`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  }

  const renderProfessionalDescription = () => {
    if (!productData?.description) return null;
    const hasFeatures = productData.description.includes("Key Features:");
    const [intro, featuresPart] = hasFeatures
      ? productData.description.split("Key Features:")
      : [productData.description, ""];
    const featuresList = featuresPart.split(/(?=[A-Z][a-z]+ [A-Z][a-z]+ -|[A-Z][a-z]+ -)/g).filter(Boolean);

    return (
      <div className="flex flex-col gap-20 py-12 animate-fadeIn max-w-5xl mx-auto px-4">
        <div className="bg-[#FFD93D] rounded-[2.5rem] p-10 md:p-16 text-center shadow-sm border border-yellow-200">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black tracking-[0.4em] text-gray-900/40 uppercase">Premium Nutrition</h3>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
              You choose clean ingredients for yourself. <br className="hidden md:block" />
              <span className="text-orange-600">So why leave your doggo behind?</span>
            </h2>
          </div>
          <div className="h-px bg-black/10 w-32 mx-auto my-10"></div>
          <p className="text-base md:text-xl text-gray-800 font-bold leading-relaxed max-w-3xl mx-auto italic">
            "{intro.replace(/"/g, "").trim()}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-4">
          <div className="bg-gray-50 rounded-[3rem] p-6 md:p-8 flex justify-center items-center border border-gray-100 shadow-inner group overflow-hidden aspect-square">
            <img src={image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt="Natural Food" />
          </div>
          <div className="space-y-10">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Choose dog food that's <br /> <span className="text-orange-500 underline decoration-4 underline-offset-[12px]">actually food</span>
            </h3>
            <br/>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-5 bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 font-bold text-xl">✓</div>
                <p className="text-base font-black text-gray-700">Clean Ingredients & 100% Natural</p>
              </div>
              <div className="flex items-center gap-5 bg-red-50 p-6 rounded-2xl border border-red-100 opacity-80 shadow-sm">
                <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-white shrink-0 font-bold text-xl">✕</div>
                <p className="text-base font-black text-gray-500 line-through">No Gluten, Fillers, or Preservatives</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12 px-4">
          <div className="flex items-center gap-4">
            <div className="h-2 w-14 bg-orange-500 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-widest">Health Benefits</h2>
          </div>
          <br/>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {featuresList.map((feature, index) => {
              const [title, ...descParts] = feature.split(/-|:/);
              if (!title) return null;
              return (
                <div key={index} className="flex gap-6 p-8 bg-white border border-gray-100 rounded-[2rem] hover:shadow-2xl hover:-translate-y-2 transition-all group shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-lg font-black shrink-0 group-hover:bg-orange-500 transition-all duration-300">
                    {index + 1}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-gray-900 text-lg group-hover:text-orange-600 transition-colors">{title.trim()}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">{descParts.join('-').trim()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!productData) return <div className='py-40 text-center font-black text-gray-300 animate-pulse tracking-widest uppercase'>Loading Belim Tails...</div>

  return (
    <div className="bg-white min-h-screen relative overflow-x-hidden">
      <div className="max-w-[1350px] mx-auto px-6 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* IMAGE GALLERY */}
          {/* IMAGE GALLERY WITH AUTO-SLIDE SUPPORT */}
<div className="flex-1">
  <div className="flex flex-col-reverse md:flex-row gap-6 sticky top-28">
    
    {/* Thumbnails */}
    <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0 scrollbar-hide p-1">
      {productData.image.map((img, index) => (
        <button 
          key={index} 
          onClick={() => setImage(img)} 
          className={`relative w-20 md:w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
            image === img 
            ? 'border-orange-500 ring-4 ring-orange-50 scale-105' 
            : 'border-gray-100 hover:border-gray-200 opacity-60 hover:opacity-100'
          }`}
        >
          <img src={img} className="w-full h-full object-cover" alt={`thumb-${index}`} />
        </button>
      ))}
    </div>

    {/* Main Large Image */}
    <div className="flex-1 bg-gray-50 rounded-[3rem] overflow-hidden relative border border-gray-100 shadow-inner group">
      <img 
        src={image} 
        className="w-full h-full min-h-[400px] object-contain transition-all duration-700 ease-in-out group-hover:scale-105" 
        alt={productData.name} 
        style={{ key: image }} // Isse React ko pata chalta hai ki image change hui hai animations ke liye
      />
      
      {/* Optional: Image Count Badge */}
      <div className="absolute bottom-6 right-8 bg-black/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-gray-600 uppercase tracking-widest">
        {productData.image.indexOf(image) + 1} / {productData.image.length}
      </div>
    </div>
    
  </div>
</div>

          {/* CONTENT SECTION */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <br/>
              <p className="text-orange-600 font-black text-[11px] tracking-[0.4em] uppercase">Belim Tails Exclusive</p>
              <br/>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight italic">{productData.name}</h1><br/>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={(i + 1) <= (productData.rating || 0) ? assets.star_icon : assets.star_dull_icon} className="w-4 h-4 object-contain" alt="star" />
                  ))}
                </div>
                {productData.rating > 0 && <span className="text-[12px] text-gray-500 font-bold ml-1">({productData.rating}/5)</span>}
              </div>
            </div>
<br/>
            <div className="h-px bg-gray-100"></div>

            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-4xl font-black text-[#1A1C2E]">₹{price}</span>
              {mrp > price && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-[#949CB0] line-through font-bold tracking-tighter">₹{mrp}</span>
                  <div className="bg-[#FFF1E0] px-3 py-1.5 flex items-center justify-center">
                    <span className="text-[#D34D01] text-[15px] font-black uppercase tracking-tight">SAVE ₹{mrp - price}</span>
                  </div>
                </div>
              )}
            </div>
<br/>
            <div className="space-y-6">
              <span className="font-black text-gray-400 text-[12px] uppercase tracking-[0.2em]">Select Pack Size</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {productData.sizes.map((item) => {
                  const isActive = selectedSize === item.label;
                  return (
                    <div key={item._id} onClick={() => { setSelectedSize(item.label); setPrice(item.price); setMrp(item.mrp); }}
                      className={`cursor-pointer overflow-hidden transition-all duration-300 ${isActive ? "border-orange-500 bg-white ring-4 ring-orange-50 shadow-md scale-[1.02]" : "border-gray-200 bg-white hover:border-gray-300 border"}`}>
                      <div className={`px-4 py-2 text-center font-black ${isActive ? "bg-orange-100/50 text-orange-700" : "bg-gray-50 text-gray-500"}`}>{item.label}</div>
                      <div className="p-4 text-center">
                        <span className="text-xl font-black text-gray-900">₹{item.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
<br/>
            {/* --- BANK OFFERS BAR --- */}
            <div onClick={() => setIsDrawerOpen(true)} className="flex items-center justify-between p-5 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all shadow-sm group font-sans">
              <div className="flex items-center gap-4">
                <div className="bg-green-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.707 9.293l-5-5A1 1 0 0012 4H9a1 1 0 00-.707.293l-5 5a1 1 0 000 1.414l7 7a1 1 0 001.414 0l5-5a1 1 0 000-1.414zM9 8a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </div>
                <span className="text-gray-800 font-bold text-lg">Bank Offers and coupons</span>
              </div>
              <div className="flex items-center text-orange-500 font-black text-sm uppercase tracking-widest">
                Check offers <span className="ml-2 text-xl">›</span>
              </div>
            </div>
<br/>
            <button onClick={handleAddToCart} className="group w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-[2rem] font-black text-lg transition-all active:scale-[0.97] shadow-2xl shadow-orange-200 flex items-center justify-center gap-4 uppercase tracking-widest">
              ADD TO BASKET
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </button>
<br/>
            <div className="border border-gray-200 rounded-xl overflow-hidden mt-8 shadow-sm">
              <button onClick={() => setShowDetails(!showDetails)} className="w-full flex justify-between items-center px-6 py-5 bg-white">
                <span className="text-gray-800 text-lg font-black uppercase tracking-tight">Product Details</span>
                <img src={assets.dropdown_icon} className={`w-4 transition-transform duration-300 ${showDetails ? "" : "rotate-180"}`} alt="toggle" />
              </button>
              {showDetails && (
                <div className="bg-white border-t border-gray-100 animate-fadeIn p-2">
                  {productData.details?.map((d, i) => (
                    <div key={i} className="flex items-center px-6 py-4 border-b last:border-none border-gray-50">
                      <span className="w-1/3 text-gray-900 font-bold text-[14px] uppercase tracking-wider">{d.label}</span>
                      <span className="w-2/3 text-gray-600 font-medium text-[14px]">{d.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
<br/>
        {/* BOTTOM TABS SECTION */}
        <div className="mt-32">
          <div className="flex gap-12 border-b-2 border-gray-50 mb-16 overflow-x-auto scrollbar-hide">
            {['description', 'manufacturer'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-6 text-xs font-black tracking-[0.3em] uppercase transition-all relative ${activeTab === tab ? 'text-orange-500' : 'text-gray-300 hover:text-gray-600'}`}>
                {tab}
                {activeTab === tab && <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-orange-500 rounded-full"></div>}
              </button>
            ))}
          </div>
          <br/>
          <div className="min-h-[400px]">
            {activeTab === 'description' ? renderProfessionalDescription() : (
              <div className="p-20 bg-gray-900 rounded-[3rem] text-center space-y-8 animate-fadeIn text-white shadow-2xl">
                <div className="w-24 h-24 bg-orange-500 rounded-3xl mx-auto flex items-center justify-center text-5xl">🏭</div>
                <h4 className="text-3xl font-black uppercase tracking-widest">Manufacturer Information</h4>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">{productData?.manufacturer_details}</p>
              </div>
            )}
          </div>
        </div>
      </div>
<br/>
      {/* --- SIDE DRAWER FOR COUPONS --- */}
      {/* Overlay: Iska z-index badhaya gaya hai */}
      <div 
        className={`fixed inset-0 bg-black/60 transition-opacity duration-500 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        style={{ zIndex: 999 }}
        onClick={() => setIsDrawerOpen(false)} 
      />
      <br/>
      {/* Drawer: Iska z-index hamesha navbar se upar hona chahiye */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-out overflow-y-auto font-sans ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`} 
        style={{ zIndex: 1000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <br/>
        <div className="p-8 border-b border-gray-50 sticky top-0 bg-white/95 backdrop-blur-md z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Offers & Coupons</h2>
            <p className="text-gray-500 text-xs mt-1 font-medium italic">Handpicked deals for your pet's needs</p>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="text-2xl font-light hover:rotate-90 transition-transform duration-300">✕</button>
        </div>
<br/>
        <div className="p-8 space-y-10">
          {sortedCoupons.length > 0 ? (
            sortedCoupons.map((coupon, index) => {
              const isApplicable = price >= coupon.minCartValue;
              return (
                <div key={index} className={`border-b border-gray-100 pb-10 last:border-0 group animate-fadeIn ${!isApplicable ? 'opacity-80' : ''}`} style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-3">
                      <div  className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-600 px-3 py-1  font-black text-[12px] tracking-widest uppercase italic">Coupon</span>
                        <p className="text-gray-900 font-black text-xl tracking-tight">{coupon.code}</p>
                      </div>
                      <p className="text-gray-600 text-sm font-bold leading-relaxed">
                        Save {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} on orders above ₹{coupon.minCartValue}
                      </p>
                      
                      {!isApplicable && (
                        <div className="bg-red-50 text-red-600 px-3 py-2 rounded-xl border border-red-100 inline-block">
                           <p className="text-[10px] font-black uppercase tracking-tighter">
                            Add items worth ₹{coupon.minCartValue - price} more to unlock
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className={`px-2 py-1  text-[9px] font-black tracking-widest border transition-colors whitespace-nowrap ${isApplicable ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                      {isApplicable ? 'APPLICABLE' : 'LOCKED'}
                    </div>
                  </div>
                  {/* <button className="text-orange-500 text-[10px] font-black mt-6 flex items-center gap-1 group-hover:gap-2 transition-all uppercase tracking-[0.2em]">
                    Details <span>▼</span>
                  </button> */}
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-gray-300 font-black uppercase tracking-widest">No Offers Available</div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        body { scroll-behavior: smooth; }
      `}} />
    </div>
  )
}

export default Product