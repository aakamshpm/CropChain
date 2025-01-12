import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Razorpay from "razorpay";

// initialize razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || "",
//   key_secret: process.env.RAZORPAY_KEY_SECRET || "",
// });

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { products, address } = req.body;

    if (!products) {
      res.status(400);
      throw new Error("No products found");
    }

    // calculate total amount
    const totalAmount = products.reduce(
      (sum, product) => sum + product.quantity * product.pricePerKg,
      0
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
    });

    const userType = req.userRole === "retailer" ? "Retailer" : "Consumer";
    const userId = req.userId;

    //create order
    const order = await Order.create({
      placedBy: { userType, userId },
      products,
      address,
      totalAmount,
      paymentId: razorpayOrder.id,
    });

    res.status(200).json({
      message: "Order placed Successfuly",
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// Verify razorpay signature
const verifyPayment = asyncHandler(async (req, res) => {});

export { createOrder };
