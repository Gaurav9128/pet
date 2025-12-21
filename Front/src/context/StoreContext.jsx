import { createContext, useState } from "react";
import { products } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Add to cart (with size and price)
    const addToCart = (itemId, size, price) => {
        const cartKey = `${itemId}-${size}`; // unique key for each size
        const product = products.find(p => p._id === itemId);

        setCartItems(prev => ({
            ...prev,
            [cartKey]: prev[cartKey] 
                ? { ...prev[cartKey], quantity: prev[cartKey].quantity + 1 } 
                : { 
                    quantity: 1, 
                    price: price, 
                    size: size, 
                    name: product.name,
                    image: product.image[0]
                }
        }));
    }

    // Remove completely from cart
    const removeFromCart = (cartKey) => {
        setCartItems(prev => {
            const updatedCart = { ...prev };
            delete updatedCart[cartKey];
            return updatedCart;
        });
    }

    // Increase quantity
    const increaseQuantity = (cartKey) => {
        setCartItems(prev => ({
            ...prev,
            [cartKey]: { 
                ...prev[cartKey], 
                quantity: prev[cartKey].quantity + 1 
            }
        }));
    }

    // Decrease quantity
    const decreaseQuantity = (cartKey) => {
        setCartItems(prev => {
            if(prev[cartKey].quantity === 1){
                const updatedCart = { ...prev };
                delete updatedCart[cartKey];
                return updatedCart;
            } else {
                return {
                    ...prev,
                    [cartKey]: { 
                        ...prev[cartKey], 
                        quantity: prev[cartKey].quantity - 1 
                    }
                };
            }
        });
    }

    // Total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const cartKey in cartItems){
            totalAmount += cartItems[cartKey].price * cartItems[cartKey].quantity;
        }
        return totalAmount;
    }

    const contextValue = {
        products,
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalCartAmount,
        search, setSearch, showSearch, setShowSearch,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;
