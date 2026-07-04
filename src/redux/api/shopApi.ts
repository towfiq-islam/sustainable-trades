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
      providesTags: ["spotlight"],
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

    // Update shop photo
    updateShopPhoto: builder.mutation({
      query: data => ({
        url: "/api/shop/image-update",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["shop"],

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

    // Update shop banner
    updateShopBanner: builder.mutation({
      query: data => ({
        url: "/api/shop/banner-update",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["shop"],

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

    // Follow Shop
    followShop: builder.mutation({
      query: shopId => ({
        url: `/api/follow-shop/${shopId}`,
        method: "POST",
      }),
      invalidatesTags: ["shop"],
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

    // Newsletter
    subscribeNewsletter: builder.mutation({
      query: data => ({
        url: "/api/newsletter/subscribe",
        method: "POST",
        body: data,
      }),

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

    // Get Tutorials
    getTutorials: builder.query({
      query: ({ search, type }) => ({
        url: "/api/tutorials",
        params: {
          search,
          type,
        },
      }),
      providesTags: ["tutorials"],
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
  useUpdateShopBannerMutation,
  useUpdateShopPhotoMutation,
  useFollowShopMutation,
  useGetTutorialsQuery,
  useSubscribeNewsletterMutation,
} = shopApi;
