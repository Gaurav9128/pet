import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {/* Loop through cartItems keys instead of products */}
        {Object.keys(cartItems).map((cartKey, index) => {
          const item = cartItems[cartKey]; // object with { quantity, price, size, name }
          
          return (
            <div key={index}>
              <div className='cart-items-title cart-items-item'>
                <img src={item.image} alt='' className='cart-item-image' />
                {/* Show size in title */}
                <p>{item.name} ({item.size})</p>
                <p>₹{item.price}</p>

                {/* Quantity Control */}
                <div className='quantity-control'>
                  <button onClick={() => decreaseQuantity(cartKey)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(cartKey)}>+</button>
                </div>

                <p>₹{item.price * item.quantity}</p>
                <p onClick={() => removeFromCart(cartKey)} className='cross'>X</p>
              </div>
              <hr />
            </div>
          )
        })}
      </div>

      <div className="cart-bottom">
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
          <hr />
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, please enter it here:</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder="Enter promo code" />
              <button>APPLY</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
