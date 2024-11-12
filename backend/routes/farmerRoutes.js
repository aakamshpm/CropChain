import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  farmerLogin,
  updateAddress,
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

export default router;
