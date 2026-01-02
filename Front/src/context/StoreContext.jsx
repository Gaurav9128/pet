import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [cartItems, setCartItems] = useState({});
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');

    /* ================= ADD TO CART ================= */
    const addToCart = async (itemId, size, price) => {

        const cartKey = `${itemId}-${size}`;
        const product = products.find(p => p._id === itemId);
        if (!product || !price) return;

        const item = {
            quantity: 1,
            price: Number(price),
            size,
            name: product.name,
            image: product.image?.[0] || ''
        };

        setCartItems(prev => ({
            ...prev,
            [cartKey]: prev[cartKey]
                ? { ...prev[cartKey], quantity: prev[cartKey].quantity + 1 }
                : item
        }));

        if (token) {
            await axios.post(
                `${backendUrl}/api/cart/add`,
                { cartKey, item },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        }
    };

    /* ================= REMOVE ================= */
    const removeFromCart = (cartKey) => {
        setCartItems(prev => {
            const updated = { ...prev };
            delete updated[cartKey];
            return updated;
        });
    };

    /* ================= QTY ================= */
    const increaseQuantity = (cartKey) => {
        setCartItems(prev => ({
            ...prev,
            [cartKey]: {
                ...prev[cartKey],
                quantity: prev[cartKey].quantity + 1
            }
        }));
    };

    const decreaseQuantity = (cartKey) => {
        setCartItems(prev => {
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
                    quantity: item.quantity - 1
                }
            };
        });
    };

    /* ================= CLEAR CART (IMPORTANT) ================= */
    const clearCart = () => {
        setCartItems({});
    };

    /* ================= TOTAL ================= */
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

    /* ================= PRODUCTS ================= */
    const getProductsData = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/product/list`);
            if (res.data.success) {
                setProducts(res.data.products.reverse());
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    /* ================= USER CART ================= */
    const getUserCart = async (jwtToken) => {
        try {
            const res = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            );

            if (res.data.success) {
                setCartItems(res.data.cartData || {});
            }
        } catch (err) {
            toast.error("Please login again");
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');

        if (savedToken && !token) {
            setToken(savedToken);
            getUserCart(savedToken);
        }
    }, [token]);

    const contextValue = {
        products,
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,               // ✅ PROVIDED
        getTotalCartAmount,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        backendUrl,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
