import { createSlice } from "@reduxjs/toolkit";
import { addProduct, fetchAllProducts, updateProduct } from "./productActions";

const initialState = {
  products: [],
  loading: false,
  success: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //fetch all products
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload;
        state.success = true;
      }),
      builder.addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //add-product
    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
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
        state.success = true;
      }),
      builder.addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
