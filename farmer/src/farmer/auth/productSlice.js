import { createSlice } from "@reduxjs/toolkit";
import { addProduct, updateProduct } from "./productActions";

const initialState = {
  product: null,
  loading: false,
  success: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //add-product
    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload;
        state.success = true;
      }),
      builder.addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //update product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload;
        state.success = true;
      }),
      builder.addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
