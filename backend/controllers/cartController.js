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

      await Product.findOneAndUpdate(
        { _id: productId, quantityAvailableInKg: { $gte: 1 } },
        { $inc: { quantityAvailableInKg: -1 } }
      );

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

    await Product.findByIdAndUpdate(productId, {
      $inc: { quantityAvailableInKg: 1 },
    });

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
      ? await Consumer.findByIdAndUpdate(userId, { cartFarmerId: "", cartData })
      : await Retailer.findByIdAndUpdate(userId, {
          cartFarmerId: "",
          cartData,
        });

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// Retailer cart
const addToRetailerCart = asyncHandler(async (req, res) => {
  const { productId, cartFarmerId } = req.body;
  const { userRole, userId } = req;
});

export {
  addToCart,
  getCartInfo,
  decrementFromCart,
  removeFromCart,
  removeAllFromCart,
  addToRetailerCart,
};
