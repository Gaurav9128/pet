import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalCartAmount
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // ✅ Empty cart check (ONLY valid quantity > 0 items)
  const validItems = Object.values(cartItems || {}).filter(
    item => item && item.quantity > 0 && item.price
  );

  const isCartEmpty = validItems.length === 0;

  const subTotal = isCartEmpty ? 0 : getTotalCartAmount() || 0;
  const deliveryFee = isCartEmpty ? 0 : 2;
  const total = subTotal + deliveryFee;

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

              // ❌ Skip invalid items
              if (!item || !item.price || item.quantity <= 0) return null;

              return (
                <div key={cartKey}>
                  <div className='cart-items-title cart-items-item'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='cart-item-image'
                    />

                    <p>{item.name} ({item.size})</p>

                    <p>₹{item.price}</p>

                    <div className='quantity-control'>
                      <button onClick={() => decreaseQuantity(cartKey)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(cartKey)}>+</button>
                    </div>

                    <p>₹{item.price * item.quantity}</p>

                    <p
                      className='cross'
                      onClick={() => removeFromCart(cartKey)}
                    >
                      X
                    </p>
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

      {/* ================= CART BOTTOM ================= */}
      <div className="cart-bottom">
        <div className='cart-total'>
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>SubTotal</p>
            <p>₹{subTotal}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{deliveryFee}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <p>Total</p>
            <p>₹{total}</p>
          </div>

          <button
            disabled={isCartEmpty}
            onClick={() => navigate('/order')}
          >
            PROCEED TO CHECKOUT
          </button>

          <hr />
        </div>

        <div className="cart-promocode">
          <p>If you have a promo code, please enter it here:</p>
          <div className='cart-promocode-input'>
            <input
              type="text"
              placeholder="Enter promo code"
              disabled={isCartEmpty}
            />
            <button disabled={isCartEmpty}>APPLY</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
