import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import retailerRoutes from "./routes/retailerRoutes.js";
import consumerRoutes from "./routes/consumerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

//DB connection
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

//middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/farmer", farmerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/retailer", retailerRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/order", orderRoutes);

app.use(notFound);
app.use(errorHandler);

//Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
