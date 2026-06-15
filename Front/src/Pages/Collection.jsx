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
  { label: 'Brands', value: 'brand' },
  // {label: 'Accessories',value:'Accessories'},
  // {label: 'Others',value:'Other'},
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

  const [openCategory, setOpenCategory] = useState(true);
  const [openProductType, setOpenProductType] = useState(true);

  const brandFromURL = searchParams.get('brand') || '';

  useEffect(() => {
    if (categoryFromURL) {
      // URL se "dogs,cats" ko array ['dogs', 'cats'] mein badalna zaroori hai
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

  // Filter Logic: Jo strict uppercase aur lowercase dono ko seamlessly handle karega
const filteredProducts = useMemo(() => {
  let result = [...products].filter(p => p.isAvailable);
  const finalSearch = (searchQuery || searchFromURL).toLowerCase();

  // 1. Text Search Filter
  if (finalSearch) {
    result = result.filter(p => (p.name || '').toLowerCase().includes(finalSearch));
  }
  
  // 2. Category Filter
  if (category.length > 0) {
    result = result.filter(p => category.includes(p.category));
  }
  
  // 3. SubCategory Filter
  if (subCategory.length > 0) {
    result = result.filter(p => subCategory.includes(p.subCategory));
  }
  
  // 4. BRAND FILTER (Safe Case Matching)
  // Dono sides ko lowercase me badal kar compare kar rahe hain taaki case-matching automatic fail safe ho jaye
  if (brandFromURL) {
    result = result.filter(
      p => (p.brand || '').toLowerCase() === brandFromURL.toLowerCase()
    );
  }

  // 5. Sorting Logic
  if (sortType === 'low-high') {
    result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
  } else if (sortType === 'high-low') {
    result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
  }
  return result;
}, [products, searchQuery, searchFromURL, category, subCategory, sortType, brandFromURL]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 pt-10 border-t items-start">

      {/* --- SIDEBAR FILTERS (PROFESSIONAL LOOK) --- */}
      <div className="w-full sm:w-[300px] bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        {/* Header */}
        <div
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center justify-between cursor-pointer sm:cursor-default mb-5"
        >
          <h2 className="text-2xl font-bold text-red-600">
            Filters
          </h2>

          <img
            className={`h-3 sm:hidden transition-transform duration-300 ${showFilter ? "rotate-180" : ""
              }`}
            src={assets.dropdown_icon}
            alt=""
          />
        </div>

        <div className={`${showFilter ? "block" : "hidden"} sm:block`}>

          {/* CATEGORY SECTION */}
          <div className="border-b border-gray-200 pb-4">

            <button
              onClick={() => setOpenCategory(!openCategory)}
              className="w-full flex justify-between items-center"
            >
              <span className="text-sm tracking-[2px] uppercase font-bold text-gray-700">
                Categories
              </span>

              <span
                className={`text-red-600 text-lg font-bold transition-transform duration-300 ${openCategory ? "rotate-180" : ""
                  }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${openCategory ? "max-h-[500px] mt-4" : "max-h-0"
                }`}
            >
              <div className="space-y-3">

                {CATEGORY_OPTIONS.map(cat => (
                  <label
                    key={cat.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      value={cat.value}
                      checked={tempCategory.includes(cat.value)}
                      onChange={toggleCategory}
                      className="w-4 h-4 accent-black"
                    />

                    <span
                      className={`text-sm transition-all ${tempCategory.includes(cat.value)
                        ? "font-medium text-black"
                        : "text-gray-600 group-hover:text-black"
                        }`}
                    >
                      {cat.label}
                    </span>
                  </label>
                ))}

              </div>
            </div>
          </div>

          {/* PRODUCT TYPE */}
          <div className="pt-5">

            <button
              onClick={() => setOpenProductType(!openProductType)}
              className="w-full flex justify-between items-center"
            >
              <span className="text-xs tracking-[2px] uppercase font-semibold text-gray-500">
                Product Type
              </span>

              <span
                className={`text-red-600 text-lg font-bold transition-transform duration-300 ${openProductType ? "rotate-180" : ""
                  }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${openProductType ? "max-h-[700px] mt-4" : "max-h-0"
                }`}
            >
              <div className="space-y-3">

                {SUBCATEGORY_OPTIONS.map(sub => (
                  <label
                    key={sub.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      value={sub.value}
                      checked={tempSubCategory.includes(sub.value)}
                      onChange={toggleSubCategory}
                      className="w-5 h-5 accent-red-600 cursor-pointer"
                    />

                    <span
                      className={`text-base transition-all ${tempSubCategory.includes(sub.value)
                        ? "font-medium text-black"
                        : "text-gray-600 group-hover:text-black"
                        }`}
                    >
                      {sub.label}
                    </span>
                  </label>
                ))}

              </div>
            </div>
          </div>
&nbsp;
          {/* BUTTONS */}
          <div className="mt-8">

            <button
              onClick={applyFilters}
              className="
w-full
bg-red-600
text-white
py-3
rounded-md
text-base
font-semibold
hover:bg-red-700
transition-all
duration-300
shadow-sm
"
            >
              Apply Filters
            </button>
&nbsp;
            <button
              onClick={resetFilters}
              className="
w-full
mt-3
border
border-red-200
text-red-600
py-3
rounded-md
text-base
font-medium
hover:bg-red-50
transition-all
duration-300
"
            >
              Clear All
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
              className="
w-full
border
border-gray-300
px-4
py-3
rounded-md
text-sm
bg-white
outline-none
focus:border-black
"
            >
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
        <br />
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-xl text-gray-400 font-medium italic">Oops! No products found matching your choice.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 gap-y-6 items-stretch">
              {currentProducts.map(item => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  sizes={item.sizes}
                  rating={item.rating}
                />
              ))}
            </div>
            <br />
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