import React,{useState} from 'react'
// import './Home.css'
import Header from '../../Components/Header/Header'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
// import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import BestSeller from '../../Components/BestSeller';
const Home = () => {

  const[category,setCategory]=useState("All");
  return (
    <div>
        <Header />
        <ExploreMenu category={category} setCategory={setCategory} />
        {/* <FoodDisplay category={category} /> */}
        <BestSeller />
        
        

        </div>
  )
}

export default Home