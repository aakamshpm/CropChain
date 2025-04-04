import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  fetchAllRetailer,
  getRetailerDetails,
  loginRetailer,
  logoutRetailer,
  registerRetailer,
  updateRetailerAddress,
  updateRetailerProfile,
} from "../controllers/retailerController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerRetailer);
router.post("/login", loginRetailer);
router.post("/logout", logoutRetailer);

router.get("/", protect(["retailer"]), getRetailerDetails);
router.get("/fetch-all", protect(["admin"]), fetchAllRetailer);

router.post(
  "/edit-profile",
  protect(["retailer"]),
  upload.single("profilePicture"),
  updateRetailerProfile
);
router.post("/edit-address", protect(["retailer"]), updateRetailerAddress);

export default router;
