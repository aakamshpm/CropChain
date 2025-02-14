import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  pricePerKg: { type: Number, required: true },
  retailerPrice: { type: Number },
  quantityAvailableInKg: { type: Number, required: true },
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

productSchema.index({ name: "text", description: "text", category: "text" });
const Product = mongoose.model("Product", productSchema);
export default Product;
