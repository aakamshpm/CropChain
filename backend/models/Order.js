import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    placedBy: {
      type: {
        userType: {
          type: String,
          enum: ["Consumer", "Retailer"],
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "placedBy.userType",
        },
      },
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        pricePerKg: { type: Number, required: true }, // Price at the time of order
      },
    ],

    totalAmount: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
  },
  { timeStamp: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
