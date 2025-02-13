import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import fs from "fs";
import generateToken from "../utils/generateToken.js";
import Farmer from "../models/Farmer.js";
import Product from "../models/Product.js";
import Tesseract from "tesseract.js";

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

const parceOCR = (text) => {
  let name = null;
  let aadhaar = null;
  let land = null;

  // Match aadhaar with regex to extract aadhaar number only
  const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);

  if (aadhaarMatch) {
    aadhaar = aadhaarMatch[0].trim();
    if (aadhaar.length === 12 && !aadhaar.includes(" ")) {
      aadhaar = aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
    }
  }

  // Extract fiels "Name"
  const nameMatch = text.match(/Name:\s*(.*)/i);

  if (nameMatch) {
    name = nameMatch[1].split("\n")[0].trim();
  }

  // Extract land record
  if (text.includes("7/12")) {
    const landMatch = text.match(/(7\/12\s*Extract:\s*.*)/i);
    if (landMatch) {
      land = landMatch[1].trim();
    } else {
      land = "7/12 Extract found";
    }
  }

  return { aadhaar, name, land };
};

const computeConfidence = (data) => {
  let score = 0;

  if (data.aadhaar) score += 1;
  if (data.name) score += 1;
  if (data.land) score += 1;

  return score;
};

const matchFarmer = async (data, farmer, res) => {
  try {
    // check if aadhaar matches
    if (
      data.aadhaar &&
      data.aadhaar.replace(/\s+/g, "") === farmer?.aadhaarNumber
    ) {
      // compare registered name
      if (data.name && farmer.name === data.name) {
        return { match: true, farmer };
      } else {
        return { match: false, message: "Name does not match" };
      }
    } else {
      return { match: false, message: "Aadhaar does not match" };
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    throw new Error(err.message);
  }
};

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
  uploadDocumentsForVerification,
  fetchAppliedFarmers,
};
