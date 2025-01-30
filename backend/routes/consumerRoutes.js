import express from "express";
import {
  getConsumerDetails,
  loginConsumer,
  logoutConsumer,
  registerConsumer,
} from "../controllers/consumerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerConsumer);
router.post("/login", loginConsumer);
router.post("/logout", logoutConsumer);

router.get("/", protect(["consumer"]), getConsumerDetails);

export default router;
