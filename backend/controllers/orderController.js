import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Consumer from "../models/Consumer.js";
import Retailer from "../models/Retailer.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const createOrder = asyncHandler(async (req, res) => {
  try {
    const {
      farmerId,
      products,
      address,
      paymentMode,
      deliveryOption,
      deliveryCharge,
    } = req.body;

    if (!products) {
      res.status(400);
      throw new Error("No products found");
    }

    // Check stock availablity
    for (const item of products) {
      const storedProduct = await Product.findById(item.product);
      if (storedProduct.quantityAvailableInKg < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${storedProduct.name}`);
      }
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
        farmerId,
        placedBy: { userType, userId },
        products,
        address,
        totalAmount: totalAmount + deliveryCharge,
        paymentMode,
        paymentStatus: true,
        deliveryOption,
        deliveryCharge,
      });

      if (req.userRole === "consumer")
        await Consumer.findByIdAndUpdate(userId, {
          cartData: {},
          cartFarmerId: null,
        });
      else
        await Retailer.findByIdAndUpdate(userId, {
          cartData: {},
          cartFarmerId: null,
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
        amount: (totalAmount + deliveryCharge) * 100,
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
      });

      //create order
      const order = await Order.create({
        farmerId,
        placedBy: { userType, userId },
        products,
        address,
        totalAmount: totalAmount + deliveryCharge,
        paymentMode,
        paymentId: razorpayOrder.id,
        cartFarmerId: null,
        deliveryOption,
        deliveryCharge,
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

const fetchAnOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate("products.product")
      .populate("farmerId");
    if (!order) {
      res.status(400);
      throw new Error("Order not found!");
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req;

  try {
    const orders = await Order.find({ "placedBy.userId": userId }).populate({
      path: "products.product",
      select: "name images category",
    });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const getFarmerOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.farmerId }).populate({
      path: "products.product",
      select: "name images category",
    });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, orderId } = req.body;

  try {
    if (!status) {
      res.status(400);
      throw new Error("Status not defined");
    }

    await Order.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ message: `Status changed to: ${status}` });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

//  cancel an order
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(400);
      throw new Error("Order not found");
    }

    if (order.status !== "Pending") {
      res.status(400);
      throw new Error("Order cannot be cancelled");
    }

    order.status = "Cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

export {
  createOrder,
  verifyPayment,
  getFarmerOrders,
  fetchAnOrder,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
};
