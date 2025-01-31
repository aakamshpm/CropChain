import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  cancelOrder,
  createOrder,
  fetchAnOrder,
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
router.post("/update-status", protect(["farmer"]), updateOrderStatus);

router.put(
  "/cancel/:orderId",
  protect(["consumer", "retailer", "farmer"]),
  cancelOrder
);

export default router;
