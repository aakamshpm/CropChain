import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const consumerURL = `${import.meta.env.VITE_API_SERVER_URL}/api/consumer`;

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Register consumer
const consumerRegister = createAsyncThunk(
  "consumer/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${consumerURL}/register`, data, {
        ...config,
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "consumer");
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

// Login consumer
const consumerLogin = createAsyncThunk(
  "consumer/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${consumerURL}/login`, data, {
        ...config,
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "consumer");
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

//logout consumer
const consumerLogout = createAsyncThunk(
  "consumer/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${consumerURL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

export { consumerLogin, consumerRegister, consumerLogout };
