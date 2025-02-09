import mongoose from "mongoose";

import { parsePhoneNumberFromString } from "libphonenumber-js";

const adminSchema = mongoose.Schema(
  {
    userName: { type: String, required: true },
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
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
