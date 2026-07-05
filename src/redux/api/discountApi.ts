import { apiSlice } from "@/redux/api/apiSlice";

export const discountApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createDiscount: builder.mutation({
      query: body => ({ url: "/api/discounts", method: "POST", body }),
      invalidatesTags: ["discount"],
    }),

    getDiscounts: builder.query({
      query: status => ({ url: "/api/discounts", params: { status } }),
      providesTags: ["discount"],
    }),

    getDiscountById: builder.query({
      query: id => `/api/discount/${id}`,
      providesTags: (_result, _error, id) => [{ type: "discount", id }],
    }),

    updateDiscount: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/discount-update/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "discount",
        { type: "discount", id },
      ],
    }),

    changeDiscountStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/status-discount-codes/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["discount"],
    }),

    bulkDeleteDiscount: builder.mutation({
      query: body => ({
        url: "/api/delete-discount-codes",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["discount"],
    }),

    applyCoupon: builder.mutation({
      query: body => ({ url: "/api/apply-coupon", method: "POST", body }),
    }),
  }),
});

export const {
  useCreateDiscountMutation,
  useGetDiscountsQuery,
  useGetDiscountByIdQuery,
  useUpdateDiscountMutation,
  useChangeDiscountStatusMutation,
  useBulkDeleteDiscountMutation,
  useApplyCouponMutation,
} = discountApi;
