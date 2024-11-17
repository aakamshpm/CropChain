import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addFarm,
  addProduct,
  farmerLogin,
  removeProduct,
  updateAddress,
  updateProduct,
  updateProfilePicture,
} from "../controllers/farmerController.js";
import { farmerRegister } from "../controllers/farmerController.js";

const router = express.Router();

router.post("/register", farmerRegister);
router.post("/auth", farmerLogin);

router.post("/update-address", protect("farmer"), updateAddress);
router.post(
  "/upload-profile-picture",
  protect("farmer"),
  upload.single("profilePicture"),
  updateProfilePicture
);

router.post("/add-farm", protect("farmer"), addFarm);
router.post("/add-product", protect("farmer"), addProduct);
router.post("/update-product/:productId", protect("farmer"), updateProduct);
router.post("/remove-product/:productId", protect("farmer"), removeProduct);
export default router;
