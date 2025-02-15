import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addFarm,
  addOrUpdateRating,
  farmerLogin,
  farmerLogout,
  fetchAppliedFarmers,
  getAllFarmer,
  getAverageRating,
  getFarmerById,
  getFarmerDetails,
  updateAddress,
  updatePD,
  updateProfilePicture,
  uploadDocumentsForVerification,
  farmerRegister,
} from "../controllers/farmerController.js";

const router = express.Router();

// ======================
// Authentication Routes
// ======================
router.post("/register", farmerRegister); // Farmer registration
router.post("/auth", farmerLogin); // Farmer login
router.post("/logout", farmerLogout); // Farmer logout

// ======================
// Farmer Profile Routes
// ======================
router.get("/", protect(["farmer"]), getFarmerDetails); // Get logged-in farmer's details
router.get("/get-one", getFarmerById); // Get farmer by ID (public)
router.get("/get-all", getAllFarmer); // Get all farmers (public)

// Update farmer's personal details
router.post("/update-pd", protect(["farmer"]), updatePD);

// Update farmer's address
router.post("/update-address", protect(["farmer"]), updateAddress);

// Upload farmer's profile picture
router.post(
  "/upload-profile-picture",
  protect(["farmer"]),
  upload.single("profilePicture"),
  updateProfilePicture
);

// Upload documents for verification
router.post(
  "/upload-docs",
  protect(["farmer"]),
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "land", maxCount: 1 },
  ]),
  uploadDocumentsForVerification
);

// ======================
// Farm Management Routes
// ======================
router.post("/add-farm", protect(["farmer"]), addFarm); // Add a farm

// ======================
// Admin-Only Routes
// ======================
router.get("/fetch-applied-farmers", protect(["admin"]), fetchAppliedFarmers); // Fetch farmers who applied for verification

// ======================
// Rating System Routes
// ======================
router.post("/:farmerId/ratings", addOrUpdateRating); // Add or update a rating for a farmer
router.get("/:farmerId/ratings/average", getAverageRating); // Get average rating of a farmer

export default router;
