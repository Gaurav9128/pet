import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

 const [showSearch, setShowSearch] = useState(false);

  const [search, setSearch] = useState(""); // <-- Added for SearchBar functionality

  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  // COUPON STATES
  const [couponCode, setCouponCode] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  
  // ================= ADD TO CART =================
const addToCart = async (itemId, size, price, qty = 1) => {
  const cartKey = `${itemId}-${size}`;
  const product = products.find((p) => p._id === itemId);
  if (!product || !price) return;

  const item = {
    quantity: qty,
    price: Number(price),
    size,
    name: product.name,
    image: product.image?.[0] || "",
  };

  setCartItems((prev) => {
    const updatedCart = {
      ...prev,
      [cartKey]: prev[cartKey]
        ? {
            ...prev[cartKey],
            quantity: prev[cartKey].quantity + qty,
          }
        : item,
    };

    return updatedCart;
  });

  // Backend sync
  if (token) {
    await axios.post(
      `${backendUrl}/api/cart/add`,
      {
        cartKey,
        quantity: qty,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
};

  // ================= REMOVE =================
  const removeFromCart = (cartKey) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[cartKey];
      return updated;
    });
  };

  // ================= QTY =================
  const increaseQuantity = (cartKey) => {
    setCartItems((prev) => ({
      ...prev,
      [cartKey]: {
        ...prev[cartKey],
        quantity: prev[cartKey].quantity + 1,
      },
    }));
  };

  const decreaseQuantity = (cartKey) => {
    setCartItems((prev) => {
      const item = prev[cartKey];
      if (!item) return prev;

      if (item.quantity <= 1) {
        const updated = { ...prev };
        delete updated[cartKey];
        return updated;
      }

      return {
        ...prev,
        [cartKey]: {
          ...item,
          quantity: item.quantity - 1,
        },
      };
    });
  };

  // ================= TOTAL =================
  const getTotalCartAmount = () => {
    let total = 0;
    for (const key in cartItems) {
      const item = cartItems[key];
      if (item && item.quantity > 0) {
        total += item.price * item.quantity;
      }
    }
    return total;
  };

  // ================= FINAL TOTAL (AFTER COUPON) =================
  const getFinalCartAmount = () => Math.max(getTotalCartAmount() - discountAmount, 0);

  // ================= APPLY COUPON =================
  const applyCoupon = async (code) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/coupon/apply`,
        { code, cartTotal: getTotalCartAmount() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCouponCode(code);
        setDiscountAmount(res.data.discountAmount);
        toast.success(`Coupon applied! You saved ₹${res.data.discountAmount}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ================= REMOVE COUPON =================
  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountAmount(0);
    toast.info("Coupon removed");
  };

  // ================= CLEAR CART =================
  const clearCart = () => {
    setCartItems({});
    setCouponCode(null);
    setDiscountAmount(0);
  };

  // ================= PRODUCTS =================
  const getProductsData = async () => {
    const res = await axios.get(`${backendUrl}/api/product/list`);
    if (res.data.success) {
      setProducts(res.data.products.reverse());
    }
  };

  // ================= USER CART =================
  const getUserCart = async (jwtToken) => {
    const res = await axios.post(
      `${backendUrl}/api/cart/get`,
      {},
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );
    if (res.data.success) {
      setCartItems(res.data.cartData || {});
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, [token]);

  return (
    <StoreContext.Provider
      value={{
        products,
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,

        getTotalCartAmount,
        getFinalCartAmount,

        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,

        backendUrl,
        token,
        setToken,

        showSearch,
        setShowSearch,

        search,      // <-- Added for SearchBar
        setSearch,   // <-- Added for SearchBar
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
