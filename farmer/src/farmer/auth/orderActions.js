import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const ordersUrl = "http://localhost:8000/api/order";

const changeOrderStatusAsync = createAsyncThunk(
  "order/update-status",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ordersUrl}/update-status`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

export { changeOrderStatusAsync };
