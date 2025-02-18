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
      city: {
        type: String,
        enum: [
          "Alappuzha",
          "Ernakulam",
          "Idukki",
          "Kannur",
          "Kasaragod",
          "Kollam",
          "Kottayam",
          "Kozhikode",
          "Malappuram",
          "Palakkad",
          "Pathanamthitta",
          "Thiruvananthapuram",
          "Thrissur",
          "Wayanad",
        ],
      },
      state: { type: String, default: "Kerala" },
      country: { type: String, default: "India" },
      postalCode: { type: String },
    },
    profilePicture: { type: String, default: "" },
    aadhaarNumber: { type: String },

    // Farm Details
    farmName: { type: String },

    farmSizeInAcres: { type: Number },
    cropsGrown: [{ type: String }],

    farmLocation: {
      longitude: { type: String },
      latitude: { type: String },
    },

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

    // Rating System
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
