import mongoose from "mongoose";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const retailerSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      set: (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        if (phoneNumber) {
          return phoneNumber.format("E.164");
        }
        return value.trim();
      },
    },

    password: { type: String, required: true },
    address: {
      houseName: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "India" },
      postalCode: { type: String },
    },

    // Shop Details
    shopAddress: {
      shopName: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "India" },
    },
    shopCategory: { type: String }, // eg. Grocery
    cartFarmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer" },
    cartData: { type: Object, default: {} },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Reference to the order placed by retailer
  },
  { timestamps: true }
);

const Retailer = mongoose.model("Retailer", retailerSchema);
export default Retailer;
