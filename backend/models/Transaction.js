import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
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
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
