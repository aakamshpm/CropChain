import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Consumer from "../models/Consumer.js";
import Retailer from "../models/Retailer.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { products, address, paymentMode } = req.body;

    if (!products) {
      res.status(400);
      throw new Error("No products found");
    }

    // calculate total amount
    const totalAmount = await products.reduce(
      (sum, product) => sum + product.quantity * product.pricePerKg,
      0
    );

    const userType = req.userRole === "retailer" ? "Retailer" : "Consumer";
    const userId = req.userId;

    if (paymentMode === "cod") {
      //create order
      const order = await Order.create({
        placedBy: { userType, userId },
        products,
        address,
        totalAmount: totalAmount + 2,
        paymentMode,
      });

      res.status(200).json({
        orderId: order._id,
        message: "Order placed",
      });
    } else {
      // initialize razorpay
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "",
      });

      const razorpayOrder = await razorpay.orders.create({
        amount: (totalAmount + 2) * 100,
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
      });

      //create order
      const order = await Order.create({
        placedBy: { userType, userId },
        products,
        address,
        totalAmount: totalAmount + 2,
        paymentMode,
        paymentId: razorpayOrder.id,
      });

      res.status(200).json({
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// Verify razorpay signature
const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
    req.body;
  const { userId, userRole } = req;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  try {
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature === razorpaySignature) {
      if (userRole === "consumer")
        await Consumer.findByIdAndUpdate(userId, { cartData: {} });
      else await Retailer.findByIdAndUpdate(userId, { cartData: {} });

      const resp = await Order.findByIdAndUpdate(orderId, {
        paymentStatus: true,
      });

      res.status(200).json({ message: "Payment successful", resp });
    } else {
      await Order.findByIdAndDelete(orderId);
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

export { createOrder, verifyPayment };
