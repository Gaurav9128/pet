import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem.jsx';
import { StoreContext } from '../context/StoreContext';

const Collection = () => {

  const { products , search , showSearch } = useContext(StoreContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relavent')

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }

  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = () => {

  let productsCopy = [...products];

  // 🔍 Search filter
  if (showSearch && search) {
    productsCopy = productsCopy.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 🐶 Category filter (FIXED)
  if (category.length > 0) {
    productsCopy = productsCopy.filter(item =>
      category.some(cat =>
        cat.toLowerCase().trim() === item.category.toLowerCase().trim()
      )
    );
  }

  // 🍖 SubCategory filter (FIXED)
  if (subCategory.length > 0) {
    productsCopy = productsCopy.filter(item =>
      subCategory.some(sub =>
        sub.toLowerCase().trim() === item.subCategory.toLowerCase().trim()
      )
    );
  }

  setFilterProducts(productsCopy);
};


  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }
  }

  useEffect(()=>{
      applyFilter();
  },[category,subCategory,search,showSearch,products])

  useEffect(()=>{
    sortProduct();
  },[sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Cat Food'} onChange={toggleCategory}/> Cat Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Dog Food'} onChange={toggleCategory}/> Dog Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Small Pets'} onChange={toggleCategory}/> Small Pets
            </p>
             <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Pet Parent'} onChange={toggleCategory}/> Pet Parent
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Henlo'} onChange={toggleCategory}/>Henlo
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Pharmacy'} onChange={toggleCategory}/>Pharmacy
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Consult a Vet'} onChange={toggleCategory}/>Consult a Vet
            </p>
          </div>
        </div>
        <br/>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'DryFood'} onChange={toggleSubCategory}/> Dry Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'WetFood'} onChange={toggleSubCategory}/> Wet Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'KittenFood'} onChange={toggleSubCategory}/>Kitten Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'PremiumFood'} onChange={toggleSubCategory}/>Premium Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'CreamyTreats'} onChange={toggleSubCategory}/>Creamy Treats
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'JerkyTreats'} onChange={toggleSubCategory}/>Jerky Treats
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'CrunchyTreats'} onChange={toggleSubCategory}/>Crunchy Treats
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'PuppyFood'} onChange={toggleSubCategory}/>Puppy Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'GrainFreeFood'} onChange={toggleSubCategory}/>Grain Free Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'BakedDryFood'} onChange={toggleSubCategory}/>Baked Dry Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'PremiumDogFood'} onChange={toggleSubCategory}/>Premium Dog Food
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Biscuits&Cookies'} onChange={toggleSubCategory}/>Biscuits & Cookies
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bones&Chews'} onChange={toggleSubCategory}/>Bones & Chews
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'SkinCare'} onChange={toggleSubCategory}/>Skin Care
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'JointCare'} onChange={toggleSubCategory}/>Joint Care
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'KidneyCare'} onChange={toggleSubCategory}/>Kidney Care
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'LiverCare'} onChange={toggleSubCategory}/>Liver Care
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'CardiacCare'} onChange={toggleSubCategory}/>Cardiac Care
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Eye&EarCare'} onChange={toggleSubCategory}/>Eye & Ear Care
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            {/* Porduct Sort */}
            <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
              <option value="relavent">Sort by: Relavent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item,index)=>(
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default Collection
