import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// add products to sell
const addProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = new Product({ ...req.body, farmer: req.farmerId });
    await newProduct.save();
    res.status(200).json({ message: "Product added successfuly" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// get all products for consumer and retailers
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().populate("farmer", "name farmName");
    res
      .status(200)
      .json({ message: "Products fetched successfuly", data: products });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get product based on farmer
const getProductsByFarmer = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.farmerId });
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

export {
  addProduct,
  getAllProducts,
  getProductsByFarmer,
  updateProduct,
  removeProduct,
};
