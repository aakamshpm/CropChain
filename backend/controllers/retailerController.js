import asyncHandler from "express-async-handler";
import Retailer from "../models/Retailer.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const registerRetailer = asyncHandler(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      password,
      address,
      shopAddress,
      shopCategory,
    } = req.body;

    if (!firstName || !lastName || !phoneNumber || !password) {
      res.status(400);
      throw new Error("Please fill every field");
    }

    if (await Retailer.findOne({ phoneNumber })) {
      res.status(400);
      throw new Error("Retailer already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const retailer = await Retailer.create({
      firstName,
      lastName,
      phoneNumber,
      password: hashedPassword,
      address,
      shopAddress,
      shopCategory,
    });
    if (retailer) {
      generateToken(res, retailer._id, "retailer");
      res.status(200).json({ message: "Registered successfuly" });
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const loginRetailer = asyncHandler(async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      res.status(400);
      throw new Error("Enter required fields");
    }

    const retailer = await Retailer.findOne({ phoneNumber });
    if (retailer) {
      if (await bcrypt.compare(password, retailer.password)) {
        const token = generateToken(res, retailer._id, "retailer");
        res.status(200).json({ message: "Login success", token });
      } else {
        res.status(400);
        throw new Error("Invalid Password");
      }
    } else {
      res.status(400);
      throw new Error("No Retailer found");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const logoutRetailer = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    expires: new Date(0),
  });
  res.json({ message: "Logout successful" });
});

const getRetailerDetails = asyncHandler(async (req, res) => {
  try {
    const retailer = await Retailer.findById(req.retailerId).select(
      "-password"
    );

    if (!retailer) {
      res.status(400);
      throw new Error("Retailer not found");
    }

    res.status(200).json({ data: retailer });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const fetchAllRetailer = asyncHandler(async (req, res) => {
  try {
    const response = await Retailer.find().select("-password");
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// Update Retailer account details
const updateRetailerProfile = asyncHandler(async (req, res) => {});

export {
  registerRetailer,
  loginRetailer,
  logoutRetailer,
  getRetailerDetails,
  fetchAllRetailer,
  updateRetailerProfile,
};
