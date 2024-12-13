import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { products } = req.body;

    if (!products) {
      res.status(400);
      throw new Error("No products found");
    }

    // calculate total amount
    const totalAmount = products.reduce(
      (sum, product) => sum + product.quantity * product.pricePerKg,
      0
    );

    const userType = req.userRole === "retailer" ? "Retailer" : "Consumer";
    const userId = req.userId;

    //create order
    const order = await Order.create({
      placedBy: { userType, userId },
      products,
      totalAmount,
    });

    res
      .status(200)
      .json({ message: "Order placed Successfuly", orderId: order._id });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

export { createOrder };
