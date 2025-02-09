import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import admin from "../config/firebase.js";
import generateToken from "../utils/generateToken.js";

const registerAdmin = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "register admin" });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    return res.status(400).json({ error: "Firebase token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phoneNumber = decodedToken.phone_number;

    const adminUser = await Admin.findOne({ phoneNumber });

    if (!adminUser) {
      res.status(500);
      throw new Error("Only registered admins can log in!");
    }

    const token = generateToken(res, adminUser._id, "admin");

    res.status(200).json({ message: "Logged in", token });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid Firebase token" });
  }
});

export { registerAdmin, loginAdmin };
