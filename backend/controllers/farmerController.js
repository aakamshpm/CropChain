import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import fs from "fs";
import generateToken from "../utils/generateToken.js";
import Farmer from "../models/Farmer.js";
import Product from "../models/Product.js";

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
      const token = generateToken(res, farmer._id, "farmer");
      res.status(200).json({
        message: "Farmer registration successful",
        data: {
          id: farmer._id,
          name: farmer.name,
          phoneNumber: farmer.phoneNumber,
          token,
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
      const token = generateToken(res, farmer._id, "farmer");
      res.status(200).json({
        message: "Farmer login successful",
        data: {
          id: farmer._id,
          name: farmer.name,
          phoneNumber: farmer.phoneNumber,
          token,
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

// Logout farmer
const farmerLogout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expiresIn: new Date(0) });
  res.json({ message: "Logout successfull" });
});

// Update personal details
const updatePD = asyncHandler(async (req, res) => {
  const { name, phoneNumber, bio } = req.body;

  try {
    await Farmer.findByIdAndUpdate(req.farmerId, { name, phoneNumber, bio });
    res.status(200).json({ message: "Personal data updated" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// Add address fields
const updateAddress = asyncHandler(async (req, res) => {
  const { buildingName, street, city, state, country, postalCode } = req.body;
  if ((!buildingName, !street, !city, !state, !country, !postalCode)) {
    res.status(400);
    throw new Error("Enter all fields");
  }

  try {
    await Farmer.findByIdAndUpdate(req.farmerId, {
      address: { buildingName, street, city, state, country, postalCode },
    });
    res.status(200).json({ message: "Address updated" });
  } catch (err) {
    res.status(400);
    throw new Error("Updating Address error occurred");
  }
});

// Add profile picture
const updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image uploaded");
  }

  const farmer = await Farmer.findById(req.farmerId);
  try {
    // update existing profile picture
    if (farmer.profilePicture) {
      fs.unlinkSync(`./uploads/profile-pictures/${farmer.profilePicture}`);
    }

    // add new profile picture
    farmer.profilePicture = req.file.filename;
    await farmer.save();

    res.status(200).json({
      message: "Profile picture updated successfuly",
      profilePicture: farmer.profilePicture,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

//add a farm
const addFarm = asyncHandler(async (req, res) => {
  const { farmName, farmLocation, farmSizeInAcres, cropsGrown } = req.body;

  try {
    await Farmer.findByIdAndUpdate(req.farmerId, {
      farmName,
      farmLocation: {
        latitude: farmLocation?.latitude,
        longitude: farmLocation?.longitude,
      },
      farmSizeInAcres,
      cropsGrown,
    });
    res.status(200).json({ message: "Farm details updated!" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// get farmer details
const getFarmerDetails = asyncHandler(async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId).select("-password");
    res.status(200).json({ data: farmer });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// get all farmer details (consumer/retailer side)
const getAllFarmer = asyncHandler(async (req, res) => {
  try {
    const farmers = await Farmer.find().select("-password");
    res.status(200).json({ farmers });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getFarmerById = asyncHandler(async (req, res) => {
  const farmerId = req.body;
  try {
    const farmer = await Farmer.findById(farmerId).select("-password");
    res.status(200).json({ farmer });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

export {
  farmerLogin,
  farmerRegister,
  farmerLogout,
  updatePD,
  updateAddress,
  updateProfilePicture,
  addFarm,
  getFarmerDetails,
  getAllFarmer,
  getFarmerById,
};
