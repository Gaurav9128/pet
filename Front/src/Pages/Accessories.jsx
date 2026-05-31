import React, { useContext, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../Components/Title.jsx';
import ProductItem from '../Components/ProductItem.jsx';
import { StoreContext } from '../context/StoreContext';
import { SlidersHorizontal, ChevronDown, RotateCcw, LayoutGrid } from 'lucide-react'; 
import "./Collection.css";

// Relevant Categories for Sidebar
const CATEGORY_OPTIONS = [
  { label: 'Accessories Only', value: 'Accessories' },
  { label: 'Others', value: 'Other' },
];

// Updated Sub-Categories specifically for Accessories
const SUBCATEGORY_OPTIONS = [
  { label: 'Leash & Collars', value: 'leash-collars' },
  { label: 'Feeding Bowls', value: 'bowls' },
  { label: 'Pet Toys', value: 'toys' },
  { label: 'Grooming Kits', value: 'grooming' },
  { label: 'Beds & Mats', value: 'beds' },
  { label: 'Clothing', value: 'clothing' },
];

const Accessories = () => {
  const { products = [], searchQuery } = useContext(StoreContext);
  const [searchParams] = useSearchParams();

  const searchFromURL = searchParams.get('search') || '';
  const categoryFromURL = searchParams.get('category');

  const [showFilter, setShowFilter] = useState(false);
  const [tempCategory, setTempCategory] = useState([]);
  const [tempSubCategory, setTempSubCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    if (categoryFromURL) {
      const categoriesArray = categoryFromURL.split(',');
      setCategory(categoriesArray);
      setTempCategory(categoriesArray);
    }
  }, [categoryFromURL]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setTempCategory(prev =>
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setTempSubCategory(prev =>
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
    );
  };

  const applyFilters = () => {
    setCategory(tempCategory);
    setSubCategory(tempSubCategory);
    setCurrentPage(1);
    if (window.innerWidth < 640) setShowFilter(false);
  };

  const resetFilters = () => {
    setTempCategory([]);
    setTempSubCategory([]);
    setCategory([]);
    setSubCategory([]);
    setCurrentPage(1);
  };

  const getLowestPrice = (product) => {
    if (!product?.sizes?.length) return 0;
    return Math.min(...product.sizes.map(s => Number(s.price) || 0));
  };

  // Logic to show ONLY Accessories
  const filteredProducts = useMemo(() => {
    // Strict Filtering: Product available hona chahiye AUR category "Accessories" honi chahiye
    let result = [...products].filter(p => p.isAvailable && p.category === "Accessories");

    const finalSearch = (searchQuery || searchFromURL).toLowerCase();

    // 1. Search Bar Filter
    if (finalSearch) {
      result = result.filter(p => (p.name || '').toLowerCase().includes(finalSearch));
    }

    // 2. Sidebar Filter (Accessories ke andar sub-types)
    if (subCategory.length > 0) {
      result = result.filter(p => subCategory.includes(p.subCategory));
    }

    // 3. Sorting Logic
    if (sortType === 'low-high') {
      result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    } else if (sortType === 'high-low') {
      result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    }

    return result;
  }, [products, searchQuery, searchFromURL, subCategory, sortType]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
              <div onClick={() => setShowFilter(!showFilter)} className="flex items-center justify-between cursor-pointer mb-8">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal size={22} className="text-[#1E5F74]" />
                  <span className="text-xl font-black text-gray-800 tracking-tight">FILTERS</span>
                </div>
                <img className={`h-3 lg:hidden transition-all ${showFilter ? 'rotate-180' : ''}`} src={assets.dropdown_icon} alt="toggle" />
              </div>
              
              <div className={`${showFilter ? 'block' : 'hidden'} lg:block`}>
                <div className="mb-10 pt-4">
                    &nbsp;
                  <p className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#C02626] opacity-70">Accessories Type</p>
                  <div className="flex flex-col gap-4">
                    {SUBCATEGORY_OPTIONS.map(sub => (
                      <label key={sub.value} className="group flex items-center gap-3 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            value={sub.value} 
                            checked={tempSubCategory.includes(sub.value)} 
                            onChange={toggleSubCategory}
                            className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-lg checked:bg-[#C02626] checked:border-[#C02626] transition-all cursor-pointer hover:border-[#C02626]"
                          />
                          <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-[10px]">✓</span>
                        </div>
                        <span className={`text-[15px] transition-colors ${tempSubCategory.includes(sub.value) ? 'text-[#C02626] font-bold' : 'text-gray-500 group-hover:text-gray-800'}`}>
                          {sub.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                   &nbsp;
                <div className="flex flex-col gap-4">
                  <button onClick={applyFilters} className="w-full bg-[#C02626] text-white py-4 rounded-2xl text-sm font-black shadow-xl shadow-blue-100 hover:bg-[#154656] transition-all">
                    APPLY FILTERS
                  </button>
                  <button onClick={resetFilters} className="w-full bg-[#C02626] border border-gray-100 text-white py-3 rounded-2xl text-[13px] font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition-all">
                    <RotateCcw size={16} /> RESET FILTERS
                  </button>
                </div>
              </div>
            </div>
          </aside>
           
          {/* PRODUCT AREA */}
          <main className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white p-6  gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <LayoutGrid size={20} className="text-[#1E5F74]" />
                </div>
                <div>
                  <Title text1="PREMIUM" text2="ACCESSORIES" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
                    Found {filteredProducts.length} Premium Items
                  </p>
                </div>
              </div>
              <div className="relative min-w-[200px]">
                <select onChange={(e) => setSortType(e.target.value)} className="w-full  p-2.5  text-sm font-medium outline-none bg-white shadow-sm focus:ring-2 focus:ring-[#1E5F74] transition-all cursor-pointer">
                  <option value="relavent">Sort by: Relevant</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </div>
&nbsp;
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[40px] border border-dashed border-gray-200 text-center px-4">
                <LayoutGrid size={40} className="text-gray-300 mb-6" />
                <p className="text-2xl text-gray-400 font-black italic mb-2">No Accessories Found</p>
                <p className="text-sm text-gray-400 mb-6">Hamare pass abhi is category mein koi product nahi hai.</p>
                <button onClick={resetFilters} className="text-[#1E5F74] font-bold underline">Show all accessories</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10">
                  {currentProducts.map(item => (
                    <ProductItem key={item._id} id={item._id} name={item.name} image={item.image} sizes={item.sizes} rating={item.rating} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-24 mb-10">
                    <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="w-14 h-14 flex items-center justify-center border border-gray-100 rounded-2xl bg-white text-gray-400 hover:border-[#1E5F74] disabled:opacity-20 shadow-sm active:scale-90 transition-all">
                      &larr;
                    </button>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] border border-gray-50 shadow-sm">
                      {[...Array(totalPages)].map((_, index) => (
                        <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${currentPage === index + 1 ? "bg-[#1E5F74] text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"}`}>
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="w-14 h-14 flex items-center justify-center border border-gray-100 rounded-2xl bg-white text-gray-400 hover:border-[#1E5F74] disabled:opacity-20 shadow-sm active:scale-90 transition-all">
                      &rarr;
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Accessories;