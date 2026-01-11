import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import Title from '../../Components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const {
    backendUrl,
    token,
    cartItems,
    clearCart,
    getTotalCartAmount
  } = useContext(StoreContext)

  const navigate = useNavigate()

  const DELIVERY_FEE = 50
  const [method, setMethod] = useState('cod')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Please login first')
      return
    }

    try {
      const orderItems = Object.keys(cartItems)
        .map(cartKey => {
          const item = cartItems[cartKey]
          if (!item || item.quantity <= 0) return null

          const productId = cartKey.split('-')[0]

          return {
            productId,
            name: item.name,
            price: item.price,
            size: item.size,
            quantity: item.quantity,
            image: item.image
          }
        })
        .filter(Boolean)

      if (orderItems.length === 0) {
        toast.error('Cart is empty')
        return
      }

      const subtotal = getTotalCartAmount()
      const totalAmount = subtotal === 0 ? 0 : subtotal + DELIVERY_FEE

      const orderData = {
        address: formData,
        items: orderItems,
        amount: totalAmount,
        paymentMethod: method.toUpperCase()
      }

      // ================= COD =================
      if (method === 'cod') {
        const res = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (res.data.success) {
          toast.success('Order placed successfully')
          clearCart()
          navigate('/payment')
        } else {
          toast.error(res.data.message)
        }
      }

      // ================= PHONEPE =================
      if (method === 'phonepe') {
        const res = await axios.post(
          `${backendUrl}/api/payment/phonepe`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (res.data.success) {
          // PhonePe redirect URL
          window.location.href = res.data.redirectUrl
        } else {
          toast.error(res.data.message)
        }
      }

    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
  }

  const subtotal = getTotalCartAmount()
  const deliveryFee = subtotal === 0 ? 0 : DELIVERY_FEE
  const total = subtotal === 0 ? 0 : subtotal + DELIVERY_FEE

  return (
    <form onSubmit={onSubmitHandler} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input name="firstName" value={formData.firstName} onChange={onChangeHandler} required placeholder="First Name" />
          <input name="lastName" value={formData.lastName} onChange={onChangeHandler} required placeholder="Last Name" />
        </div>

        <input name="email" value={formData.email} onChange={onChangeHandler} required placeholder="Email" />
        <input name="street" value={formData.street} onChange={onChangeHandler} required placeholder="Street" />

        <div className="multi-fields">
          <input name="city" value={formData.city} onChange={onChangeHandler} required placeholder="City" />
          <input name="state" value={formData.state} onChange={onChangeHandler} required placeholder="State" />
        </div>

        <div className="multi-fields">
          <input name="zipCode" value={formData.zipCode} onChange={onChangeHandler} required placeholder="Zip Code" />
          <input name="country" value={formData.country} onChange={onChangeHandler} required placeholder="Country" />
        </div>

        <input name="phone" value={formData.phone} onChange={onChangeHandler} required placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{deliveryFee}</p>
          </div>

          <div className="cart-total-details total">
            <p>Total</p>
            <p>₹{total}</p>
          </div>
        </div>

        <div className="payment-section">
          <Title text1="PAYMENT" text2="METHOD" />

          <div className="payment-options">

            {/* COD */}
            <div
              className={`payment-box ${method === 'cod' ? 'active' : ''}`}
              onClick={() => setMethod('cod')}
            >
              <span className="radio"></span>
              <p>CASH ON DELIVERY</p>
            </div>

            {/* PHONEPE */}
            <div
              className={`payment-box ${method === 'phonepe' ? 'active' : ''}`}
              onClick={() => setMethod('phonepe')}
            >
              <span className="radio"></span>
              <p>PHONEPE</p>
            </div>

          </div>
        </div>

        <button className="order-btn">
          {method === 'phonepe' ? 'PAY WITH PHONEPE' : 'PLACE ORDER'}
        </button>
      </div>
    </form>
  )
}

export default PlaceOrder
