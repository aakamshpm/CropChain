import express from "express";
import {
  loginAdmin,
  registerAdmin,
  verifyFarmer,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.put("/verify-farmer/:farmerId", protect(["admin"]), verifyFarmer);

export default router;
