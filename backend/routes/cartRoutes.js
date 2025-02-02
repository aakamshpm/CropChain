import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  decrementFromCart,
  getCartInfo,
  removeAllFromCart,
  removeFromCart,
  updateRetailerCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect(["retailer", "consumer"]), getCartInfo);

router.post("/add", protect(["consumer"]), addToCart);
router.post("/decrement", protect(["consumer"]), decrementFromCart);
router.post("/remove-item", protect(["retailer", "consumer"]), removeFromCart);
router.post(
  "/remove-all",
  protect(["retailer", "consumer"]),
  removeAllFromCart
);

// Retailer cart
router.post("/update-retailer", protect(["retailer"]), updateRetailerCart);

export default router;
