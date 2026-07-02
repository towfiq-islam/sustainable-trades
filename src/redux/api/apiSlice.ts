import { createApi } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { removeUser } from "@/redux/slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
  credentials: "include",
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  const status = result.error?.status;

  // Handle 401 interceptor
  if (status === 401) {
    console.log("Unauthenticated. Logging out...");
    api.dispatch(removeUser());
    api.dispatch(apiSlice.util.resetApiState()); // Wipe all cached queries
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,

  refetchOnFocus: true,
  refetchOnReconnect: true,

  tagTypes: [
    "user",
    "product",
    "conversation",
    "shop",
    "order",
    "notification",
    "membership",
    "review",
    "trade",
    "favorite",
    "category",
  ],

  endpoints: () => ({}),
});
