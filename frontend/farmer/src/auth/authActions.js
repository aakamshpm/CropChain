import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = "http://localhost:8000/api/farmer";

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
      const response = await axios.post(`${backendURL}/register`, data, config);
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
      const response = await axios.post(`${backendURL}/auth`, data, config);
      localStorage.setItem("token", response.data.data.token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export { registerFarmer, loginFarmer };
