import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
  getProductsByFarmer,
  removeProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.get("/farmer", protect(["farmer"]), getProductsByFarmer);
router.post("/add", protect(["farmer"]), upload.array("images"), addProduct);
router.post("/update/:productId", protect(["farmer"]), updateProduct);
router.delete("/remove/:productId", protect(["farmer"]), removeProduct);

export default router;
