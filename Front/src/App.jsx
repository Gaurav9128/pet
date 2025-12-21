import React, { useState } from 'react';
import Navbar from "./Components/Navbar/Navbar";
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer.jsx';
import LoginPopUp from './components/LoginPopUp/LoginPopUp.jsx';
import Orders from './Pages/Orders';
import SearchBar from './components/SearchBar.jsx';
import StoreContextProvider from './context/StoreContext';
import Collection from './Pages/Collection';
import Product from './Pages/Product';
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx';
import TermsAndConditions from './Pages/TermCondition.jsx';


const App = () => {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <StoreContextProvider>
      {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <SearchBar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/payment' element={<Orders />} />
          <Route path='/cats' element={<Collection />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path='/Term-condition' element={<TermsAndConditions />} />
        </Routes>
      </div>

      <Footer />
    </StoreContextProvider>
  );
};

export default App;
