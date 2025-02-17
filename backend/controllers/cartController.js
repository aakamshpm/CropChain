import asyncHandler from "express-async-handler";
import Consumer from "../models/Consumer.js";
import Retailer from "../models/Retailer.js";
import Product from "../models/Product.js";

// add item to cart (Consumer only)
const addToCart = asyncHandler(async (req, res) => {
  const { userId, userRole } = req;
  const { productId, cartFarmerId } = req.body;

  try {
    const userData =
      userRole === "consumer"
        ? await Consumer.findById(userId)
        : await Retailer.findById(userId);
    if (
      !userData?.cartFarmerId ||
      String(userData?.cartFarmerId) === cartFarmerId
    ) {
      let cartData = await userData.cartData;

      if (cartData[productId]) cartData[productId] += 1;
      else cartData[productId] = 1;

      userRole === "consumer"
        ? await Consumer.findByIdAndUpdate(userId, { cartFarmerId, cartData })
        : await Retailer.findByIdAndUpdate(userId, { cartFarmerId, cartData });

      res.status(200).json({ message: "Item added to cart" });
    } else {
      res.status(400);
      throw new Error("Try adding same farmer products");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// get cart info
const getCartInfo = asyncHandler(async (req, res) => {
  const { userId, userRole } = req;
  try {
    const userData =
      userRole === "consumer"
        ? await Consumer.findById(userId)
        : await Retailer.findById(userId);

    const cartData = await userData.cartData;
    res.status(200).json({ cartData, cartFarmerId: userData?.cartFarmerId });
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

//decrement an item
const decrementFromCart = asyncHandler(async (req, res) => {
  const { userId, userRole } = req;
  const { productId } = req.body;

  try {
    const userData =
      userRole === "consumer"
        ? await Consumer.findById(userId)
        : await Retailer.findById(userId);

    let cartData = await userData.cartData;

    if (cartData[productId] > 0) cartData[productId] -= 1;
    else {
      res.status(400);
      throw new Error("No items to remove");
    }

    if (cartData[productId] === 0) {
      delete cartData[productId];
    }

    let cartFarmerId = userData.cartFarmerId;
    const update = { cartData };
    if (Object.keys(cartData).length === 0) {
      update.$unset = { cartFarmerId: "" };
    } else {
      update.cartFarmerId = cartFarmerId;
    }

    userRole === "consumer"
      ? await Consumer.findByIdAndUpdate(userId, update)
      : await Retailer.findByIdAndUpdate(userId, update);

    res.status(200).json({ message: "Item removed" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

//remove an item
const removeFromCart = asyncHandler(async (req, res) => {
  const { userId, userRole } = req;
  const { productId } = req.body;

  const userData =
    userRole === "consumer"
      ? await Consumer.findById(userId)
      : await Retailer.findById(userId);

  let cartData = userData.cartData;

  if (cartData[productId]) delete cartData[productId];

  let cartFarmerId = userData.cartFarmerId;
  const update = { cartData };
  if (Object.keys(cartData).length === 0) {
    update.$unset = { cartFarmerId: "" };
  } else {
    update.cartFarmerId = cartFarmerId;
  }

  userRole === "consumer"
    ? await Consumer.findByIdAndUpdate(userId, update)
    : await Retailer.findByIdAndUpdate(userId, update);

  res.status(200).json({ message: "Item removed" });
});

// rem0ve all items from cart
const removeAllFromCart = asyncHandler(async (req, res) => {
  const { userId, userRole } = req;

  try {
    const cartData = {};
    userRole === "consumer"
      ? await Consumer.findByIdAndUpdate(userId, {
          cartFarmerId: null,
          cartData,
        })
      : await Retailer.findByIdAndUpdate(userId, {
          cartFarmerId: null,
          cartData,
        });

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

//Retailer cart update
const updateRetailerCart = asyncHandler(async (req, res) => {
  const { productId, cartFarmerId, quantity } = req.body;
  const { userRole, userId } = req;

  if (!productId || !cartFarmerId || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (userRole !== "retailer") {
    return res
      .status(403)
      .json({ message: "Only retailers can perform this operation" });
  }
  if (quantity < 100) {
    return res.status(400).json({ message: "Add a minimum of 100kg" });
  }

  try {
    const retailerData = await Retailer.findById(userId);

    if (!retailerData) {
      return res.status(404).json({ message: "Retailer not found" });
    }
    if (
      retailerData.cartFarmerId &&
      cartFarmerId !== String(retailerData.cartFarmerId)
    ) {
      return res
        .status(400)
        .json({ message: "Add products from the same farmer only" });
    }

    // Update cart data
    const updatedCartData = { ...retailerData.cartData, [productId]: quantity };

    await Retailer.findByIdAndUpdate(
      userId,
      { cartData: updatedCartData, cartFarmerId },
      { new: true }
    );

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export {
  addToCart,
  getCartInfo,
  decrementFromCart,
  removeFromCart,
  removeAllFromCart,
  updateRetailerCart,
};
