import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const productUrl = "http://localhost:8000/api/product";

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
  },
});

export { searchProductsAsync };
export default productSlice.reducer;
