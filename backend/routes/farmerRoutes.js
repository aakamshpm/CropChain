import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addFarm,
  farmerLogin,
  farmerLogout,
  getAllFarmer,
  getFarmerById,
  getFarmerDetails,
  updateAddress,
  updatePD,
  updateProfilePicture,
  uploadDocumentsForVerification,
} from "../controllers/farmerController.js";
import { farmerRegister } from "../controllers/farmerController.js";

const router = express.Router();

router.post("/register", farmerRegister);
router.post("/auth", farmerLogin);
router.post("/logout", farmerLogout);

router.get("/", protect(["farmer"]), getFarmerDetails);
router.get("/get-one", getFarmerById);
router.get("/get-all", getAllFarmer);

router.post("/update-pd", protect(["farmer"]), updatePD);
router.post("/update-address", protect(["farmer"]), updateAddress);
router.post(
  "/upload-profile-picture",
  protect(["farmer"]),
  upload.single("profilePicture"),
  updateProfilePicture
);
router.post(
  "/upload-docs",
  protect(["farmer"]),
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "land", maxCount: 1 },
  ]),
  uploadDocumentsForVerification
);

router.post("/add-farm", protect(["farmer"]), addFarm);

export default router;
