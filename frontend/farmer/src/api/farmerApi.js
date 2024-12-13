import { api } from "./constants.js";

const farmerLogin = async (credentials) => {
  const response = await api.post("/farmer/auth", credentials);
  return response.data;
};

export { farmerLogin };
