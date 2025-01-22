import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getFarmerOrders,
  getUserOrders,
  updateOrderStatus,
  verifyPayment,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", protect(["farmer"]), getFarmerOrders);
router.get("/user-orders", protect(["consumer", "retailer"]), getUserOrders);

router.post("/create-order", protect(["consumer", "retailer"]), createOrder);
router.post(
  "/verify-payment",
  protect(["consumer", "retailer"]),
  verifyPayment
);
router.post("/update-status", protect(["farmer"]), updateOrderStatus);

export default router;
