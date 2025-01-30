import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getRetailerDetails,
  loginRetailer,
  logoutRetailer,
  registerRetailer,
} from "../controllers/retailerController.js";

const router = express.Router();

router.post("/register", registerRetailer);
router.post("/login", loginRetailer);
router.post("/logout", logoutRetailer);

router.get("/", protect(["retailer"]), getRetailerDetails);

export default router;
