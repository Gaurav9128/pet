import React, { useContext, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../Components/Title.jsx';
import ProductItem from '../Components/ProductItem.jsx';
import { StoreContext } from '../context/StoreContext';
import "./Collection.css";

const CATEGORY_OPTIONS = [
  { label: 'Cat Food', value: 'cats' },
  { label: 'Dog Food', value: 'dogs' },
  { label: 'Small Pets', value: 'small-pets' },
  { label: 'Pet Parent', value: 'pet-parent' },
  { label: 'Henlo', value: 'henlo' },
  { label: 'Pharmacy', value: 'pharmacy' },
  { label: 'Consult a Vet', value: 'vet' },
];

const SUBCATEGORY_OPTIONS = [
  { label: 'Dry Food', value: 'dry-food' },
  { label: 'Wet Food', value: 'wet-food' },
  { label: 'Kitten Food', value: 'kitten-food' },
  { label: 'Premium Food', value: 'premium-food' },
  { label: 'Creamy Treats', value: 'creamy-treats' },
  { label: 'Jerky Treats', value: 'jerky-treats' },
  { label: 'Crunchy Treats', value: 'crunchy-treats' },
  { label: 'Puppy Food', value: 'puppy-food' },
  { label: 'Grain Free Food', value: 'grain-free' },
];

const Collection = () => {
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
      setCategory([categoryFromURL]);
      setTempCategory([categoryFromURL]);
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

  const filteredProducts = useMemo(() => {
    let result = [...products].filter(p => p.isAvailable);
    const finalSearch = (searchQuery || searchFromURL).toLowerCase();

    if (finalSearch) {
      result = result.filter(p => (p.name || '').toLowerCase().includes(finalSearch));
    }
    if (category.length > 0) {
      result = result.filter(p => category.includes(p.category));
    }
    if (subCategory.length > 0) {
      result = result.filter(p => subCategory.includes(p.subCategory));
    }
    if (sortType === 'low-high') {
      result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    } else if (sortType === 'high-low') {
      result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    }
    return result;
  }, [products, searchQuery, searchFromURL, category, subCategory, sortType]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-8 pt-10 border-t font-sans">
      
      {/* --- SIDEBAR FILTERS (PROFESSIONAL LOOK) --- */}
      <div className="min-w-64">
        <div 
          onClick={() => setShowFilter(!showFilter)} 
          className="flex items-center justify-between sm:cursor-default cursor-pointer bg-gray-50 p-3 rounded-lg sm:bg-transparent sm:p-0"
        >
          <p className="text-xl font-bold tracking-tight text-gray-800">FILTERS</p>
          <img 
            className={`h-3 sm:hidden transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`} 
            src={assets.dropdown_icon} 
            alt="toggle" 
          />
        </div>
        
        <div className={`${showFilter ? 'block' : 'hidden'} sm:block transition-all duration-500`}>
          
          {/* Categories Section */}
          <div className="mt-8">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#1E5F74] border-b pb-2">Categories</p>
            <div className="flex flex-col gap-2">
              {CATEGORY_OPTIONS.map(cat => (
                <label key={cat.value} className="group flex items-center gap-3 cursor-pointer py-1">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      value={cat.value} 
                      checked={tempCategory.includes(cat.value)} 
                      onChange={toggleCategory}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-[#1E5F74] checked:border-[#1E5F74] transition-all"
                    />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xs">✓</span>
                  </div>
                  <span className={`text-[15px] transition-colors ${tempCategory.includes(cat.value) ? 'text-[#1E5F74] font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Type Section */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#1E5F74] border-b pb-2">Product Type</p>
            <div className="flex flex-col gap-2">
              {SUBCATEGORY_OPTIONS.map(sub => (
                <label key={sub.value} className="group flex items-center gap-3 cursor-pointer py-1">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      value={sub.value} 
                      checked={tempSubCategory.includes(sub.value)} 
                      onChange={toggleSubCategory}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-[#1E5F74] checked:border-[#1E5F74] transition-all"
                    />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xs">✓</span>
                  </div>
                  <span className={`text-[15px] transition-colors ${tempSubCategory.includes(sub.value) ? 'text-[#1E5F74] font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {sub.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex flex-col gap-3 mt-8">
            <button 
              onClick={applyFilters} 
              className="w-full bg-[#1E5F74] text-white py-3 rounded-lg text-sm font-bold shadow-md hover:bg-[#154656] active:scale-95 transition-all"
            >
              APPLY FILTERS
            </button>
            <button 
              onClick={resetFilters} 
              className="w-full bg-white border border-gray-200 text-gray-500 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all"
            >
              RESET ALL
            </button>
          </div>
        </div>
      </div>

      {/* --- PRODUCT DISPLAY AREA --- */}
      <div className="flex-1">
        <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          <div className="relative min-w-[200px]">
            <select 
              onChange={(e) => setSortType(e.target.value)} 
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm font-medium outline-none bg-white shadow-sm focus:ring-2 focus:ring-[#1E5F74] transition-all cursor-pointer"
            >
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-xl text-gray-400 font-medium italic">Oops! No products found matching your choice.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 items-stretch">
              {currentProducts.map(item => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  sizes={item.sizes}
                />
              ))}
            </div>
<br/>
            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 mb-10">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  &larr;
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${currentPage === index + 1 ? "bg-[#1E5F74] text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;