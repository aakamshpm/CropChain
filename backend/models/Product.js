import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  pricePerKg: { type: Number, required: true },
  quantityAvailableInKg: { type: String, required: true },
  category: { type: String, required: true },
  harvestDate: { type: Date },
  images: [{ type: String }],
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true,
  }, // Reference to Farmer
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
