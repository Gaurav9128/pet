import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import Title from '../../Components/Title'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

     const { getTotalCartAmount } = useContext(StoreContext)
  const [method, setMethod] = useState('cod')
  const navigate = useNavigate()

    const handleOrder = (e) => {
    e.preventDefault()
    navigate('/payment')
  }

   return (
    <form className='place-order' onSubmit={handleOrder}>

      {/* LEFT SIDE */}
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>

        <div className="multi-fields">
          <input type="text" placeholder='First Name' />
          <input type="text" placeholder='Last Name' />
        </div>

        <input type="email" placeholder='Email Address' />
        <input type="text" placeholder='Street' />

        <div className="multi-fields">
          <input type='text' placeholder='City' />
          <input type='text' placeholder='State' />
        </div>

        <div className="multi-fields">
          <input type="text" placeholder='Zip Code' />
          <input type="text" placeholder='Country' />
        </div>

        <input type="text" placeholder='Phone' />
      </div>

      {/* RIGHT SIDE */}
      <div className="place-order-right">

        <div className='cart-total'>
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>SubTotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>

          <div className="cart-total-details total">
            <p>Total</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className='payment-section'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          <div className='payment-options'>

            <div
              className={`payment-box ${method === 'stripe' ? 'active' : ''}`}
              onClick={() => setMethod('stripe')}
            >
              <span className="radio"></span>
              <img src={assets.stripe_logo} alt="stripe" />
            </div>

            <div
              className={`payment-box ${method === 'cod' ? 'active' : ''}`}
              onClick={() => setMethod('cod')}
            >
              <span className="radio"></span>
              <p>CASH ON DELIVERY</p>
            </div>

          </div>
        </div>

        <button type="submit" className='order-btn'>
          PLACE ORDER
        </button>

      </div>
    </form>
  )
}

export default PlaceOrder