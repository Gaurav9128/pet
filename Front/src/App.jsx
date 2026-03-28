import React, { useState } from 'react';
import Navbar from "./Components/Navbar/Navbar.jsx";
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder';
import Footer from './Components/Footer/Footer.jsx';
import LoginPopUp from './Components/LoginPopUp/LoginPopUp.jsx';
import Orders from './Pages/Orders';
import StoreContextProvider from './context/StoreContext';
import Collection from './Pages/Collection';
import Product from './Pages/Product';
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx';
import TermsAndConditions from './Pages/TermCondition.jsx';
import ContactUs from './Components/ContactUs/ContactUs.jsx';
import Scroll from "./Components/scroll.jsx";

// Toastify ke imports hata diye gaye hain kyunki ab hum SweetAlert2 use kar rahe hain

const App = () => {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <StoreContextProvider>
      {/* SweetAlert2 ko ToastContainer ki zaroorat nahi hoti. 
          Ye directly LoginPopUp ya kisi bhi component se call karne par popup dikha dega.
      */}
      
      {/* 1. Agar showLogin true hai, toh sirf PopUp dikhega */}
      {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}

      <div className='app'>
       {!showLogin && <Navbar setShowLogin={setShowLogin} />}
        
        <Scroll />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/payment' element={<Orders />} />
          <Route path='/cats' element={<Collection />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path='/termscondition' element={<TermsAndConditions />} />
          <Route path='/contactus' element={<ContactUs />}/>
        </Routes>
      </div>

      {!showLogin && <Footer />}
    </StoreContextProvider>
  );
};

export default App;