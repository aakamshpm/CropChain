import mongoose from "mongoose";

const farmerSchema = mongoose.Schema(
  {
    // Personal Details
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      buildingName: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "India" },
      postalCode: { type: String },
    },
    profilePicture: { type: String, default: "" },
    aadhaarNumber: { type: String },

    // Farm Details
    farmName: { type: String },
    farmLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    farmSizeInAcres: { type: Number },
    cropsGrown: [{ type: String }],

    documents: {
      aadhaarPath: { type: String },
      landPath: { type: String },
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    extractedOCR: { type: Object },
    confidenceScore: { type: Number },
    statusMatch: { type: Boolean },
    appliedForReview: { type: Boolean, default: false },
    verifiedAt: { type: Date },
  },

  { timestamps: true }
);

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
