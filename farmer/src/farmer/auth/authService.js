import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const endPoint = "api/farmer";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
  }),
  endpoints: (builder) => ({
    getFarmerDetails: builder.query({
      query: () => ({
        url: "api/farmer/",
        method: "GET",
        credentials: "include",
      }),
    }),

    getProductsByFarmer: builder.query({
      query: () => ({
        url: "api/product/farmer/get",
        method: "GET",
        credentials: "include",
      }),
    }),

    getAllOrders: builder.query({
      query: () => ({
        url: "api/order/",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetFarmerDetailsQuery,
  useGetProductsByFarmerQuery,
  useGetAllOrdersQuery,
} = authApi;
