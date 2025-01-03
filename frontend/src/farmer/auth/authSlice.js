import { createSlice } from "@reduxjs/toolkit";
import {
  registerFarmer,
  loginFarmer,
  updateFarmerData,
  uploadProfilePhoto,
} from "./farmerActions";
import { addProduct } from "./productActions";

const initialState = {
  data: {},
  userToken: "",
  loading: false,
  success: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = {};
      state.token = "";
      localStorage.removeItem("token");
    },
    resetMessageState: (state) => {
      (state.success = null), (state.error = null);
    },
  },
  extraReducers: (builder) => {
    // register user
    builder.addCase(registerFarmer.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(registerFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userInfo = action.payload;
        state.userToken = action.payload.token;
        state.success = true;
      }),
      builder.addCase(registerFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // login user
    builder.addCase(loginFarmer.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(loginFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
        state.userToken = action.payload.token;
        state.success = true;
      }),
      builder.addCase(loginFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //update farmer-data
    builder.addCase(updateFarmerData.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(updateFarmerData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
        state.success = true;
      }),
      builder.addCase(updateFarmerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //profile-photo upload
    builder.addCase(uploadProfilePhoto.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
        state.success = true;
      }),
      builder.addCase(uploadProfilePhoto.rejected, (state, action) => {
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
        state.data = action.payload;
        state.success = true;
      }),
      builder.addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetMessageState } = authSlice.actions;
export default authSlice.reducer;
