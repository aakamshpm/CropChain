import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  loginRetailer,
  registerRetailer,
} from "../controllers/retailerController.js";

const router = express.Router();

router.post("/register", registerRetailer);
router.post("/login", loginRetailer);

export default router;
