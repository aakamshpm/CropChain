import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../farmer/auth/authSlice";
import { authApi } from "../farmer/auth/authService";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  devTools: true,
});

export default store;