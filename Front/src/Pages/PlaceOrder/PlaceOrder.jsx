import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import Title from "../../Components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const PlaceOrder = () => {
  const { backendUrl, token, cartItems, clearCart, getTotalCartAmount } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  // 👇 CART PAGE SE AAYA DATA
  const couponCode = location.state?.couponCode || null;
  const discount = location.state?.discount || 0;
  const couponUsed = location.state?.couponUsed || false; // optional flag from Cart page

  const DELIVERY_FEE = 50;
  const MIN_COD_AMOUNT = 700;

  const [method, setMethod] = useState("cod");
  const [showLoginMsg, setShowLoginMsg] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  /* ================= LOGIN CHECK ================= */
  useEffect(() => {
    setShowLoginMsg(!token);
  }, [token]);

  /* ================= FORM HANDLER ================= */
  const onChangeHandler = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /* ================= TOTAL CALCULATION ================= */
  const cartSubtotal = getTotalCartAmount();
  const appliedDiscount = couponUsed ? 0 : discount;
  const discountedSubtotal = Math.max(cartSubtotal - appliedDiscount, 0);
  const deliveryFee = discountedSubtotal === 0 ? 0 : DELIVERY_FEE;
  const total = discountedSubtotal + deliveryFee;

  /* ================= SUBMIT ================= */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (method === "cod" && total < MIN_COD_AMOUNT) {
      toast.error("COD available only above ₹700");
      return;
    }

    const orderItems = Object.keys(cartItems)
      .map(key => {
        const item = cartItems[key];
        if (!item || item.quantity <= 0) return null;

        return {
          productId: key.split("-")[0],
          name: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          image: item.image
        };
      })
      .filter(Boolean);

    if (orderItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const orderData = {
  address: formData,
  items: orderItems,

  // 👇 ADD THESE
  subTotal: cartSubtotal,
  discountAmount: appliedDiscount,
  deliveryFee: deliveryFee,

  amount: total,
  couponCode: couponUsed ? null : couponCode,
  paymentMethod: method.toUpperCase()
};


    try {
      if (method === "cod") {
        const res = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          toast.success("Order placed successfully");
          clearCart();
          navigate("/payment");
        } else {
          toast.error(res.data.message);
        }
      }

      if (method === "phonepe") {
        const res = await axios.post(
          `${backendUrl}/api/payment/phonepe`,
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          window.location.href = res.data.redirectUrl;
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg === "Coupon already used" ? "Coupon already used" : msg);
    }
  };

  /* ================= LOGIN REQUIRED SCREEN ================= */
  if (!token && showLoginMsg) {
    return (
      <div className="login-required">
        <h2>Please Login</h2>
        <p>Firstly you can login, then order it</p>
        <button
          className="order-btn"
          onClick={() => navigate("/")}
        >
          GO TO LOGIN
        </button>
      </div>
    );
  }

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
          <input name="city" value={formData.city} onChange={onChangeHandler} required placeholder="City" />
          <input name="state" value={formData.state} onChange={onChangeHandler} required placeholder="State" />
        </div>

        <div className="multi-fields">
          <input name="zipCode" value={formData.zipCode} onChange={onChangeHandler} required placeholder="Zip Code" />
          <input name="country" value={formData.country} onChange={onChangeHandler} required placeholder="Country" />
        </div>

        <input
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phone: value });
  }}
  required
  placeholder="Phone"
  maxLength={10}
/>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{cartSubtotal}</p>
          </div>

          {appliedDiscount > 0 && (
            <div className="cart-total-details text-green">
              <p>Coupon ({couponCode})</p>
              <p>-₹{appliedDiscount}</p>
            </div>
          )}

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
              className={`payment-box ${method === 'cod' ? 'active' : ''} ${total < MIN_COD_AMOUNT ? 'disabled' : ''}`}
              onClick={() => {
                if (total < MIN_COD_AMOUNT) {
                  toast.error('COD available only on orders above ₹700');
                  return;
                }
                setMethod('cod');
              }}
            >
              <span className="radio"></span>
              <p>
                CASH ON DELIVERY
                {total < MIN_COD_AMOUNT && (
                  <small style={{ color: 'red', display: 'block' }}>
                    (Available above ₹700)
                  </small>
                )}
              </p>
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
  );
};

export default PlaceOrder;
