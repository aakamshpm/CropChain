import jwt from "jsonwebtoken";

const decodeToken = async (req) => {
  let token;
  if (req.cookies.jwt) token = req.cookies.jwt;
  else return null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      return null;
    }
  } else {
    return null;
  }
};

export default decodeToken;
