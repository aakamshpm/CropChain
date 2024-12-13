import mongoose from "mongoose";

const retailerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "India" },
      postalCode: { type: String },
    },

    // Shop Details

    //TODO:: add required in these fields
    shopAddress: {
      shopName: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "India" },
    },
    shopCategory: { type: String }, // eg. Grocery

    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Reference to the order placed by retailer
  },
  { timestamps: true }
);

const Retailer = mongoose.model("Retailer", retailerSchema);
export default Retailer;
