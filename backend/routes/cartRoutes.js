import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  getCartInfo,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect(["retailer", "consumer"]), getCartInfo);

router.post("/add", protect(["retailer", "consumer"]), addToCart);
router.post("/remove", protect(["retailer", "consumer"]), removeFromCart);

export default router;
