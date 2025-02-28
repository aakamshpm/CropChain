import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addProduct,
  getAllProducts,
  getAverageRating,
  getProductById,
  getProductsByFarmer,
  rateProduct,
  removeAllProductsFromFarmer,
  removeProduct,
  searchForProducts,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/farmer", getProductsByFarmer);
router.get("/search", searchForProducts);
router.get("/:productId", getProductById);
router.post("/add", protect(["farmer"]), upload.array("images"), addProduct);
router.post(
  "/update/:productId",
  protect(["farmer"]),
  upload.array("images"),
  updateProduct
);
router.delete(
  "/farmer/remove-all",
  protect(["farmer"]),
  removeAllProductsFromFarmer
);
router.delete("/remove/:productId", protect(["farmer"]), removeProduct);

router.post("/rate-product", protect(["consumer", "retailer"]), rateProduct);
router.get("/average-rating", getAverageRating);

export default router;
