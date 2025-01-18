import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice";
import cartReducer from "../utils/cartSlice";
import orderReducer from "../utils/orderSlice";
import { userApi } from "../utils/userServices";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
  devTools: true,
});

export default store;
