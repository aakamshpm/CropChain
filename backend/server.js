import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

dotenv.config();

//DB connection
connectDB();

const app = express();

app.use(cookieParser());

//middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
