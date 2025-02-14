import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const protect = (allowedRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const roleToTokenMap = {
      admin: "adminJwt",
      consumer: "consumerJwt",
      retailer: "retailerJwt",
      farmer: "farmerJwt",
    };

    let token = null;
    for (const role of allowedRoles) {
      if (roleToTokenMap[role] && req.cookies[roleToTokenMap[role]]) {
        token = req.cookies[roleToTokenMap[role]];
        break;
      }
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user role is allowed
        if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
          res.status(403);
          throw new Error("Access denied: Invalid role");
        }

        req.userRole = decoded.role;
        req.userId = decoded.userId;

        if (decoded.role === "farmer") req.farmerId = decoded.userId;
        else if (decoded.role === "consumer") req.consumerId = decoded.userId;
        else if (decoded.role === "retailer") req.retailerId = decoded.userId;

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
