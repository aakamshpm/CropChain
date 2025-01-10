import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice";
import { userApi } from "../utils/userServices";

const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
  devTools: true,
});

export default store;
