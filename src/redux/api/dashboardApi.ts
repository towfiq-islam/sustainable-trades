import { apiSlice } from "@/redux/api/apiSlice";
import toast from "react-hot-toast";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Flat rate / weight rate
    createFlatRate: builder.mutation<any, any>({
      query: body => ({ url: "/api/flat-rates", method: "POST", body }),
      invalidatesTags: ["rate"],
    }),

    getFlatRate: builder.query<any, void>({
      query: () => "/api/flat-rate",
      providesTags: ["rate"],
    }),

    createWeightRate: builder.mutation<any, any>({
      query: body => ({ url: "/api/weight_ranges", method: "POST", body }),
      invalidatesTags: ["rate"],
    }),

    getWeightRates: builder.query<any, void>({
      query: () => "/api/weight_ranges",
      providesTags: ["rate"],
    }),

    deleteWeightRate: builder.mutation<any, string | number>({
      query: id => ({
        url: `/api/weight_range/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["rate"],
    }),

    // Notifications
    getNotifications: builder.query<any, string | undefined>({
      query: page => ({ url: "/api/notifications", params: { page } }),
      providesTags: ["notification"],
    }),

    getTodaysNotifications: builder.query<any, void>({
      query: () => "/api/notifications/today",
      providesTags: ["notification"],
    }),

    deleteAllNotifications: builder.mutation<any, void>({
      query: () => ({ url: "/api/notifications/clear-all", method: "DELETE" }),
      invalidatesTags: ["notification"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success) {
            toast.success(data.message);
          }
        } catch (err: any) {
          toast.error(err?.data?.message);
        }
      },
    }),

    // ---------------------------------------------------------------------
    // Payments / dashboard / accounting
    // ---------------------------------------------------------------------
    getPayments: builder.query<any, string>({
      query: status => ({ url: "/api/payment-report", params: { status } }),
    }),

    getDashboardHomeData: builder.query<any, void>({
      query: () => "/api/vendor/dashboard",
    }),

    getVisitorData: builder.query<any, void>({
      query: () => "/api/vendor/dashboard/visits",
    }),

    getAccountingData: builder.query<any, any>({
      query: params => ({ url: "/api/accounting/summary", params }),
    }),

    // ---------------------------------------------------------------------
    // PayPal onboarding
    // ---------------------------------------------------------------------
    onboardPaypal: builder.mutation<any, void>({
      query: () => ({ url: "/api/paypal/onboard", method: "POST" }),
      invalidatesTags: ["user"],
    }),

    disconnectPaypal: builder.mutation<any, void>({
      query: () => ({ url: "/api/paypal/disconnect", method: "POST" }),
      invalidatesTags: ["user"],
    }),

    reconnectPaypal: builder.mutation<any, void>({
      query: () => ({ url: "/api/paypal/reconnect", method: "POST" }),
      invalidatesTags: ["user"],
    }),

    // ---------------------------------------------------------------------
    // Shippo / shipping
    // ---------------------------------------------------------------------
    connectShippo: builder.mutation<any, void>({
      query: () => ({ url: "/api/shippo/connect", method: "POST" }),
      // Redirect side-effect lives in the component via onQueryStarted,
      // see usage note below — RTK Query endpoints shouldn't reach into
      // `window` directly inside `query`.
    }),

    disconnectShippo: builder.mutation({
      query: () => ({ url: "/api/shippo/disconnect", method: "POST" }),
      invalidatesTags: ["user"],
    }),

    syncShippo: builder.mutation({
      query: userId => ({
        url: `/api/shippo/sync-carriers-accounts/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),

    pickCarrier: builder.mutation({
      query: body => ({
        url: "/api/shippo/pick-carrier", // TODO: confirm real endpoint
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    changeLabelType: builder.mutation({
      query: body => ({
        url: "/api/shippo/label-type", // TODO: confirm real endpoint
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    setShipping: builder.mutation({
      query: body => ({
        url: "/api/shipping-settings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    localPickupPro: builder.mutation({
      query: id => ({
        url: `/api/local-pickup/orders/cart/${id}`,
        method: "POST",
      }),
    }),

    arrangeLocalPickupAddress: builder.mutation({
      query: id => ({
        url: `/api/order/${id}/local-pickup/arrange`,
        method: "POST",
      }),
    }),

    localPickupPayment: builder.mutation({
      query: id => ({
        url: `/api/local-pickup/checkout/${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateFlatRateMutation,
  useGetFlatRateQuery,
  useCreateWeightRateMutation,
  useGetWeightRatesQuery,
  useDeleteWeightRateMutation,

  useGetNotificationsQuery,
  useGetTodaysNotificationsQuery,
  useDeleteAllNotificationsMutation,

  useGetPaymentsQuery,
  useGetDashboardHomeDataQuery,
  useGetVisitorDataQuery,
  useGetAccountingDataQuery,

  useOnboardPaypalMutation,
  useDisconnectPaypalMutation,
  useReconnectPaypalMutation,

  useConnectShippoMutation,
  useDisconnectShippoMutation,
  useSyncShippoMutation,
  usePickCarrierMutation,
  useChangeLabelTypeMutation,
  useSetShippingMutation,
  useLocalPickupProMutation,
  useArrangeLocalPickupAddressMutation,
  useLocalPickupPaymentMutation,
} = dashboardApi;
