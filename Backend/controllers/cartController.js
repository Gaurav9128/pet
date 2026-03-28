import userModel from "../models/userModel.js";

/* ================= ADD TO CART ================= */
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    userData.cartData = cartData;
    await userData.save();

    res.json({ success: true, message: "Added To Cart", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ================= UPDATE CART ================= */
const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};

    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    userData.cartData = cartData;
    await userData.save();

    res.json({ success: true, message: "Cart Updated", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ================= GET USER CART ================= */
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found", cartData: {} });
    }

    res.json({
      success: true,
      cartData: userData.cartData || {}
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message, cartData: {} });
  }
};

/* ================= CLEAR CART (Fixes 404 Error) ================= 
   Order place hone ke baad ya manually cart khali karne ke liye
*/
const clearCart = async (req, res) => {
    try {
        const userId = req.userId;

        // Database mein cartData ko empty object {} kar rahe hain
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Cart cleared successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Sabhi functions ko export karein
export { addToCart, updateCart, getUserCart, clearCart };
