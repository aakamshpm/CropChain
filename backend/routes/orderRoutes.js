import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  cancelOrder,
  createOrder,
  fetchAnOrder,
  getAllOrders,
  getCropChainOrders,
  getFarmerOrders,
  getUserOrders,
  updateOrderStatus,
  verifyPayment,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", protect(["farmer"]), getFarmerOrders);
router.get("/user-orders", protect(["consumer", "retailer"]), getUserOrders);
router.get("/fetch/:orderId", protect(["consumer", "retailer"]), fetchAnOrder);

router.post("/create-order", protect(["consumer", "retailer"]), createOrder);
router.post(
  "/verify-payment",
  protect(["consumer", "retailer"]),
  verifyPayment
);
router.post("/update-status", protect(["farmer", "admin"]), updateOrderStatus);

router.put(
  "/cancel/:orderId",
  protect(["consumer", "retailer", "farmer"]),
  cancelOrder
);

router.get("/all", protect(["admin"]), getAllOrders);
router.get("/cropchain-orders", protect(["admin"]), getCropChainOrders);

export default router;
