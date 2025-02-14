import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  fetchAllRetailer,
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
router.get("/fetch-all", protect(["admin"]), fetchAllRetailer);

export default router;
