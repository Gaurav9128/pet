import React, { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = () => {

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalCartAmount
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const backendUrl = "http://localhost:4000";
  const DELIVERY_FEE = 50;

  /* ================= COUPON STATES ================= */
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  /* ================= CART CALCULATION ================= */
  const validItems = Object.values(cartItems || {}).filter(
    item => item && item.quantity > 0 && item.price
  );

  const isCartEmpty = validItems.length === 0;

  const subTotal = isCartEmpty ? 0 : getTotalCartAmount();
  const finalSubTotal = Math.max(subTotal - discount, 0);
  const deliveryFee = finalSubTotal === 0 ? 0 : DELIVERY_FEE;
  const total = finalSubTotal + deliveryFee;

  /* ================= APPLY COUPON ================= */
  const applyCoupon = async () => {
    if (!couponCode) {
      return toast.error("Please enter a coupon code");
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/coupon/apply`,
        {
          couponCode,
          cartAmount: subTotal
        }
      );

      if (data.success) {
        setDiscount(data.discount);
        setAppliedCoupon(data.couponCode);
        toast.success("Coupon Applied 🎉");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to apply coupon");
    }
  };

  /* ================= REMOVE COUPON ================= */
  const removeCoupon = () => {
    setDiscount(0);
    setCouponCode("");
    setAppliedCoupon(null);
    toast.info("Coupon Removed");
  };

  /* ================= AUTO REMOVE ================= */
  useEffect(() => {
    if (appliedCoupon && subTotal === 0) {
      removeCoupon();
    }
  }, [subTotal]);

  /* ================= UI ================= */
  return (
    <div className='cart'>

      {/* ================= CART ITEMS ================= */}
      <div className="cart-items">
        {!isCartEmpty ? (
          <>
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>

            <hr />

            {Object.keys(cartItems).map((cartKey) => {
              const item = cartItems[cartKey];
              if (!item || !item.price || item.quantity <= 0) return null;

              return (
                <div key={cartKey}>
                  <div className='cart-items-title cart-items-item'>
                    <img src={item.image} alt={item.name} className='cart-item-image' />
                    <p>{item.name} ({item.size})</p>
                    <p>₹{item.price}</p>

                    <div className='quantity-control'>
                      <button onClick={() => decreaseQuantity(cartKey)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(cartKey)}>+</button>
                    </div>

                    <p>₹{item.price * item.quantity}</p>

                    <p className='cross' onClick={() => removeFromCart(cartKey)}>X</p>
                  </div>
                  <hr />
                </div>
              );
            })}
          </>
        ) : (
          <p className="empty-cart-text">Your cart is empty</p>
        )}
      </div>

      {/* ================= CART TOTAL ================= */}
      <div className="cart-bottom">
        <div className='cart-total'>
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{subTotal}</p>
          </div>

          {appliedCoupon && (
            <div className="cart-total-details text-green">
              <p>Coupon ({appliedCoupon})</p>
              <p>-₹{discount}</p>
            </div>
          )}

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{deliveryFee}</p>
          </div>

          <hr />

          <div className="cart-total-details total">
            <p>Total</p>
            <p>₹{total}</p>
          </div>

          <button
            disabled={isCartEmpty}
            onClick={() =>
              navigate('/order', {
                state: {
                  couponCode: appliedCoupon,
                  discount: discount
                }
              })
            }
          >
            PROCEED TO CHECKOUT
          </button>

          <hr />
        </div>

        {/* ================= COUPON ================= */}
        <div className="cart-promocode">
          <p>If you have a promo code, enter it here:</p>

          <div className='cart-promocode-input'>
            <input
              type="text"
              placeholder="Enter promo code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={isCartEmpty || appliedCoupon}
            />

            {!appliedCoupon ? (
              <button onClick={applyCoupon} disabled={isCartEmpty}>APPLY</button>
            ) : (
              <button className="remove-btn" onClick={removeCoupon}>REMOVE</button>
            )}
          </div>

          {appliedCoupon && (
            <p className="applied-text">
              Coupon <b>{appliedCoupon}</b> applied – You saved ₹{discount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
