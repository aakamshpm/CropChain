import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const orderUrl = "http://localhost:8000/api/order";

const initialState = {
  orderData: {},
  loading: false,
  success: null,
  error: null,
};

const placeOrderAsync = createAsyncThunk(
  "order/place-order",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${orderUrl}/create-order`, data, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderAsync.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(placeOrderAsync.fulfilled, (state, action) => {
        state.orderData = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(placeOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export { placeOrderAsync };
export default orderSlice.reducer;
