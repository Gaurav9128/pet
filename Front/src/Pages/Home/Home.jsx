import React,{useState} from 'react'
// import './Home.css'
import Header from '../../Components/Header/Header'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
// import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import BestSeller from '../../Components/BestSeller';
import BrandsInFocus from '../../Components/Brand Banners/Brands Banner';
const Home = () => {

  const[category,setCategory]=useState("All");
  return (
    <div>
        <Header />
        <ExploreMenu category={category} setCategory={setCategory} />
        {/* <FoodDisplay category={category} /> */}
        <BestSeller />
        <BrandsInFocus />
        
        

        </div>
  )
}

export default Home