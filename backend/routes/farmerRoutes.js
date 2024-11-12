import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { farmerLogin, updateAddress } from "../controllers/farmerController.js";
import { farmerRegister } from "../controllers/farmerController.js";

const router = express.Router();

router.post("/register", farmerRegister);
router.post("/auth", farmerLogin);

router.post("/update-address", protect("farmer"), updateAddress);

export default router;
