import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const cartUrl = "http://localhost:8000/api/cart";

const initialState = {
  cartItems: {},
  loading: false,
  success: null,
  error: null,
  cartFarmerId: "",
  prevCartCount: null,
};

//Consumer cart
const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${cartUrl}/add`, data, {
        withCredentials: true,
      });
      return {
        productId: data.productId,
        cartFarmerId: data.cartFarmerId,
        response: response.data,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error adding item");
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
      return response.data;
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

// Retailer cart
const updateRetailerCart = createAsyncThunk(
  "cart/retailer",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axios.post(`${cartUrl}/update-retailer`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error updating quantity");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartData: (state) => {
      state.cartItems = {};
      state.cartFarmerId = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.cartItems[productId] = (state.cartItems[productId] || 0) + 1;
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        if (!state.cartFarmerId) {
          state.cartFarmerId = action.payload.cartFarmerId; // Only update if null
        }
        state.loading = false;
        state.success = true;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        if (state.cartItems[productId] !== undefined) {
          state.cartItems[productId] -= 1;
        }
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
        const { cartData, cartFarmerId } = action.payload;
        state.cartItems = cartData;
        state.cartFarmerId = cartFarmerId || null; // Ensure null if undefined
        state.loading = false;
        state.success = true;
      })
      .addCase(getCartDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(decrementCartItemAsync.pending, (state, action) => {
        const productId = action.meta.arg;
        if (state.cartItems[productId]) {
          state.cartItems[productId] -= 1;

          if (state.cartItems[productId] <= 0) {
            delete state.cartItems[productId];
            state.cartFarmerId = null;
          }
        }
        state.loading = true;
        state.error = false;
      })
      .addCase(decrementCartItemAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(decrementCartItemAsync.rejected, (state, action) => {
        const productId = action.meta.arg;
        if (state.cartItems[productId] !== undefined) {
          state.cartItems[productId] += 1; // Rollback if failed
        }
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        const { productId } = action.payload;
        if (state.cartItems[productId]) delete state.cartItems[productId];
        state.cartFarmerId = Object.keys(state.cartItems).length
          ? state.cartFarmerId
          : null; // Update cartFarmerId
        state.loading = false;
        state.success = true;
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      //Retailer cart
      .addCase(updateRetailerCart.pending, (state, action) => {
        const { productId, quantity } = action.meta.arg;
        state.prevCartCount = state.cartItems[productId];
        state.cartItems[productId] = quantity;
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRetailerCart.fulfilled, (state, action) => {
        const { cartFarmerId } = action.meta.arg;
        state.cartFarmerId = cartFarmerId;
        state.loading = false;
        state.success = true;
      })
      .addCase(updateRetailerCart.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.cartItems[productId] = state.prevCartCount;
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export {
  addToCartAsync,
  getCartDataAsync,
  decrementCartItemAsync,
  removeCartItemAsync,
  updateRetailerCart,
};
export const { clearCartData } = cartSlice.actions;
export default cartSlice.reducer;
