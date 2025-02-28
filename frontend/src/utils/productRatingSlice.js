import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const productUrl = "http://localhost:8000/api/product";

export const rateProduct = createAsyncThunk(
  "product/rateProduct",
  async ({ productId, userId, rating, comment }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `${productUrl}/rate-product`,
        { productId, userId, rating, comment },
        config
      );

      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getAverageRating = createAsyncThunk(
  "product/getAverageRating",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/${productUrl}/average-rating?productId=${productId}`
      );

      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const productRateSlice = createSlice({
  name: "productRate",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(rateProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(rateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(rateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const productAverageRatingSlice = createSlice({
  name: "productAverageRating",
  initialState: {
    averageRating: 0,
    totalRatings: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAverageRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAverageRating.fulfilled, (state, action) => {
        state.loading = false;
        state.averageRating = action.payload.averageRating;
        state.totalRatings = action.payload.totalRatings;
      })
      .addCase(getAverageRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const productRateReducer = productRateSlice.reducer;
export const productAverageRatingReducer = productAverageRatingSlice.reducer;
