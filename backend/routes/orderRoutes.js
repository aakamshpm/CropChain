import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", protect(["consumer", "retailer"]), createOrder);

export default router;
