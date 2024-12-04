import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  loginRetailer,
  registerRetailer,
} from "../controllers/retailerController";

const router = express.Router();

router.post("/register", registerRetailer);
router.post("/login", loginRetailer);

export default router;
