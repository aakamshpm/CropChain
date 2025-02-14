import express from "express";
import {
  getAllConsumers,
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
router.get("/get-all", protect(["admin"]), getAllConsumers);

export default router;
