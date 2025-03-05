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
      totalAmount,
    } = req.body;

    if (!products || !totalAmount) {
      res.status(400);
      throw new Error("Missing required fields");
    }

    // Check stock availability
    for (const item of products) {
      const storedProduct = await Product.findById(item.product);
      if (storedProduct.quantityAvailableInKg < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${storedProduct.name}`);
      }
    }

    const userType = req.userRole === "retailer" ? "Retailer" : "Consumer";
    const userId = req.userId;

    // For retailers, validate retailer-specific pricing
    if (req.userRole === "retailer") {
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product.retailerPrice) {
          res.status(400);
          throw new Error(`Retailer pricing not available for ${product.name}`);
        }
      }
    }

    if (paymentMode === "cod") {
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

      // Clear cart based on user type
      const userModel = req.userRole === "retailer" ? Retailer : Consumer;
      await userModel.findByIdAndUpdate(userId, {
        cartData: {},
        cartFarmerId: null,
      });

      res.status(200).json({
        orderId: order._id,
        message: "Order placed",
      });
    } else {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "",
      });

      const razorpayOrder = await razorpay.orders.create({
        amount: (totalAmount + deliveryCharge) * 100,
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
      });

      const order = await Order.create({
        farmerId,
        placedBy: { userType, userId },
        products,
        address,
        totalAmount: totalAmount + deliveryCharge,
        paymentMode,
        paymentId: razorpayOrder.id,
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

//Fetch all orders
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("farmerId")
      .populate({
        path: "placedBy.userId",
        select: "-password -createdAt -updatedAt", // Exclude sensitive fields
      })
      .populate("products.product");

    if (!orders.length) {
      res.status(404);
      throw new Error("No orders found");
    }

    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message || "Failed to fetch orders");
  }
});

const getCropChainOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ deliveryOption: "cropChain" })
      .populate("farmerId")
      .populate({
        path: "placedBy.userId",
        select: "-password -createdAt -updatedAt", // Exclude sensitive fields
      })
      .populate("products.product");

    if (!orders?.length) {
      res.status(404);
      throw new Error("No CropChain delivery orders found");
    }

    res.status(200).json({
      count: orders.length,
      orders: orders.map((order) => ({
        ...order.toObject(),
        totalAmount: parseFloat(order.totalAmount),
      })),
    });
  } catch (err) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(err.message || "Failed to fetch CropChain orders");
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
  getAllOrders,
  getCropChainOrders,
};
