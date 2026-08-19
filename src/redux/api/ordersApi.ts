import { apiSlice } from "@/redux/api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getVendorOrders: builder.query({
      query: params => ({
        url: "/api/orders",
        params,
      }),
      providesTags: ["order"],
    }),

    getMyOrders: builder.query({
      query: ({ status, page }) => ({
        url: "/api/my-orders",
        params: { status, page, per_page: 10 },
      }),
      providesTags: ["order"],
    }),

    getSingleOrder: builder.query({
      query: id => `/api/order/${id}`,
      providesTags: (_r, _e, id) => [{ type: "order", id }],
    }),

    getOrderStatistics: builder.query({
      query: () => "/api/vendor/dashboard/order",
      providesTags: ["order"],
    }),

    getCustomerOrderHistory: builder.query({
      query: id => `/api/my-order/${id}/history`,
      providesTags: (_r, _e, id) => [{ type: "order", id }],
    }),

    getVendorOrderHistory: builder.query({
      query: id => `/api/vendor-order/${id}/history`,
      providesTags: (_r, _e, id) => [{ type: "order", id }],
    }),

    getOrderDetails: builder.query({
      query: id => `/api/my-order/${id}`,
      providesTags: (_r, _e, id) => [{ type: "order", id }],
    }),

    getCustomerReviews: builder.query({
      query: page => ({
        url: "/api/my-reviews",
        params: { page },
      }),
      providesTags: ["review"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/order-status-update/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "order", id }, "order"],
    }),

    cancelOrder: builder.mutation({
      query: id => ({
        url: `/api/cancel-order/${id}`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "order", id }, "order"],
    }),

    guestOrder: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/api/guest-local-pickup/${id}`,
        method: "POST",
        body: payload,
      }),
    }),

    addOrderNote: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/order-note/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "order", id }, "order"],
    }),

    addProductReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/add-review/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["review"],
    }),

    downloadVendorInvoice: builder.mutation<Blob, any>({
      query: orderId => ({
        url: `/api/vendor/orders/${orderId}/invoice/download`,
        method: "GET",
        responseHandler: response => response.blob(),
      }),
    }),

    downloadCustomerInvoice: builder.mutation<Blob, any>({
      query: orderId => ({
        url: `/api/orders/${orderId}/invoice/download`,
        method: "GET",
        responseHandler: response => response.blob(),
      }),
    }),

    basicVendorOrder: builder.mutation({
      query: data => ({
        url: "/api/basic-vendor-order",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetVendorOrdersQuery,
  useGetMyOrdersQuery,
  useGetSingleOrderQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useAddOrderNoteMutation,
  useGetCustomerReviewsQuery,
  useGetOrderStatisticsQuery,
  useGuestOrderMutation,
  useDownloadVendorInvoiceMutation,
  useDownloadCustomerInvoiceMutation,
  useAddProductReviewMutation,
  useBasicVendorOrderMutation,
  useGetCustomerOrderHistoryQuery,
  useGetVendorOrderHistoryQuery,
} = ordersApi;
