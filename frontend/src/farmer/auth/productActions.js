import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const productURL = "http://localhost:8000/api/product";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// add a product
const addProduct = createAsyncThunk(
  "auth/add-product",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${productURL}/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

// edit a product
const updateProduct = createAsyncThunk(
  "auth/update-product",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${productURL}/update/${data.get("id")}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

export { addProduct, updateProduct };
