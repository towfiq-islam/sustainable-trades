import { apiSlice } from "@/redux/api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // All Products
    getAllProducts: builder.query({
      query: ({
        status,
        short_by,
      }: {
        status?: string;
        short_by?: string;
      }) => ({
        url: "/api/products",
        params: {
          status,
          short_by,
        },
      }),
      providesTags: ["product"],
    }),

    // All Products Under Shop
    getAllProductsUnderShop: builder.query({
      query: ({
        id,
        category_id,
        sub_category_id,
        short_by,
        search,
        page,
      }: {
        id: number;
        category_id?: string;
        sub_category_id?: string;
        short_by?: string;
        search?: string;
        page?: string;
      }) => ({
        url: `/api/shop/products/${id}`,
        params: {
          short_by,
          search,
          page,
          category_id,
          sub_category_id,
        },
      }),

      providesTags: ["product"],
    }),

    // Single Product
    getSingleProduct: builder.query({
      query: id => `/api/product/${id}`,
      providesTags: (_result, _error, id) => [{ type: "product", id }],
    }),

    // Add Product
    addProduct: builder.mutation({
      query: data => ({
        url: "/api/products-store",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["product"],
    }),

    // Update Product
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/product/update/${id}`,
        method: "POST",
        body: data,
        formData: true,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "product", id },
        "product",
      ],
    }),

    // Delete Product
    deleteProduct: builder.mutation({
      query: id => ({
        url: `/api/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),

    // Latest Products
    getLatestProducts: builder.query({
      query: () => "/api/latest-products",
      providesTags: ["product"],
    }),

    // Product Image Delete
    deleteProductImage: builder.mutation({
      query: id => ({
        url: `/api/image-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useGetAllProductsUnderShopQuery,
  useGetSingleProductQuery,
  useGetLatestProductsQuery,
  useGetAllProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductImageMutation,
} = productApi;
