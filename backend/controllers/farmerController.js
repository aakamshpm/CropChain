import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import Farmer from "../models/Farmer.js";

//register Farmer
const farmerRegister = asyncHandler(async (req, res) => {
  const { name, phoneNumber, password } = req.body;
  if ((!name, !phoneNumber, !password)) {
    res.status(400);
    throw new Error("Please fill every fields");
  }
  const farmerExists = await Farmer.findOne({ phoneNumber });
  if (farmerExists) {
    res.status(400);
    throw new Error("Account already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const farmer = await Farmer.create({
      name,
      phoneNumber,
      password: hashedPassword,
    });
    if (farmer) {
      generateToken(res, farmer._id, "farmer");
      res.status(200).json({
        message: "Farmer registration successful",
        data: {
          id: farmer._id,
          name: farmer.name,
          phoneNumber: farmer.phoneNumber,
        },
      });
    } else {
      res.status(400);
      throw new Error("Farmer registration faileed");
    }
  } catch (err) {
    res.status(500);
    throw new Error(`Error Occurred: ${err.message}`);
  }
});

//auth Farmer
const farmerLogin = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    res.status(400);
    throw new Error("Enter required fields");
  }

  const farmer = await Farmer.findOne({ phoneNumber });
  if (farmer) {
    if (await bcrypt.compare(password, farmer.password)) {
      generateToken(res, farmer._id, "farmer");
      res.status(200).json({
        message: "Farmer login successful",
        data: {
          id: farmer._id,
          name: farmer.name,
          phoneNumber: farmer.phoneNumber,
        },
      });
    } else {
      res.status(401);
      throw new Error("Invalid Password");
    }
  } else {
    res.status(401);
    throw new Error("Account not registered");
  }
});

// Add address fields
const updateAddress = asyncHandler(async (req, res) => {
  const { street, city, country, postalCode } = req.body;
  if ((!street, !city, !country, !postalCode)) {
    res.status(400);
    throw new Error("Enter all fields");
  }

  try {
    await Farmer.findByIdAndUpdate(req.farmerId, {
      address: { street, city, country, postalCode },
    });
    res.status(200).json({ message: "Address updated" });
  } catch (err) {
    res.status(400);
    throw new Error("Updating Address error occurred");
  }
});

export { farmerLogin, farmerRegister, updateAddress };
