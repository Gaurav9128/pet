import React,{useState} from 'react'
// import './Home.css'
import Header from '../../Components/Header/Header'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
// import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import BestSeller from '../../Components/BestSeller';
import BrandsInFocus from '../../Components/Brand Banners/Brands Banner';
import CouponDeals from '../../Components/CouponDeals/CouponDeals';
import Banner from '../../Components/Banner/Banner';
import TrustBar from '../../Components/TrustBar';

const Home = () => {

  const[category,setCategory]=useState("All");
  return (
    <div>
      <br/>
        <Header />
        <br/>
        <TrustBar />
        <ExploreMenu category={category} setCategory={setCategory} />
        {/* <FoodDisplay category={category} /> */}
        <BestSeller />
        <CouponDeals />
        <Banner />
        <br/>
        <BrandsInFocus />
        </div>
  )
}

export default Home