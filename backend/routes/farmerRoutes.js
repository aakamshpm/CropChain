import express from "express";
import { farmerLogin } from "../controllers/farmerController.js";

const router = express.Router();

router.post("/auth", farmerLogin);

export default router;
