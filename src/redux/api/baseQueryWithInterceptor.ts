import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { baseQuery } from "@/redux/api/baseQuery";
// import { removeUser } from "@/redux/features/auth/authSlice";

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

    // api.dispatch(removeUser());
  }

  return result;
};

export default baseQueryWithInterceptor;
