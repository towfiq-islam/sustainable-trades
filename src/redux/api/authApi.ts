import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUserData: builder.query<any, void>({
      query: () => ({
        url: "/api/users/data",
        method: "GET",
      }),

      providesTags: ["user"],
    }),

    createShop: builder.mutation<any, FormData>({
      query: body => ({
        url: "/api/shop/owners",
        method: "POST",
        body,
      }),
    }),

    editShop: builder.mutation<any, FormData>({
      query: body => ({
        url: "/api/shop/owner-data-update",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<any, any>({
      query: body => ({
        url: "/api/users/register",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<any, any>({
      query: body => ({
        url: "/api/users/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/api/users/logout",
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),

    resetPassword: builder.mutation<any, any>({
      query: body => ({
        url: "/api/users/login/reset-password",
        method: "POST",
        body,
      }),
    }),

    verifyEmail: builder.mutation<any, any>({
      query: body => ({
        url: "/api/users/login/email-verify",
        method: "POST",
        body,
      }),
    }),

    verifyOTP: builder.mutation<any, any>({
      query: body => ({
        url: "/api/users/login/otp-verify",
        method: "POST",
        body,
      }),
    }),

    updateUser: builder.mutation<any, any>({
      query: body => ({
        url: "/api/users/data/update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useCreateShopMutation,
  useEditShopMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useVerifyOTPMutation,
  useUpdateUserMutation,
} = authApi;
