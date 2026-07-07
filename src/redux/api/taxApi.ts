import { apiSlice } from "@/redux/api/apiSlice";

export const taxApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    saveTaxes: builder.mutation<any, any>({
      query: body => ({ url: "/api/shop-taxes", method: "POST", body }),
      invalidatesTags: ["tax", "user"],
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
    getGuestShippingTax: builder.mutation<any, any>({
      query: body => ({
        url: "/api/guest/shipping/calculate",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSaveTaxesMutation,
  useGetAllTaxesQuery,
  useGetSalesTaxDataQuery,
  useAddSalesTaxMutation,
  useGetShippingTaxMutation,
  useGetGuestShippingTaxMutation,
} = taxApi;
