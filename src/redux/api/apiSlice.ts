import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithInterceptor from "@/redux/api/baseQueryWithInterceptor";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,

  refetchOnFocus: true,
  refetchOnReconnect: true,

  tagTypes: ["demo1", "demo2"],

  endpoints: () => ({}),
});
