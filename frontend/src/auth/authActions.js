import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const farmerURL = "http://localhost:8000/api/farmer";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Register farmer
const registerFarmer = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${farmerURL}/register`, data, {
        ...config,
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.data.token);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

// Login farmer
const loginFarmer = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${farmerURL}/auth`, data, {
        ...config,
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.data.token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

// Logout farmer
const logoutFarmer = createAsyncThunk(
  "auth/logout",
  async (data, { rejectWithValue }) => {
    try {
      await axios.post(`${farmerURL}/logout`, {
        ...config,
        withCredentials: true,
      });
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

export { registerFarmer, loginFarmer, logoutFarmer };
