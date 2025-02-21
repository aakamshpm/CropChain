import express from "express";
import {
  getAllConsumers,
  getConsumerDetails,
  loginConsumer,
  logoutConsumer,
  registerConsumer,
  updateConsumerProfile,
} from "../controllers/consumerController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerConsumer);
router.post("/login", loginConsumer);
router.post("/logout", logoutConsumer);

router.get("/", protect(["consumer"]), getConsumerDetails);
router.get("/get-all", protect(["admin"]), getAllConsumers);

router.post(
  "/edit-profile",
  protect(["consumer"]),
  upload.single("profilePicture"),
  updateConsumerProfile
);

export default router;
