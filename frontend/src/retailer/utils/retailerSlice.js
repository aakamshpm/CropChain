import { createSlice } from "@reduxjs/toolkit";
import { retailerLogin, retailerRegister } from "./RetailerActions";

const initialState = {
  response: {},
  retailerToken: "",
  loading: false,
  success: false,
  error: null,
};

const retailerSlice = createSlice({
  name: "retailer",
  initialState,
  reducers: {
    clearCredentials: (state) => {
      state.data = {};
      state.token = "";
      localStorage.removeItem("token");
    },
    resetMessageState: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // register retailer
    builder.addCase(retailerRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(retailerRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userInfo = action.payload;
        state.userToken = action.payload.token;
        state.success = true;
      }),
      builder.addCase(retailerRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // login retailer
    builder.addCase(retailerLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(retailerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
        state.userToken = action.payload.token;
        state.success = true;
      }),
      builder.addCase(retailerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCredentials, resetMessageState } = retailerSlice.actions;
export default retailerSlice.reducer;
