import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../farmer/auth/authSlice";
import productReducer from "../farmer/auth/productSlice";
import { authApi } from "../farmer/auth/authService";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  devTools: true,
});

export default store;
