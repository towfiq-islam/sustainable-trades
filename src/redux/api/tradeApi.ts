import { apiSlice } from "@/redux/api/apiSlice";
import toast from "react-hot-toast";

export const tradeApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTrades: builder.query({
      query: sent =>
        sent ? `/api/trade-offers?sent=${sent}` : "/api/trade-offers",
      providesTags: ["trade"],
    }),

    getTradeCounts: builder.query({
      query: () => "/api/trade-count",
      providesTags: ["trade"],
    }),

    getTradeOffer: builder.query({
      query: id => `/api/trade-offer/${id}`,
      providesTags: (_r, _e, id) => [{ type: "trade", id }],
    }),

    getTradeShopProduct: builder.query({
      query: id => `/api/trade-shop-product/${id}`,
      providesTags: ["trade"],
    }),

    sendCounterOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/send-trade-counter-offer/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["trade"],

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          if (data?.success) {
            toast.success(data.message);
          }
        } catch (err: any) {
          toast.error(err?.data?.message);
        }
      },
    }),

    approveTrade: builder.mutation({
      query: id => ({
        url: `/api/trade-offer-approve/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["trade"],
    }),

    cancelTrade: builder.mutation({
      query: id => ({
        url: `/api/trade-offer-cancel/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["trade"],
    }),

    getTradeAndBarterData: builder.query({
      query: params => ({
        url: "/api/barters-and-trades/summary",
        method: "GET",
        params,
      }),
      providesTags: ["trade"],
    }),

    getTradesData: builder.query({
      query: () => ({
        url: "/api/vendor/dashboard/trades",
        method: "GET",
      }),
      providesTags: ["trade"],
    }),

    tradeSendOffer: builder.mutation({
      query: payload => ({
        url: "/api/trade-offer/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["trade"],
    }),
  }),
});

export const {
  useGetTradesQuery,
  useGetTradeCountsQuery,
  useGetTradeOfferQuery,
  useGetTradeShopProductQuery,
  useSendCounterOfferMutation,
  useApproveTradeMutation,
  useCancelTradeMutation,
  useGetTradeAndBarterDataQuery,
  useGetTradesDataQuery,
  useTradeSendOfferMutation,
} = tradeApi;
