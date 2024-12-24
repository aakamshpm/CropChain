import express from "express";
import {
  getConsumerDetails,
  loginConsumer,
  registerConsumer,
} from "../controllers/consumerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerConsumer);
router.post("/login", loginConsumer);

router.get("/", protect(["consumer"]), getConsumerDetails);

export default router;
