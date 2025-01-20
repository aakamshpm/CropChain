import mongoose from "mongoose";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const consumerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
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
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "India" },
      postalCode: { type: String },
    },
    cartFarmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer" },
    cartData: { type: Object, default: {} },
    orders: { type: mongoose.Schema.Types.ObjectId, ref: "Orders" },
  },
  { timestamps: true }
);

const Consumer = mongoose.model("Consumer", consumerSchema);
export default Consumer;
