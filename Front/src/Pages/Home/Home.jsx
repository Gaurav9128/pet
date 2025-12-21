import React,{useState} from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
// import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import BestSeller from '../../components/BestSeller';
const Home = () => {

  const[category,setCategory]=useState("All");
  return (
    <div>
        <Header />
        <ExploreMenu category={category} setCategory={setCategory} />
        <BestSeller />
        
        {/* <FoodDisplay category={category} /> */}

        </div>
  )
}

export default Home