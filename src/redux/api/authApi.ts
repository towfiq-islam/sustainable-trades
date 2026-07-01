import { apiSlice } from "@/redux/api/apiSlice";

import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
  VerifyEmailRequest,
  VerifyOtpRequest,
} from "@/Types/auth";

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUserData: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: "/api/users/data",
        method: "GET",
      }),

      providesTags: ["user"],
    }),

    login: builder.mutation<ApiResponse<User>, LoginRequest>({
      query: body => ({
        url: "/api/users/login",
        method: "POST",
        body,
      }),

      invalidatesTags: ["user"],
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/api/users/logout",
        method: "POST",
      }),

      invalidatesTags: ["user"],
    }),

    register: builder.mutation<ApiResponse<User>, RegisterRequest>({
      query: body => ({
        url: "/api/users/register",
        method: "POST",
        body,
      }),
    }),

    createShop: builder.mutation<ApiResponse<User>, FormData>({
      query: body => ({
        url: "/api/shop/owners",
        method: "POST",
        body,
      }),
    }),

    editShop: builder.mutation<ApiResponse<User>, FormData>({
      query: body => ({
        url: "/api/shop/owner-data-update",
        method: "POST",
        body,
      }),
    }),

    updateUser: builder.mutation<ApiResponse<User>, FormData>({
      query: body => ({
        url: "/api/users/data/update",
        method: "POST",
        body,
      }),

      invalidatesTags: ["user"],
    }),

    verifyEmail: builder.mutation<ApiResponse<null>, VerifyEmailRequest>({
      query: body => ({
        url: "/api/users/login/email-verify",
        method: "POST",
        body,
      }),
    }),

    verifyOTP: builder.mutation<ApiResponse<null>, VerifyOtpRequest>({
      query: body => ({
        url: "/api/users/login/otp-verify",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<ApiResponse<null>, ResetPasswordRequest>({
      query: body => ({
        url: "/api/users/login/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useCreateShopMutation,
  useEditShopMutation,
  useUpdateUserMutation,
  useVerifyEmailMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
} = authApi;
