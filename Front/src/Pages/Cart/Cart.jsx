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

  const currentCoupons = availableCoupons.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );

  const totalPages = Math.ceil(availableCoupons.length / couponsPerPage);

  /* ================= APPLY COUPON ================= */
  const applyCoupon = async () => {

    if (isCartEmpty) {
      toast.error("Your cart is empty");
      return;
    }

    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {

      const { data } = await axios.post(
        `${backendUrl}/api/coupon/apply`,
        {
          couponCode,
          cartAmount: subTotal
        }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // 🔥 SHOW TOAST FIRST (important)
      toast.success("Coupon Applied 🎉");

      // 🔥 THEN UPDATE STATE
      setDiscount(data.discount);
      setAppliedCoupon(data.couponCode);
      setMinAmount(data.minCartValue || null);

    } catch (error) {
      toast.error("Failed to apply coupon");
    }
  };
  /* ================= REMOVE COUPON ================= */
  const removeCoupon = () => {

    // 🔥 SHOW TOAST FIRST
    toast.info("Coupon Removed");

    // 🔥 THEN RESET STATE
    setDiscount(0);
    setCouponCode("");
    setAppliedCoupon(null);
    setMinAmount(null);
  };
  /* ================= AUTO REMOVE IF MIN VALUE DROPS ================= */
  useEffect(() => {

    if (!appliedCoupon) return;

    if (subTotal === 0) {
      removeCoupon();
      return;
    }

    if (minAmount && subTotal < minAmount) {
      toast.warning(`Minimum cart value ₹${minAmount} required. Coupon removed.`);
      removeCoupon();
    }

  }, [subTotal]);

  /* ================= CLICK COUPON ================= */
  const handleCouponClick = (coupon) => {

    if (isCartEmpty) {
      toast.error("Add items to cart first");
      return;
    }

    if (appliedCoupon) {
      toast.info("Remove current coupon first");
      return;
    }

    setCouponCode(coupon.code);
  };

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

        {/* ================= COUPON SECTION ================= */}
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
              <button onClick={applyCoupon} disabled={isCartEmpty}>
                APPLY
              </button>
            ) : (
              <button className="remove-btn" onClick={removeCoupon}>
                REMOVE
              </button>
            )}
          </div>

          {appliedCoupon && (
            <p className="applied-text">
              Coupon <b>{appliedCoupon}</b> applied – You saved ₹{discount}
            </p>
          )}

          {/* ================= AVAILABLE COUPONS ================= */}
          {availableCoupons.length > 0 && (
            <div className="available-coupons1">
              <h4>Available Coupons</h4>

              {currentCoupons.map((coupon) => {

                const isPercentage = coupon.discountType === "percentage";

                return (
                  <div
                    key={coupon._id}
                    className="coupon-car"
                    onClick={() => handleCouponClick(coupon)}
                  >
                    <div>
                      <strong>{coupon.code}</strong>
                      <p>
                        Save{" "}
                        {isPercentage
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}{" "}
                        on minimum purchase of ₹{coupon.minCartValue}
                      </p>
                    </div>

                    <button
                      disabled={isCartEmpty}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCouponClick(coupon);
                      }}
                    >
                      USE
                    </button>
                  </div>
                );
              })}

              {/* ================= PAGINATION ================= */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={currentPage === index + 1 ? "active-page" : ""}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
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