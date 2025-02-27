import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Farmer",
    },
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
    deliveryOption: { type: String, required: true },
    deliveryCharge: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    address: { type: Object, required: true },
    paymentMode: { type: String, required: true },
    paymentId: { type: String },
    paymentStatus: { type: Boolean, default: false },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
  },
  { timeStamp: true }
);

orderSchema.pre("save", function (next) {
  this.wasNew = this.isNew;
  next();
});

orderSchema.post("save", async function (doc, next) {
  try {
    if (doc.wasNew) {
      const Product = mongoose.model("Product");

      for (const item of doc.products) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { quantityAvailableInKg: -item.quantity } },
          { new: true }
        );
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
