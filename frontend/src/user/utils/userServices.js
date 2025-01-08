import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "api/products/",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetProductsQuery } = userApi;
