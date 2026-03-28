import React, { useContext, useState, useEffect, useMemo } from 'react'; // useMemo add kiya
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

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
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 3;

  /* ================= SWEETALERT MIXIN ================= */
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  /* ================= CART CALCULATION ================= */
  const subTotal = getTotalCartAmount();
  const isCartEmpty = subTotal === 0;
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

  /* ================= AUTO-SORT COUPONS LOGIC ================= */
  // UseMemo ka use karke hum coupons ko subTotal ke base par sort karenge
  const sortedCoupons = useMemo(() => {
    return [...availableCoupons].sort((a, b) => {
      const aIsApplicable = subTotal >= a.minCartValue;
      const bIsApplicable = subTotal >= b.minCartValue;

      if (aIsApplicable && !bIsApplicable) return -1; // Applicable coupons upar aayenge
      if (!aIsApplicable && bIsApplicable) return 1;
      return b.minCartValue - a.minCartValue; // Baki min value ke according
    });
  }, [availableCoupons, subTotal]);

  /* ================= PAGINATION LOGIC ================= */
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = sortedCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(sortedCoupons.length / couponsPerPage);

  /* ================= REMOVE PRODUCT ALERT ================= */
  const handleRemoveProduct = (cartKey, itemName) => {
    Swal.fire({
      title: 'Remove Item?',
      text: `Are you sure you want to remove ${itemName} from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
      position: 'top', // Aapne pehle kaha tha top pe chahiye
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(cartKey);
        Toast.fire({
          icon: 'success',
          title: 'Item removed'
        });
      }
    });
  };

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
        Toast.fire({ icon: 'success', title: 'Coupon Applied 🎉' });
      } else {
        Swal.fire({ icon: 'error', title: 'Invalid Coupon', text: data.message });
      }
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Failed to apply coupon' });
    }
  };

  const removeCoupon = (silent = false) => {
    if (!silent) Toast.fire({ icon: 'info', title: 'Coupon Removed' });
    setDiscount(0);
    setCouponCode("");
    setAppliedCoupon(null);
    setMinAmount(null);
  };

  useEffect(() => {
    if (!appliedCoupon) return;
    if (subTotal === 0) { removeCoupon(true); return; }
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
      removeCoupon(true);
    }
  }, [subTotal, minAmount, appliedCoupon]);

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
                    {/* Yahan Alert Function lagaya gaya hai */}
                    <p className='cross' onClick={() => handleRemoveProduct(cartKey, item.name)}>X</p>
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
              {currentCoupons.map((coupon) => {
                const isApplicable = subTotal >= coupon.minCartValue;
                return (
                  <div 
                    key={coupon._id} 
                    className={`coupon-car ${!isApplicable ? 'disabled-coupon' : ''}`} 
                    onClick={() => handleCouponClick(coupon)}
                    style={{ opacity: isApplicable ? 1 : 0.6 }}
                  >
                    <div>
                      <strong>{coupon.code}</strong>
                      <p>Save {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} on min purchase of ₹{coupon.minCartValue}</p>
                      {!isApplicable && <span style={{color: 'red', fontSize: '10px'}}>Add ₹{coupon.minCartValue - subTotal} more to unlock</span>}
                    </div>
                    <button disabled={!isApplicable || isCartEmpty} onClick={(e) => { e.stopPropagation(); handleCouponClick(coupon); }}>USE</button>
                  </div>
                );
              })}
              {/* Pagination UI same rahegi */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;