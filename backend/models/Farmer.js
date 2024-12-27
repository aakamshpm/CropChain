import mongoose from "mongoose";

const farmerSchema = mongoose.Schema(
  {
    // Personal Details
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
    profilePicture: { type: String, default: "" },
    bio: { type: String, maxLength: 500 },

    // Farm Details
    farmName: { type: String },
    farmLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    farmSizeInAcres: { type: Number },
    cropsGrown: [{ type: String }],
  },

  { timestamps: true }
);

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
