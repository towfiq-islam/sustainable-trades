import { apiSlice } from "@/redux/api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ---------------------------------------------------------------------
    // Discounts
    // ---------------------------------------------------------------------
    createDiscount: builder.mutation<any, any>({
      query: body => ({ url: "/api/discounts", method: "POST", body }),
      invalidatesTags: ["discount"],
    }),

    getDiscounts: builder.query<any, string>({
      query: status => ({ url: "/api/discounts", params: { status } }),
      providesTags: ["discount"],
    }),

    getDiscountById: builder.query<any, string>({
      query: id => `/api/discount/${id}`,
      providesTags: (_result, _error, id) => [{ type: "discount", id }],
    }),

    updateDiscount: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/api/discount-update/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "discount",
        { type: "discount", id },
      ],
    }),

    changeDiscountStatus: builder.mutation<any, string | number>({
      query: id => ({
        url: `/api/status-discount-codes/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["discount"],
    }),

    bulkDeleteDiscount: builder.mutation<any, any>({
      query: body => ({
        url: "/api/delete-discount-codes",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["discount"],
    }),

    applyCoupon: builder.mutation<any, any>({
      query: body => ({ url: "/api/apply-coupon", method: "POST", body }),
    }),

    // ---------------------------------------------------------------------
    // Taxes
    // ---------------------------------------------------------------------
    saveTaxes: builder.mutation<any, any>({
      query: body => ({ url: "/api/shop-taxes", method: "POST", body }),
      invalidatesTags: ["tax"],
    }),

    getAllTaxes: builder.query<any, void>({
      query: () => "/api/shop-taxes-list",
      providesTags: ["tax"],
    }),

    getSalesTaxData: builder.query<any, void>({
      query: () => "/api/sales-tax",
      providesTags: ["tax"],
    }),

    addSalesTax: builder.mutation<any, any>({
      query: body => ({ url: "/api/sales-tax", method: "POST", body }),
      invalidatesTags: ["tax", "user"],
    }),

    getShippingTax: builder.mutation<any, any>({
      query: body => ({
        url: "/api/cart/shipping/calculate",
        method: "POST",
        body,
      }),
    }),

    // ---------------------------------------------------------------------
    // Flat rate / weight rate
    // ---------------------------------------------------------------------
    createFlatRate: builder.mutation<any, any>({
      query: body => ({ url: "/api/flat-rates", method: "POST", body }),
      invalidatesTags: ["user"],
    }),

    getFlatRate: builder.query<any, void>({
      query: () => "/api/flat-rate",
      providesTags: ["user"],
    }),

    createWeightRate: builder.mutation<any, any>({
      query: body => ({ url: "/api/weight_ranges", method: "POST", body }),
      invalidatesTags: ["rate"],
    }),

    getWeightRates: builder.query<any, void>({
      query: () => "/api/weight_ranges",
      providesTags: ["rate"],
    }),

    // ⚠️ Original hook never set an `endpoint`, so this DELETE call never hit
    // a real URL. Fill in the real path once you confirm it server-side —
    // likely something like `/api/weight_ranges/${id}`.
    deleteWeightRate: builder.mutation<any, string | number>({
      query: id => ({
        url: `/api/weight_ranges/${id}`, // TODO: confirm real endpoint
        method: "DELETE",
      }),
      invalidatesTags: ["rate"],
    }),

    // ---------------------------------------------------------------------
    // Notifications
    // ---------------------------------------------------------------------
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

    disconnectShippo: builder.mutation<any, void>({
      query: () => ({ url: "/api/shippo/disconnect", method: "POST" }),
      invalidatesTags: ["user"],
    }),

    syncShippo: builder.mutation<any, string | number>({
      query: userId => ({
        url: `/api/shippo/sync-carriers-accounts/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),

    // ⚠️ Same missing-endpoint issue as deleteWeightRate — the original
    // useClientApi call never had an `endpoint`, so confirm the real path.
    pickCarrier: builder.mutation<any, any>({
      query: body => ({
        url: "/api/shippo/pick-carrier", // TODO: confirm real endpoint
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    changeLabelType: builder.mutation<any, any>({
      query: body => ({
        url: "/api/shippo/label-type", // TODO: confirm real endpoint
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    setShipping: builder.mutation<any, any>({
      query: body => ({
        url: "/api/shipping-settings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    localPickupPro: builder.mutation<any, number | null>({
      query: id => ({
        url: `/api/local-pickup/orders/cart/${id}`,
        method: "POST",
      }),
    }),

    arrangeLocalPickupAddress: builder.mutation<any, number>({
      query: id => ({
        url: `/api/order/${id}/local-pickup/arrange`,
        method: "POST",
      }),
    }),

    localPickupPayment: builder.mutation<any, string | number>({
      query: id => ({
        url: `/api/local-pickup/checkout/${id}`,
        method: "POST",
      }),
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

  useSaveTaxesMutation,
  useGetAllTaxesQuery,
  useGetSalesTaxDataQuery,
  useAddSalesTaxMutation,
  useGetShippingTaxMutation,

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
