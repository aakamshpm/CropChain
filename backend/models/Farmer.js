import mongoose from "mongoose";

const farmerSchema = mongoose.Schema(
  {
    // Personal Details
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "India" },
      postalCode: { type: String },
    },
    profilePicture: { type: String, default: null },
    bio: { type: String, maxLength: 500 },

    // Farm Details
    farmName: { type: String },
    farmLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    farmSizeInAcres: { type: Number },
    cropsGrown: [{ type: String }],

    // Product Details
    products: [
      {
        name: { type: String },
        description: { type: String },
        pricePerKg: { type: Number },
        quantityAvailableInKg: { type: String },
        category: { type: String }, //unique categories to be implemented in frontend. TODO: add enum
        harvestDate: { type: Date },
        images: [{ type: String }],
      },
    ],

    // Transaction Details
    transactions: [
      {
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        productId: { type: mongoose.Schema.Types.ObjectId },
        quantitySold: { type: Number },
        totalAmount: { type: Number },
        status: {
          type: String,
          enum: ["Pending", "Completed", "Cancelled"],
          default: "Pending",
        },
        date: { type: Date, default: Date.now },
      },
    ],
  },

  { timestamps: true }
);

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
