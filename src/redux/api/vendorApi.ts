import { apiSlice } from "@/redux/api/apiSlice";
import toast from "react-hot-toast";

export const vendorApi = apiSlice.injectEndpoints({
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

    // Payments / accounting
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

    // PayPal onboarding
    onboardPaypal: builder.mutation<any, any>({
      query: data => ({
        url: "/api/paypal/onboard",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    disconnectPaypal: builder.mutation<any, void>({
      query: () => ({ url: "/api/paypal/disconnect", method: "POST" }),
      invalidatesTags: ["user"],
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

    reconnectPaypal: builder.mutation<any, void>({
      query: () => ({ url: "/api/paypal/reconnect", method: "POST" }),
      invalidatesTags: ["user"],
    }),

    // Shippo / shipping
    connectShippo: builder.mutation<any, void>({
      query: () => ({ url: "/api/shippo/connect", method: "POST" }),
      invalidatesTags: ["user"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success) {
            window.location.href = data?.data?.url;
          }
        } catch (err: any) {
          toast.error(err?.data?.message);
        }
      },
    }),

    disconnectShippo: builder.mutation<any, void>({
      query: () => ({ url: "/api/shippo/disconnect", method: "POST" }),
      invalidatesTags: ["user"],
    }),

    syncShippo: builder.mutation({
      query: userId => ({
        url: `/api/shippo/sync-carriers-accounts/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["user"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success) {
            toast.success(data?.message);
          }
        } catch (err: any) {
          toast.error(err?.data?.message);
        }
      },
    }),

    pickCarrier: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/shippo/carrier/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    changeLabelType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/shippo/rate-preference/${id}`,
        method: "POST",
        body: data,
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
      query: ({ id, data }) => ({
        url: `/api/local-pickup/orders/cart/${id}`,
        method: "POST",
        body: data,
      }),
    }),

    localPickupPayment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/local-pickup/checkout/${id}`,
        method: "POST",
        body: data,
      }),
    }),

    addPickupLocation: builder.mutation({
      query: data => ({
        url: "/api/pickup-locations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pickup-locations"],
    }),

    editPickupLocation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/pickup-location/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pickup-locations"],
    }),

    deletePickupLocation: builder.mutation({
      query: id => ({
        url: `/api/pickup-location/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pickup-locations"],
    }),

    getPickupLocations: builder.query({
      query: () => "/api/pickup-locations",
      providesTags: ["pickup-locations"],
    }),

    getAllPickupLocations: builder.query({
      query: params => ({
        url: "/api/order-pickup-locations",
        params,
      }),
      providesTags: ["pickup-locations"],
    }),

    addDeliveryOrigin: builder.mutation({
      query: data => ({
        url: "/api/delivery-origins",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["delivery-origin"],
    }),

    getDeliveryOrigin: builder.query({
      query: () => "/api/delivery-origin",
      providesTags: ["delivery-origin"],
    }),

    addDeliveryRange: builder.mutation({
      query: data => ({
        url: "/api/delivery-ranges",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["delivery-range"],
    }),

    editDeliveryRange: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/delivery-range/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["delivery-range"],
    }),

    getDeliveryRanges: builder.query({
      query: () => "/api/delivery-ranges",
      providesTags: ["delivery-range"],
    }),

    deleteDeliveryRange: builder.mutation({
      query: id => ({
        url: `/api/delivery-range/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["delivery-range"],
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
  useLocalPickupPaymentMutation,

  useAddPickupLocationMutation,
  useGetPickupLocationsQuery,
  useDeletePickupLocationMutation,
  useEditPickupLocationMutation,
  useGetAllPickupLocationsQuery,

  useGetDeliveryOriginQuery,
  useAddDeliveryOriginMutation,
  useGetDeliveryRangesQuery,
  useDeleteDeliveryRangeMutation,
  useEditDeliveryRangeMutation,
  useAddDeliveryRangeMutation,
} = vendorApi;
