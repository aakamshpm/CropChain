import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const protect = (role) => {
  return asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== role) {
          res.status(403);
          throw new Error("Invalid role");
        }
        if (role === "farmer") {
          req.farmerId = decoded.userId;
        } else if (role === "consumer") {
          req.consumerId = decoded.userId;
        } else if (role === "retailer") {
          req.retailerId = decoded.userId;
        }
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });
};

export { protect };
