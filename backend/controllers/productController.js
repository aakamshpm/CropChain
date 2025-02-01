import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import fs from "fs";
import decodeToken from "../utils/decodeToken.js";

// add products to sell
const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      pricePerKg,
      quantityAvailableInKg,
      category,
      harvestDate,
    } = req.body;

    if (
      (!name ||
        !description ||
        !pricePerKg ||
        !quantityAvailableInKg ||
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
      "name farmName"
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
      "name farmName"
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
    const products = await Product.find({ farmer });
    res.status(200).json({ data: products });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

//update an existing product
const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  try {
    let product = await Product.findById(productId);
    if (!product) {
      res.status(400);
      throw new Error("No product found!");
    }

    product = await Product.findByIdAndUpdate(
      { _id: productId, farmer: req.farmerId },
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Product updated", data: product });
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
    }).populate("farmer", "name farmName");
    res.status(200).json(products);
  } catch (err) {
    res.status(500);
    throw new Error("Failed to search products: " + err.message);
  }
});

export {
  addProduct,
  getAllProducts,
  getProductById,
  getProductsByFarmer,
  updateProduct,
  removeProduct,
  searchForProducts,
};
