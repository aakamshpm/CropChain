import mongoose from "mongoose";

const consumerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "India" },
      postalCode: { type: String },
    },

    orders: { type: mongoose.Schema.Types.ObjectId, ref: "Orders" },
  },
  { timestamps: true }
);

const Consumer = mongoose.model("Consumer", consumerSchema);
export default Consumer;
