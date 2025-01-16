import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  decrementFromCart,
  getCartInfo,
  removeAllFromCart,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect(["retailer", "consumer"]), getCartInfo);

router.post("/add", protect(["retailer", "consumer"]), addToCart);
router.post("/decrement", protect(["retailer", "consumer"]), decrementFromCart);
router.post("/remove-item", protect(["retailer", "consumer"]), removeFromCart);
router.post(
  "/remove-all",
  protect(["retailer", "consumer"]),
  removeAllFromCart
);

export default router;
