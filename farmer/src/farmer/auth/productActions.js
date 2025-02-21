import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const productURL = "http://localhost:8000/api/product";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// fetch all farmer products
const fetchAllProducts = createAsyncThunk(
  "product/fetch-all",
  async ({ farmerId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${productURL}/farmer?farmer=${farmerId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

// add a product
const addProduct = createAsyncThunk(
  "product/fetch-alladd-product",
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
  "product/fetch-allupdate-product",
  async (data, { rejectWithValue }) => {
    console.log(data);
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
// remove a product
const removeProduct = createAsyncThunk(
  "product/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${productURL}/remove/${productId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

// remove all products from farmer
const removeAllProductsFromFarmer = createAsyncThunk(
  "product/remove",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${productURL}/farmer/remove-all`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message);
    }
  }
);

export {
  fetchAllProducts,
  addProduct,
  updateProduct,
  removeProduct,
  removeAllProductsFromFarmer,
};
