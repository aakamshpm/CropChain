import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice";
import cartReducer from "../utils/cartSlice";
import orderReducer from "../utils/orderSlice";
import producReducer from "../utils/productSlice";
import farmerReducer from "../utils/farmerSlice";
import { productAverageRatingReducer } from "../utils/productRatingSlice";
import { userApi } from "../utils/userServices";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    product: producReducer,
    farmer: farmerReducer,
    productAverageRating: productAverageRatingReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
  devTools: true,
});

export default store;
