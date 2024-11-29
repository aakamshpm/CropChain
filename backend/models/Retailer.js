import mongoose from "mongoose";

const retailerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "India" },
      postalCode: { type: String },
    },

    // Shop Details
    shopeAddress: {
      shopName: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, requierd: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    shopCategory: { type: String, required: true }, // eg. Grocery

    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Reference to the order placed by retailer
  },
  { timestamps: true }
);

const Retailer = mongoose.model("Retailer", retailerSchema);
export default Retailer;
