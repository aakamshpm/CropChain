import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const productUrl = `${import.meta.env.VITE_API_SERVER_URL}/api/product`;

const initialState = {
  products: [],
  loading: false,
  success: null,
  error: null,
};

const searchProductsAsync = createAsyncThunk(
  "product/search",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${productUrl}/search`, {
        params: { search: searchTerm },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error searching items");
    }
  }
);

const fetchProductsByFarmer = createAsyncThunk(
  "products/fetchByFarmer",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${productUrl}/farmer?farmer=${farmerId}`
      );
      return response.data.data;
    } catch (error) {
      // Handle error response
      const errorMessage = error.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(searchProductsAsync.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
    builder
      .addCase(fetchProductsByFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export { searchProductsAsync, fetchProductsByFarmer };
export default productSlice.reducer;
