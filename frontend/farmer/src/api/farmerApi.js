import { api } from "./constants.js";

const farmerLogin = async (credentials) => {
  const response = await api.post("/farmer/auth", credentials);
  return response.data;
};

const farmerRegister = async (credentials) => {
  const response = await api.post("farmer/register", credentials);
  return response.data;
};

const getFarmerDetails = async () => {
  const response = await api.post("farmer/");
  return response.data;
};

const updateAddress = async (data) => {
  const response = await api.post("farmer/update-address", data);
  return response.data;
};

const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await api.post("farmer/upload-profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const addFarm = async (data) => {
  const response = await api.post("farmer/add-farm", data);
  return response.data;
};

export {
  farmerLogin,
  farmerRegister,
  getFarmerDetails,
  uploadProfilePicture,
  updateAddress,
  addFarm,
};
