import { createSlice } from "@reduxjs/toolkit";
import { registerFarmer, loginFarmer } from "./authActions";

const initialState = {
  userInfo: {},
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
      state.userInfo = {};
      state.token = "";
      localStorage.removeItem("token");
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
        state.userInfo = action.payload;
        state.userToken = action.payload.token;
        state.success = true;
      }),
      builder.addCase(loginFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
