import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const cartUrl = "http://localhost:8000/api/cart";

const initialState = {
  cartItems: {},
  loading: false,
  success: null,
  error: null,
};

const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${cartUrl}/add`,
        { productId },
        {
          withCredentials: true,
        }
      );
      return { productId, response: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error adding to cart");
    }
  }
);

const getCartDataAsync = createAsyncThunk(
  "cart/getCartData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${cartUrl}/`, {
        withCredentials: true,
      });
      return response.data.cartData;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching cart data");
    }
  }
);

const decrementCartItemAsync = createAsyncThunk(
  "cart/decrementCartItem",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${cartUrl}/decrement`,
        { productId },
        { withCredentials: true }
      );
      return { productId, response: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error removing item");
    }
  }
);

const removeCartItemAsync = createAsyncThunk(
  "cart/remove-cart-item",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${cartUrl}/remove-item`,
        { productId },
        { withCredentials: true }
      );
      return { productId, response: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error removing item");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartData: (state) => {
      state.cartItems = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const { productId } = action.payload;
        state.cartItems[productId] = (state.cartItems[productId] || 0) + 1;
        state.loading = false;
        state.success = true;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      .addCase(getCartDataAsync.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getCartDataAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(getCartDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      .addCase(decrementCartItemAsync.fulfilled, (state, action) => {
        const { productId } = action.payload;

        if (state.cartItems[productId]) {
          state.cartItems[productId] -= 1;

          if (state.cartItems[productId] <= 0) {
            delete state.cartItems[productId];
          }
        }

        state.loading = false;
        state.success = true;
      })
      .addCase(decrementCartItemAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        const { productId } = action.payload;

        if (state.cartItems[productId]) delete state.cartItems[productId];

        state.loading = false;
        state.success = true;
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export {
  addToCartAsync,
  getCartDataAsync,
  decrementCartItemAsync,
  removeCartItemAsync,
};
export const { clearCartData } = cartSlice.actions;
export default cartSlice.reducer;
