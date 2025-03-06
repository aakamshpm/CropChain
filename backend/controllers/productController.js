import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import fs from "fs";
import decodeToken from "../utils/decodeToken.js";
import mongoose from "mongoose";

// add products to sell
const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      pricePerKg,
      retailerPrice,
      quantityAvailableInKg,
      category,
      harvestDate,
    } = req.body;

    if (
      (!name ||
        !description ||
        !pricePerKg ||
        !quantityAvailableInKg ||
        !retailerPrice,
      !category,
      !harvestDate)
    ) {
      res.status(400);
      throw new Error("Please fill every fields");
    }

    if (!req.files) {
      res.status(400);
      throw new Error("Please upload product images");
    }

    const imagePaths = req.files.map((file) => file.filename);

    const newProduct = new Product({
      name,
      description,
      pricePerKg,
      retailerPrice,
      quantityAvailableInKg,
      category,
      harvestDate,
      farmer: req.farmerId,
      images: imagePaths,
    });
    await newProduct.save();
    res.status(200).json({ message: "Product added successfuly" });
  } catch (err) {
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) {
            res.status(500);
            throw new Error("Error deleting file");
          }
        });
      });
    }

    res.status(500);
    throw new Error(err.message);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    let userRole = null;

    const token = await decodeToken(req);
    if (token) {
      userRole = token.role;
    }

    const query =
      userRole === "retailer" ? { quantityAvailableInKg: { $gte: 100 } } : {};

    const products = await Product.find(query).populate(
      "farmer",
      "firstName lastName farmName verificationStatus address.city"
    );

    res
      .status(200)
      .json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Get product by Id
const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate(
      "farmer",
      "firstName lastName farmName verificationStatus address.city"
    );

    if (!product) {
      res.status(400);
      throw new Error("No product found");
    }

    res.status(200).json({ product });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// get product based on farmer
const getProductsByFarmer = asyncHandler(async (req, res) => {
  const { farmer } = req.query;
  try {
    const products = await Product.find({ farmer }).populate(
      "farmer",
      "firstName lastName farmName verificationStatus address.city"
    );
    res.status(200).json({ data: products });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

//update an existing product
const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { farmerId } = req;

  try {
    const product = await Product.findOne({ _id: productId, farmer: farmerId });
    if (!product) {
      res.status(400);
      throw new Error(
        "No product found or you are not authorized to update this product!"
      );
    }

    const {
      name,
      description,
      pricePerKg,
      retailerPrice,
      quantityAvailableInKg,
      category,
      harvestDate,
    } = req.body;

    // Update fields only if they are provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (pricePerKg) product.pricePerKg = pricePerKg;
    if (retailerPrice) product.retailerPrice = retailerPrice;
    if (quantityAvailableInKg)
      product.quantityAvailableInKg = quantityAvailableInKg;
    if (category) product.category = category;
    if (harvestDate) product.harvestDate = harvestDate;

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      // Delete existing images if needed
      if (product.images) {
        product.images.forEach((imagePath) => {
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) console.error(`Error deleting file: ${imagePath}`);
          });
        });
      }

      product.images = req.files.map((file) => file.filename);
    }

    // Save updated product to the database
    const updatedProduct = await product.save();
    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({
      _id: productId,
      farmer: req.farmerId,
    });
    if (!product) {
      res.status(400);
      throw new Error("No product found");
    }
    await Product.findOneAndDelete({
      _id: productId,
      farmer: req.farmerId,
    });
    res.status(200).json({ message: "Product removed", _id: productId });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// Remove all products-Farmer
const removeAllProductsFromFarmer = asyncHandler(async (req, res) => {
  try {
    const result = await Product.deleteMany({ farmer: req.farmerId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the given farmer" });
    }

    res.status(200).json({ message: "Products removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search products
const searchForProducts = asyncHandler(async (req, res) => {
  const { search } = req.query;

  if (!search) {
    res.status(400);
    throw new Error("Search query is required");
  }

  try {
    const products = await Product.find({
      $text: { $search: search },
    }).populate(
      "farmer",
      "firstName lastName farmName verificationStatus address.city"
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(500);
    throw new Error("Failed to search products: " + err.message);
  }
});

// Controller to rate a product
const rateProduct = asyncHandler(async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const { userId } = req;

    // Validate required fields
    if (!productId || !userId || !rating) {
      res.status(400);
      throw new Error("Product ID, User ID, and rating are required");
    }

    // Validate rating value
    if (rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check for existing rating
    const existingRatingIndex = product.ratings.findIndex((r) =>
      r.userId.equals(userObjectId)
    );

    if (existingRatingIndex >= 0) {
      // Update existing rating
      product.ratings[existingRatingIndex].rating = rating;
      if (comment !== undefined) {
        product.ratings[existingRatingIndex].comment = comment;
      }
    } else {
      // Add new rating
      product.ratings.push({
        userId: userObjectId,
        rating,
        comment: comment || "",
      });
    }

    // Calculate new average rating
    const totalRatings = product.ratings.length;
    const sumRatings = product.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    product.averageRating = sumRatings / totalRatings;

    // Save the updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      averageRating: product.averageRating,
      totalRatings: totalRatings,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Controller to get average rating
const getAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json({
      success: true,
      averageRating: product.averageRating,
      totalRatings: product.ratings.length,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export {
  addProduct,
  getAllProducts,
  getProductById,
  getProductsByFarmer,
  updateProduct,
  removeProduct,
  removeAllProductsFromFarmer,
  searchForProducts,
  rateProduct,
  getAverageRating,
};
