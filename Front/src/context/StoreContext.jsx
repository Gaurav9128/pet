import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [couponCode, setCouponCode] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // ================= SAVE CART TO LOCAL STORAGE =================
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ================= SAVE TOKEN =================
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // ================= GET TOTAL ITEMS COUNT (NEW) =================
  const getCartCount = () => {
    let totalCount = 0;
    for (const key in cartItems) {
      if (cartItems[key] && cartItems[key].quantity > 0) {
        totalCount += cartItems[key].quantity;
      }
    }
    return totalCount;
  };

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

    setCartItems((prev) => ({
      ...prev,
      [cartKey]: prev[cartKey]
        ? { ...prev[cartKey], quantity: prev[cartKey].quantity + qty }
        : item,
    }));

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { cartKey, quantity: qty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Cart sync error:", err.message);
      }
    }
  };

  // ================= REMOVE/QUANTITY LOGIC =================
  const removeFromCart = (cartKey) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[cartKey];
      return updated;
    });
  };

  const increaseQuantity = (cartKey) => {
    setCartItems((prev) => ({
      ...prev,
      [cartKey]: { ...prev[cartKey], quantity: prev[cartKey].quantity + 1 },
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
        [cartKey]: { ...item, quantity: item.quantity - 1 },
      };
    });
  };

  // ================= TOTALS =================
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

  const getFinalCartAmount = () => Math.max(getTotalCartAmount() - discountAmount, 0);

  // ================= API CALLS =================
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) setProducts(res.data.products.reverse());
    } catch (err) {
      console.error("Product fetch error:", err.message);
    }
  };

  const getUserCart = async () => {
    try {
      if (!token) return;
      const res = await axios.post(`${backendUrl}/api/cart/get`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(res.data.cartData || {});
    } catch (error) {
      if (error.response?.status === 401) {
        setToken("");
        localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => { getProductsData(); }, []);
  useEffect(() => { if (token) getUserCart(); }, [token]);

  return (
    <StoreContext.Provider
      value={{
        products, cartItems, addToCart, removeFromCart,
        increaseQuantity, decreaseQuantity, getTotalCartAmount,
        getFinalCartAmount, getCartCount, // <--- Added here
        token, setToken, backendUrl, showSearch, setShowSearch,
        searchQuery, setSearchQuery, couponCode, discountAmount
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;