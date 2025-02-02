import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const retailerURL = "http://localhost:8000/api/retailer";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Register register
const retailerRegister = createAsyncThunk(
  "retailer/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${retailerURL}/register`, data, {
        ...config,
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "retailer");
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

// Login retailer
const retailerLogin = createAsyncThunk(
  "retailer/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${retailerURL}/login`, data, {
        ...config,
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "retailer");
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);
const retailerLogout = createAsyncThunk(
  "retailer/logout",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${retailerURL}/logout`,
        {}, // Empty body
        {
          withCredentials: true, // Ensure credentials are included
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

// get retailer data
const fetchRetailerData = createAsyncThunk(
  "retailer/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${retailerURL}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

export { retailerLogin, retailerRegister, retailerLogout, fetchRetailerData };
