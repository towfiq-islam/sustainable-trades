import { apiSlice } from "@/redux/api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Vendor Products
    getProducts: builder.query({
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

    // All Products
    getAllProducts: builder.query({
      query: ({ search, lat, lng, page }) => ({
        url: "/api/all-products",
        params: {
          search,
          lat,
          lng,
          page,
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

    // Vendor Single Product
    getSingleProduct: builder.query({
      query: id => `/api/product/${id}`,
      providesTags: (_result, _error, id) => [{ type: "product", id }],
    }),

    // Product Details
    getProductDetails: builder.query({
      query: ({ id, lat, lng }) => ({
        url: `/api/product-details/${id}`,
        params: { lat, lng },
      }),
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

    // My Favorite
    getMyFavorite: builder.query({
      query: () => "/api/my-favorites",
      providesTags: ["favorite"],
    }),

    // Vendor Listings Count
    getVendorListings: builder.query({
      query: () => "/api/vendor/dashboard/listings",
      providesTags: ["product"],
    }),

    // Nearby Products
    getNearbyProducts: builder.query({
      query: ({ lat, lng, page }) => ({
        url: "/api/nearby-product",
        params: {
          lat,
          lng,
          page,
        },
      }),
      providesTags: ["product"],
    }),

    // Product Reviews
    getProductReviews: builder.query({
      query: ({ id, page }) => ({
        url: `/api/product-review/${id}`,
        params: {
          page,
        },
      }),
      providesTags: (_result, _error, { id }) => [{ type: "product", id }],
    }),

    // Product Image Delete
    deleteProductImage: builder.mutation({
      query: id => ({
        url: `/api/image-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),

    // Category Details
    getCategoryDetails: builder.query({
      query: ({ id, lat, lng, page }) => ({
        url: `/api/category/${id}`,
        params: {
          lat,
          lng,
          page,
        },
      }),
      providesTags: (_result, _error, { id }) => [{ type: "category", id }],
    }),

    // Add Favorite
    addFavorite: builder.mutation({
      query: productId => ({
        url: `/api/add-favorites/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["product", "favorite"],
    }),

    // Product Categories
    getProductCategories: builder.query({
      query: () => "/api/categories",
      providesTags: ["category"],
    }),

    // Product Sub Categories
    getProductSubCategories: builder.query({
      query: () => "/api/sub-categories",
      providesTags: ["category"],
    }),
  }),
});

export const {
  useGetAllProductsUnderShopQuery,
  useGetSingleProductQuery,
  useGetLatestProductsQuery,
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductImageMutation,
  useGetProductDetailsQuery,
  useGetAllProductsQuery,
  useGetNearbyProductsQuery,
  useGetProductReviewsQuery,
  useGetMyFavoriteQuery,
  useGetProductCategoriesQuery,
  useGetProductSubCategoriesQuery,
  useGetCategoryDetailsQuery,
  useAddFavoriteMutation,
  useGetVendorListingsQuery,
} = productApi;
