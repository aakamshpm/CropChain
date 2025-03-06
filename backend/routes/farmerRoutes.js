import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addOrUpdateRating,
  farmerLogin,
  farmerLogout,
  fetchAppliedFarmers,
  getAllFarmer,
  getAverageRating,
  getFarmerById,
  getFarmerDetails,
  updateProfilePicture,
  uploadDocumentsForVerification,
  farmerRegister,
  updateFarmerProfile,
  reapplyForVerification,
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

// Update farmer's profile (personal details, address, and farm details)
router.post("/update-profile", protect(["farmer"]), updateFarmerProfile);

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
// Apply for reverification
// ======================
router.put("/reapply", protect(["farmer"]), reapplyForVerification);

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
