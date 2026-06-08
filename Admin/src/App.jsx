import React, { useEffect, useState } from 'react'
import Navbar from "./components/Navbar.jsx";
import Sidebar from './components/Sidebar.jsx'
import { Routes, Route } from 'react-router-dom'
import Add from './Pages/Add.jsx'
import List from './Pages/List.jsx'
import Orders from './Pages/Orders.jsx'
import Login from './components/Login.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Pages/Dashboard.jsx';
import UpdateProduct from './Pages/UpdateProduct.jsx';
import AdminReturnRequests from './Pages/AdminReturnRequests.jsx';
import AdminCoupons from './Pages/AdminCoupons.jsx';
import AdminBanner from './Pages/AdminBanner.jsx';
import AddBanner from './Pages/AddBanner.jsx';
import Accessories from './Pages/Accessories.jsx';

// eslint-disable-next-line react-refresh/only-export-components
export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Dashboard token={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/accessories' element={<Accessories token={token}/>}/>
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path="/update-product/:id" element={<UpdateProduct token={token} />} />
                <Route
                  path="/admin/returns"
                  element={
                    <AdminReturnRequests
                      backendUrl={backendUrl}
                      adminToken={token}
                    />
                  }
                />
                <Route
                  path="/admin/coupons"
                  element={
                    <AdminCoupons
                      backendUrl={backendUrl}
                      adminToken={token}
                    />
                  }
                />
                <Route path="/admin/banners" element={<AdminBanner />} />
                <Route path="/admin/promo-banners" element={<AddBanner />}/>
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App