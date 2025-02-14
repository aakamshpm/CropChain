import { jwtDecode } from "jwt-decode";

const getFarmerIdFromToken = () => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      return decoded.userId;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export { getFarmerIdFromToken };
