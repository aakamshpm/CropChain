import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import fs from "fs";
import generateToken from "../utils/generateToken.js";
import Farmer from "../models/Farmer.js";
import Product from "../models/Product.js";
import Tesseract from "tesseract.js";
import { computeConfidence, matchFarmer, parceOCR } from "../utils/utils.js";

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

const updateFarmerProfile = asyncHandler(async (req, res) => {
  const {
    name,
    phoneNumber,
    aadhaarNumber,
    // Personal details
    buildingName,
    street,
    city,
    state,
    country,
    postalCode,
    // Address fields
    farmName,
    farmSizeInAcres,
    cropsGrown,
    latitude,
    longitude,
    // Farm details
  } = req.body;

  try {
    const updateData = {};

    // Update personal details if provided
    if (name || phoneNumber || aadhaarNumber) {
      updateData.name = name;
      updateData.phoneNumber = phoneNumber;
      updateData.aadhaarNumber = aadhaarNumber;
    }

    // Update address
    if (buildingName || street || city || state || country || postalCode) {
      updateData.address = {
        buildingName,
        street,
        city,
        state,
        country,
        postalCode,
      };
    }

    // Update farm details if provided
    if (farmName || farmSizeInAcres || cropsGrown || longitude || latitude) {
      updateData.farmName = farmName;

      updateData.farmSizeInAcres = farmSizeInAcres;
      updateData.cropsGrown = cropsGrown;

      updateData.farmLocation = {};
      updateData.farmLocation.longitude = longitude;
      updateData.farmLocation.latitude = latitude;
    }

    // Perform the update if there is any data to update
    if (Object.keys(updateData).length > 0) {
      await Farmer.findByIdAndUpdate(req.farmerId, updateData);
      res.status(200).json({ message: "Farmer profile updated successfully" });
    } else {
      res.status(400);
      throw new Error("No valid fields provided for update");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// Logout farmer
const farmerLogout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expiresIn: new Date(0) });
  res.json({ message: "Logout successfull" });
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
  const { farmerId } = req.query;
  try {
    const farmer = await Farmer.findById(farmerId).select("-password");
    res.status(200).json({ farmer });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const uploadDocumentsForVerification = asyncHandler(async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId).select("-password");

    if (farmer?.appliedForReview) {
      res.status(400);
      throw new Error("Already applied for verification");
    }

    const aadhaarFilePath = req?.files["aadhaar"]
      ? req?.files["aadhaar"][0].path
      : null;

    const landFilePath = req?.files["land"] ? req?.files["land"][0].path : null;

    if (!landFilePath && !aadhaarFilePath) {
      res.status(400);
      throw new Error("Both Aadhaar and land documents must be provided.");
    }

    const [aadhaarResult, landResult] = await Promise.all([
      Tesseract.recognize(aadhaarFilePath, "eng"),
      Tesseract.recognize(landFilePath, "eng"),
    ]);

    const combinedText = aadhaarResult.data.text + "\n" + landResult.data.text;

    // Extract neccessary fields
    const extractedData = parceOCR(combinedText);
    const confidenceScore = computeConfidence(extractedData);
    const matchResult = await matchFarmer(extractedData, farmer, res);

    farmer.extractedOCR = extractedData;
    farmer.confidenceScore = confidenceScore;
    farmer.statusMatch = matchResult.match;
    farmer.appliedForReview = true;

    if (confidenceScore < 2 || !matchResult.match) {
      farmer.verificationStatus = "rejected";
      // delete uploaded files
      fs.unlink(aadhaarFilePath, (err) => {
        if (err) console.error("Error deleting Aadhaar file:", err);
      });
      fs.unlink(landFilePath, (err) => {
        if (err) console.error("Error deleting Land file:", err);
      });
    } else {
      farmer.documents.aadhaarPath = aadhaarFilePath;
      farmer.documents.landPath = landFilePath;
      farmer.verificationStatus = "pending";
    }
    await farmer.save();

    res.json({
      extractedData,
      confidenceScore,
      match: matchResult,
      fullText: combinedText,
      verificationStatus: farmer.verificationStatus,
    });
  } catch (error) {
    console.error("OCR processing error:", error);
    res.status(500);
    throw new Error(error.message);
  }
});

// Fetch farmers applied for verification
const fetchAppliedFarmers = asyncHandler(async (req, res) => {
  try {
    const farmers = await Farmer.find({
      appliedForReview: true,
      verificationStatus: "pending",
    });
    res.status(200).json({ data: farmers });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// Add or Update a Rating
const addOrUpdateRating = async (req, res) => {
  const { farmerId } = req.params;
  const { userId, rating, comment } = req.body;

  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5.");
    }

    // Find the farmer
    const farmer = await Farmer.findById(farmerId).select("-password");
    if (!farmer) {
      res.status(404);
      throw new Error("Farmer not found");
    }

    // Check if the user has already rated the farmer
    const existingRatingIndex = farmer.ratings.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      farmer.ratings[existingRatingIndex].rating = rating;
      farmer.ratings[existingRatingIndex].comment = comment || "";
    } else {
      // Add new rating
      farmer.ratings.push({ userId, rating, comment });
    }

    // Calculate the average rating
    const totalRatings = farmer.ratings.length;
    const sumRatings = farmer.ratings.reduce((sum, r) => sum + r.rating, 0);
    farmer.averageRating = sumRatings / totalRatings;

    // Save the updated farmer
    await farmer.save();

    res.status(200).json({ message: "Rating submitted successfully.", farmer });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(error.message);
  }
};

// Get Farmer's Average Rating
const getAverageRating = async (req, res) => {
  const { farmerId } = req.params;

  try {
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      res.status(404);
      throw new Error("Farmer not found");
    }

    res.status(200).json({ averageRating: farmer.averageRating });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export {
  farmerLogin,
  farmerRegister,
  farmerLogout,
  updateFarmerProfile,
  updateProfilePicture,
  getFarmerDetails,
  getAllFarmer,
  getFarmerById,
  uploadDocumentsForVerification,
  fetchAppliedFarmers,
  addOrUpdateRating,
  getAverageRating,
};
