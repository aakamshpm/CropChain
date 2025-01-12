import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice";
import cartReducer from "../utils/cartSlice";
import { userApi } from "../utils/userServices";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
  devTools: true,
});

export default store;
