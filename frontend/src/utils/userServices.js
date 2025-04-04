import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_SERVER_URL,
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "api/product/",
        method: "GET",
        credentials: "include",
      }),
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `api/product/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getUserOrders: builder.query({
      query: () => ({
        url: "api/order/user-orders",
        method: "GET",
        credentials: "include",
      }),
    }),

    getAllFarmers: builder.query({
      query: () => ({
        url: "api/farmer/get-all",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetUserOrdersQuery,
  useGetAllFarmersQuery,
} = userApi;
