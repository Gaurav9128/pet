import React, { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Sirf Swal use hoga

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    backendUrl,
    getTotalCartAmount
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const DELIVERY_FEE = 50;

  /* ================= STATES ================= */
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  /* ================= PAGINATION STATES ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 3;

  /* ================= CART CALCULATION ================= */
  const validItems = Object.values(cartItems || {}).filter(
    item => item && item.quantity > 0 && item.price
  );

  const isCartEmpty = validItems.length === 0;
  const subTotal = isCartEmpty ? 0 : getTotalCartAmount();
  const finalSubTotal = Math.max(subTotal - discount, 0);
  const deliveryFee = finalSubTotal === 0 ? 0 : DELIVERY_FEE;
  const total = finalSubTotal + deliveryFee;

  /* ================= SWEETALERT MIXIN (For Reusable Toasts) ================= */
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  /* ================= FETCH AVAILABLE COUPONS ================= */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/coupons`);
        if (res.data.success) {
          setAvailableCoupons(res.data.coupons);
        }
      } catch (error) {
        console.log("Failed to fetch coupons", error);
      }
    };
    fetchCoupons();
  }, [backendUrl]);

  /* ================= PAGINATION LOGIC ================= */
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = availableCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(availableCoupons.length / couponsPerPage);

  /* ================= APPLY COUPON ================= */
  const applyCoupon = async () => {
    if (isCartEmpty) {
      Toast.fire({ icon: 'error', title: 'Your cart is empty' });
      return;
    }

    if (!couponCode) {
      Toast.fire({ icon: 'warning', title: 'Please enter a coupon code' });
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/coupon/apply`, {
        couponCode,
        cartAmount: subTotal
      });

      if (data.success) {
        setDiscount(data.discount);
        setAppliedCoupon(data.couponCode);
        setMinAmount(data.minCartValue || null);
        
        Toast.fire({
          icon: 'success',
          title: 'Coupon Applied 🎉',
          text: `You saved ₹${data.discount}`
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Invalid Coupon', text: data.message });
      }
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Failed to apply coupon' });
    }
  };

  /* ================= REMOVE COUPON ================= */
  const removeCoupon = (silent = false) => {
    if (!silent) {
      Toast.fire({ icon: 'info', title: 'Coupon Removed' });
    }
    setDiscount(0);
    setCouponCode("");
    setAppliedCoupon(null);
    setMinAmount(null);
  };

  /* ================= AUTO REMOVE IF MIN VALUE DROPS ================= */
  useEffect(() => {
    if (!appliedCoupon) return;

    if (subTotal === 0) {
      removeCoupon(true); 
      return;
    }

    if (minAmount && subTotal < minAmount) {
      Swal.fire({
        icon: 'warning',
        title: 'Coupon Removed',
        html: `Minimum purchase of <b>₹${minAmount}</b> required.`,
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      removeCoupon(true); // silent true taaki do baar alert na aaye
    }
  }, [subTotal, minAmount, appliedCoupon]);

  /* ================= CLICK COUPON ================= */
  const handleCouponClick = (coupon) => {
    if (isCartEmpty) {
      Toast.fire({ icon: 'error', title: 'Add items to cart first' });
      return;
    }

    if (appliedCoupon) {
      Toast.fire({ icon: 'info', title: 'Remove current coupon first' });
      return;
    }
    setCouponCode(coupon.code);
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        {!isCartEmpty ? (
          <>
            <div className="cart-items-title">
              <p>Items</p><p>Title</p><p>Price</p><p>Quantity</p><p>Total</p><p>Remove</p>
            </div>
            <hr />
            {Object.keys(cartItems).map((cartKey) => {
              const item = cartItems[cartKey];
              if (!item || item.quantity <= 0) return null;
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

      <div className="cart-bottom">
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div className="cart-total-details"><p>Subtotal</p><p>₹{subTotal}</p></div>
          {appliedCoupon && (
            <div className="cart-total-details text-green">
              <p>Coupon ({appliedCoupon})</p><p>-₹{discount}</p>
            </div>
          )}
          <div className="cart-total-details"><p>Delivery Fee</p><p>₹{deliveryFee}</p></div>
          <hr />
          <div className="cart-total-details total"><p>Total</p><p>₹{total}</p></div>
          <button disabled={isCartEmpty} onClick={() => navigate('/order', { state: { couponCode: appliedCoupon, discount } })}>
            PROCEED TO CHECKOUT
          </button>
        </div>

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
              <button className="remove-btn" onClick={() => removeCoupon()}>REMOVE</button>
            )}
          </div>

          {availableCoupons.length > 0 && (
            <div className="available-coupons1">
              <h4>Available Coupons</h4>
              {currentCoupons.map((coupon) => (
                <div key={coupon._id} className="coupon-car" onClick={() => handleCouponClick(coupon)}>
                  <div>
                    <strong>{coupon.code}</strong>
                    <p>Save {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} on min purchase of ₹{coupon.minCartValue}</p>
                  </div>
                  <button disabled={isCartEmpty} onClick={(e) => { e.stopPropagation(); handleCouponClick(coupon); }}>USE</button>
                </div>
              ))}
              {totalPages > 1 && (
                <div className="pagination">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} className={currentPage === i + 1 ? "active-page" : ""} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  ))}
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;