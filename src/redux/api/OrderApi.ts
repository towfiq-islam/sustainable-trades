import { apiSlice } from "@/redux/api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query({
      query: params => ({
        url: "/api/orders",
        params,
      }),
      providesTags: ["order"],
    }),

    getMyOrders: builder.query({
      query: status => ({
        url: "/api/my-orders",
        params: { status },
      }),
      providesTags: ["order"],
    }),

    getSingleOrder: builder.query({
      query: id => `/api/order/${id}`,
      providesTags: (_r, _e, id) => [{ type: "order", id }],
    }),

    getOrderHistory: builder.query({
      query: id => `/api/my-order/${id}/history`,
      providesTags: (_r, _e, id) => [{ type: "order", id }],
    }),

    getOrderDetails: builder.query({
      query: id => `/api/my-order/${id}`,
      providesTags: (_r, _e, id) => [{ type: "order", id }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/order/${id}/status`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "order", id }, "order"],
    }),

    cancelOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/order/${id}/cancel`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "order", id }, "order"],
    }),

    addOrderNote: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/order-note/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "order", id }, "order"],
    }),

    addReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/add-review/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["order", "review"],
    }),

    getCustomerReviews: builder.query({
      query: page => ({
        url: "/api/my-reviews",
        params: { page },
      }),
      providesTags: ["review"],
    }),

    // Checkout
    checkout: builder.mutation({
      query: cartId => ({
        url: `/api/checkout/${cartId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useGetSingleOrderQuery,
  useGetOrderHistoryQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useAddOrderNoteMutation,
  useAddReviewMutation,
  useGetCustomerReviewsQuery,
  useCheckoutMutation,
} = orderApi;
