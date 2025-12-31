import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import Title from '../../Components/Title'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getTotalCartAmount,
    products
  } = useContext(StoreContext)

  const DELIVERY_FEE = 40
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

  // ✅ RAZORPAY INIT
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/order/verifyRazorpay',
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          if (data.success) {
            setCartItems({})
            navigate('/payment')
          }
        } catch (error) {
          toast.error('Payment verification failed')
        }
      }
    }

    new window.Razorpay(options).open()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    // ✅ LOGIN CHECK
    if (!token) {
      toast.error('Please login first')
      return
    }

    try {
      let orderItems = []

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const product = products.find(p => p._id === productId)
            if (product) {
              orderItems.push({
                ...structuredClone(product),
                size,
                quantity: cartItems[productId][size]
              })
            }
          }
        }
      }

      const subtotal = getTotalCartAmount()
      const totalAmount = subtotal === 0 ? 0 : subtotal + DELIVERY_FEE

      const orderData = {
        address: formData,
        items: orderItems,
        amount: totalAmount
      }

      // ✅ COMMON HEADERS
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      // ✅ COD
      if (method === 'cod') {
        const res = await axios.post(
          backendUrl + '/api/order/place',
          orderData,
          config
        )

        if (res.data.success) {
          setCartItems({})
          navigate('/payment')
        } else {
          toast.error(res.data.message)
        }
      }

      // ✅ STRIPE
      if (method === 'stripe') {
        const res = await axios.post(
          backendUrl + '/api/order/stripe',
          orderData,
          config
        )

        if (res.data.success) {
          window.location.replace(res.data.session_url)
        }
      }

      // ✅ RAZORPAY
      if (method === 'razorpay') {
        const res = await axios.post(
          backendUrl + '/api/order/razorpay',
          orderData,
          config
        )

        if (res.data.success) {
          initPay(res.data.order)
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

      {/* LEFT */}
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

      {/* RIGHT */}
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

        <button className="order-btn">PLACE ORDER</button>
      </div>
    </form>
  )
}

export default PlaceOrder
