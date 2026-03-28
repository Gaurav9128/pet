import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import Title from "../../Components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const PlaceOrder = () => {
  const { backendUrl, token, cartItems, clearCart, getTotalCartAmount, user } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  const couponCode = location.state?.couponCode || null;
  const discount = location.state?.discount || 0;
  const couponUsed = location.state?.couponUsed || false;

  const DELIVERY_FEE = 50;
  const MIN_COD_AMOUNT = 700;

  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false); // 👈 Double click rokne ke liye

  // State & City Data
  const statesData = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
    "Gujarat": ["Ahmedabad", "Surat", "Rajkot"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
    "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur"]
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "", 
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: ""
  });

  /* ================= AUTO-FILL EMAIL ================= */
  useEffect(() => {
    if (token && user && user.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    } else if (token) {
      const savedEmail = localStorage.getItem("email") || JSON.parse(localStorage.getItem("user"))?.email;
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }));
      }
    }
  }, [token, user]);

  /* ================= FORM HANDLER ================= */
  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    // ZipCode 6 digits limit
    if (name === "zipCode" && value.length > 6) return;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset City if State changes
    if (name === "state") {
      setFormData(prev => ({ ...prev, state: value, city: "" }));
    }
  };

  const cartSubtotal = getTotalCartAmount();
  const appliedDiscount = couponUsed ? 0 : discount;
  const discountedSubtotal = Math.max(cartSubtotal - appliedDiscount, 0);
  const deliveryFee = discountedSubtotal === 0 ? 0 : DELIVERY_FEE;
  const total = discountedSubtotal + deliveryFee;

  /* ================= SUBMIT ================= */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // 🛑 Agar pehle se process ho raha hai toh return kar jao
    if (loading) return;

    if (!token) return toast.error("Please login first");
    if (method === "cod" && total < MIN_COD_AMOUNT) return toast.error("COD only for orders above ₹700");

    const orderItems = Object.keys(cartItems).map(key => {
      const item = cartItems[key];
      if (!item || item.quantity <= 0) return null;
      return { productId: key.split("-")[0], name: item.name, price: item.price, size: item.size, quantity: item.quantity, image: item.image };
    }).filter(Boolean);

    const orderData = {
      address: formData,
      items: orderItems,
      subTotal: cartSubtotal,
      discountAmount: appliedDiscount,
      deliveryFee: deliveryFee,
      amount: total,
      paymentMethod: method.toUpperCase()
    };

    try {
      setLoading(true); // ⏳ Loading Start (Button disable ho jayega)

      let res;
      if (method === "cod") {
        res = await axios.post(`${backendUrl}/api/order/place`, orderData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      } else {
        res = await axios.post(`${backendUrl}/api/payment/phonepe`, orderData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      }

      if (res.data.success) {
        if (method === "cod") {
          Swal.fire({
            title: "Order Placed!",
            text: "Your order has been recorded successfully.",
            icon: "success",
            confirmButtonColor: "#000",
            confirmButtonText: "Proceed",
            allowOutsideClick: false // User bahar click karke band na kar sake
          }).then((result) => {
            if (result.isConfirmed) {
              clearCart(); 
              navigate("/payment");
            }
            setLoading(false); // Alert ke baad reset
          });
        } else {
          window.location.href = res.data.redirectUrl;
        }
      } else {
        setLoading(false);
        toast.error(res.data.message);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form className="place-order" onSubmit={onSubmitHandler}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input name="firstName" value={formData.firstName} onChange={onChangeHandler} required placeholder="First Name" />
          <input name="lastName" value={formData.lastName} onChange={onChangeHandler} required placeholder="Last Name" />
        </div>

        <input name="email" value={formData.email} onChange={onChangeHandler} required placeholder="Email" />
        <input name="street" value={formData.street} onChange={onChangeHandler} required placeholder="Street" />

        <div className="multi-fields">
          <select name="state" value={formData.state} onChange={onChangeHandler} required className="dropdown-field">
            <option value="">Select State</option>
            {Object.keys(statesData).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select name="city" value={formData.city} onChange={onChangeHandler} required className="dropdown-field" disabled={!formData.state}>
            <option value="">Select City</option>
            {formData.state && statesData[formData.state].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="multi-fields">
          <input type="number" name="zipCode" value={formData.zipCode} onChange={onChangeHandler} required placeholder="Zip Code" />
          <input name="country" value={formData.country} readOnly placeholder="Country" />
        </div>

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
          required
          placeholder="Phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details"><p>Subtotal</p><p>₹{cartSubtotal}</p></div>
          {appliedDiscount > 0 && (
            <div className="cart-total-details text-green"><p>Coupon</p><p>-₹{appliedDiscount}</p></div>
          )}
          <div className="cart-total-details"><p>Delivery Fee</p><p>₹{deliveryFee}</p></div>
          <hr />
          <div className="cart-total-details total"><p>Total</p><p>₹{total}</p></div>
        </div>

        <div className="payment-section" style={{marginTop:'30px'}}>
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="payment-options">
            <div className={`payment-box ${method === 'cod' ? 'active' : ''} ${total < MIN_COD_AMOUNT ? 'disabled' : ''}`} onClick={() => total >= MIN_COD_AMOUNT && setMethod('cod')}>
              <span className="radio"></span>
              <p>CASH ON DELIVERY {total < MIN_COD_AMOUNT && <small style={{color:'red', display:'block'}}>(Min ₹700)</small>}</p>
            </div>
            <div className={`payment-box ${method === 'phonepe' ? 'active' : ''}`} onClick={() => setMethod('phonepe')}>
              <span className="radio"></span>
              <p>PHONEPE / UPI</p>
            </div>
          </div>
        </div>

        {/* 🔘 Updated Button with Loading Logic */}
        <button 
          type="submit" 
          className={`order-btn ${loading ? 'btn-loading' : ''}`} 
          disabled={loading}
        >
          {loading ? "PROCESSING..." : (method === 'phonepe' ? 'PAY WITH PHONEPE' : 'PLACE ORDER')}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;