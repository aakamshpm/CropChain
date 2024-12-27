import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
      }),
    }),
  }),
});

export const { useGetFarmerDetailsQuery } = authApi;
