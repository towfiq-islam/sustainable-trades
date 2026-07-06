import { apiSlice } from "@/redux/api/apiSlice";
import toast from "react-hot-toast";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProductCart: builder.query<any, void>({
      query: () => "/api/cart",
      providesTags: ["cart"],
    }),

    addToCart: builder.mutation<any, any>({
      query: ({ productId, data }) => ({
        url: `/api/add-to-cart/${productId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart", "user"],
    }),

    removeFromCart: builder.mutation<any, number | null>({
      query: cartItemId => ({
        url: `/api/cart/item/remove/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart", "user"],
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

    removeCart: builder.mutation<any, number | null>({
      query: cartId => ({
        url: `/api/cart/remove/${cartId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart", "user"],
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

    clearCart: builder.mutation<any, void>({
      query: () => ({ url: "/api/cart/empty", method: "DELETE" }),
      invalidatesTags: ["cart", "user"],
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

    updateCart: builder.mutation<any, { cartId: number | null; data: any }>({
      query: ({ cartId, data }) => ({
        url: `/api/cart/update/${cartId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart", "user"],
    }),
  }),
});

export const {
  useGetProductCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useRemoveCartMutation,
  useClearCartMutation,
  useUpdateCartMutation,
} = cartApi;
