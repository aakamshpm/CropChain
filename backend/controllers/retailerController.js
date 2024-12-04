import asyncHandler from "express-async-handler";
import Retailer from "../models/Retailer.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const registerRetailer = asyncHandler(async (req, res) => {
  try {
    const { name, phoneNumber, password, address } = req.body;

    if (!name || !phoneNumber || !password) {
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
      name,
      phoneNumber,
      password: hashedPassword,
      address,
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
    const { mobileNumber, password } = req.body;
    if (!mobileNumber || !password) {
      res.status(400);
      throw new Error("Enter required fields");
    }

    const retailer = await Retailer.findOne({ mobileNumber });
    if (retailer) {
      if (await bcrypt.compare(password, retailer.password)) {
        generateToken(res, retailer._id, "farmer");
        res.status(200).json({ message: "Login success" });
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

export { registerRetailer, loginRetailer };