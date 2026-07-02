import { apiSlice } from "@/redux/api/apiSlice";
import toast from "react-hot-toast";

export const shopApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // All Shops
    getAllShops: builder.query({
      query: ({ address, page }) => ({
        url: "/api/shops",
        params: { address, page },
      }),
      providesTags: ["shop"],
    }),

    // Featured Shops
    getFeaturedShops: builder.query({
      query: ({ lat, lng }) => ({
        url: "/api/shops/featured",
        params: { lat, lng },
      }),
      providesTags: ["shop"],
    }),

    // Shop Details
    getShopDetails: builder.query({
      query: id => `/api/shop/${id}`,
      providesTags: (_result, _error, id) => [{ type: "shop", id }],
    }),

    // Featured Listings of Shop
    getFeaturedListings: builder.query({
      query: id => `/api/shop/products/featured/${id}`,
      providesTags: (_result, _error, id) => [{ type: "shop", id }],
    }),

    // Shop Reviews
    getShopReviews: builder.query({
      query: ({ id, page }) => ({
        url: `/api/shop-review/${id}`,
        params: { page },
      }),
      providesTags: (_result, _error, { id }) => [{ type: "shop", id }],
    }),

    // Followed Shops
    getFollowedShops: builder.query({
      query: () => "/api/follow-shops",
      providesTags: ["shop"],
    }),

    // Apply Membership Spotlight
    applySpotlight: builder.mutation({
      query: body => ({
        url: "/api/spotlight-applications",
        method: "POST",
        body,
      }),
    }),

    // Get Membership Spotlight
    getMembershipSpotlight: builder.query({
      query: () => "/api/spotlight-applications",
      providesTags: ["shop"],
    }),

    // Membership Plans
    getMemberships: builder.query({
      query: ({ interval }) => ({
        method: "GET",
        url: "/api/subscriptions",
        params: { interval },
      }),
      providesTags: ["membership"],
    }),

    // Cancel Membership
    cancelMembership: builder.mutation({
      query: body => ({
        url: "/api/paypal/cancel-membership",
        method: "POST",
        body,
      }),

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
  }),
});

export const {
  useGetFollowedShopsQuery,
  useGetMembershipSpotlightQuery,
  useGetMembershipsQuery,
  useCancelMembershipMutation,
  useApplySpotlightMutation,
  useGetAllShopsQuery,
  useGetFeaturedShopsQuery,
  useGetShopDetailsQuery,
  useGetFeaturedListingsQuery,
  useGetShopReviewsQuery,
} = shopApi;
