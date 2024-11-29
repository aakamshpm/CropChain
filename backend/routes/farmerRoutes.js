import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addFarm,
  farmerLogin,
  getFarmerDetails,
  updateAddress,
  updateProfilePicture,
} from "../controllers/farmerController.js";
import { farmerRegister } from "../controllers/farmerController.js";

const router = express.Router();

router.post("/register", farmerRegister);
router.post("/auth", farmerLogin);

router.get("/", protect("farmer"), getFarmerDetails);
router.post("/update-address", protect("farmer"), updateAddress);
router.post(
  "/upload-profile-picture",
  protect("farmer"),
  upload.single("profilePicture"),
  updateProfilePicture
);

router.post("/add-farm", protect("farmer"), addFarm);

export default router;
