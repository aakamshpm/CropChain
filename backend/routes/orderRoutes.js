import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", protect(["consumer", "retailer"]), createOrder);
router.post(
  "/verify-payment",
  protect(["consumer", "retailer"]),
  verifyPayment
);

export default router;
