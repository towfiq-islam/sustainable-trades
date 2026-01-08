import toast from "react-hot-toast";
import useClientApi from "@/Hooks/useClientApi";
import { useServerApi } from "@/Hooks/useServerApi";
import { useQueryClient } from "@tanstack/react-query";

// =======================================================
//  SSR (Server Side Rendering)
// =======================================================

// Membership Spotlight
export async function getSpotlightData() {
  return useServerApi({
    endpoint: "/api/spotlight-applications",
    ssr: true,
  });
}

// =======================================================
//  ISR (Incremental Static Regeneration)
// =======================================================

// Site Settings
export async function getSiteSettings() {
  return useServerApi({
    endpoint: "/api/site-settings",
    revalidate: 86400,
  });
}

// Get Social Links
export async function getSocialLinks() {
  return useServerApi({
    endpoint: "/api/social-links",
    revalidate: 86400,
  });
}

// Get Banner
export async function getBannerData() {
  return useServerApi({
    endpoint: "/api/banners",
    revalidate: 3600,
  });
}

// Get Contact
export async function getContactData() {
  return useServerApi({
    endpoint: "/api/contact",
    revalidate: 3600,
  });
}

// Get Terms
export async function getTermsData() {
  return useServerApi({
    endpoint: "/api/terms-and-conditions",
    revalidate: 3600,
  });
}

// Get Infringement
export async function getInfringementData() {
  return useServerApi({
    endpoint: "/api/infringement-report",
    revalidate: 3600,
  });
}

// How It Works
export async function getHowItWorksData() {
  return useServerApi({
    endpoint: "/api/how-it-works",
    revalidate: 3600,
  });
}

// Product Categories
export async function getProductCategories() {
  return useServerApi({
    endpoint: "/api/categories",
    ssr: true,
  });
}

// All Shops
export async function getAllShops() {
  return useServerApi({
    endpoint: "/api/shops",
    ssr: true,
  });
}

// Get Mission Data
export async function getMissionData() {
  return useServerApi({
    endpoint: "/api/our-mission",
    revalidate: 3600,
  });
}

// Dynamic Pages
export async function getDynamicPages() {
  return useServerApi({
    endpoint: "/api/dynamic-pages",
    revalidate: 3600,
  });
}

// Single Dynamic page
export async function getSingleDynamicPage(slug: string) {
  return useServerApi({
    endpoint: `/api/dynamic-pages/single/${slug}`,
    revalidate: 3600,
  });
}

// =======================================================
//  CSR (Client Side Rendering)
// =======================================================

// Get Pricing Data
export const getPricingData = (interval: string) => {
  return useClientApi({
    method: "get",
    key: ["get-pricing", interval],
    endpoint: "/api/subscriptions",
    params: { interval },
    queryOptions: {
      retry: false,
    },
  });
};

// NewsLetter
export const useNewsletter = () => {
  return useClientApi({
    method: "post",
    key: ["newsletter"],
    endpoint: "/api/newsletter/subscribe",
    onSuccess: (data: any) => {
      if (data?.message) {
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Featured Shops
export const getFeaturedShops = (lat: number, lng: number) => {
  return useClientApi({
    method: "get",
    key: ["get-featured-shops", lat, lat],
    endpoint: "/api/shops/featured",
    params: { lat, lng },
    queryOptions: {
      retry: false,
    },
  });
};

// Get Tutorials
export const getTutorials = (search: string, type: string) => {
  return useClientApi({
    method: "get",
    key: ["get-tutorials", search, type],
    endpoint: "/api/tutorials",
    params: { type, search },
    queryOptions: {
      retry: false,
    },
  });
};

// Get FAQ
export const getFAQ = () => {
  return useClientApi({
    method: "get",
    key: ["get-faq"],
    endpoint: "/api/faq/all",
  });
};

// Site Settings Client
export const getSiteSettingsClient = () => {
  return useClientApi({
    method: "get",
    key: ["get-site-settings"],
    endpoint: "/api/site-settings",
  });
};

// Product Categories Client
export const getProductCategoriesClient = () => {
  return useClientApi({
    method: "get",
    key: ["get-product-category"],
    endpoint: "/api/categories",
  });
};

// Product Sub Categories Client
export const getProductSubCategoriesClient = () => {
  return useClientApi({
    method: "get",
    key: ["get-product-sub-category"],
    endpoint: "/api/sub-categories",
  });
};

// Shop Details
export const getShopDetails = (id: number) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-shop-details", id],
    enabled: !!id,
    endpoint: `/api/shop/${id}`,
    queryOptions: {
      retry: false,
    },
  });
};

// Featured Listings
export const getFeaturedListings = (id: number) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-featured-listings", id],
    enabled: !!id,
    endpoint: `/api/shop/products/featured/${id}`,
    queryOptions: {
      retry: false,
    },
  });
};

// All Listings
export const getAllListings = (
  id: number,
  category_id?: string,
  sub_category_id?: string,
  short_by?: string,
  search?: string,
  page?: string
) => {
  return useClientApi({
    method: "get",
    key: [
      "get-all-listings",
      id,
      category_id,
      sub_category_id,
      short_by,
      search,
      page,
    ],
    enabled: !!id,
    endpoint: `/api/shop/products/${id}`,
    isPrivate: true,
    params: { category_id, sub_category_id, short_by, search, page },
    queryOptions: {
      retry: false,
    },
  });
};

// Follow Shop
export const useFollowShop = (shop_id: number) => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["follow-shop", shop_id],
    isPrivate: true,
    endpoint: `/api/follow-shop/${shop_id}`,
    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("get-shop-details" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Add Favorite
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["add-favorite"],
    isPrivate: true,
    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("get-all-listings" as any);
        queryClient.invalidateQueries("get-featured-listings" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Product Details
export const getProductDetails = (id: number, lat: number, lng: number) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-product-details", id, lat, lng],
    enabled: !!id,
    params: { lat, lng },
    endpoint: `/api/product-details/${id}`,
    queryOptions: {
      retry: false,
    },
  });
};

// Get Product Cart
export const getProductCart = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-product-cart"],
    endpoint: "/api/cart",
    queryOptions: {
      retry: false,
    },
  });
};

// Add To Cart
export const useAddToCart = (product_id: any) => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    key: ["add-to-cart"],
    isPrivate: true,
    endpoint: `/api/add-to-cart/${product_id}`,
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries("get-product-cart" as any);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Remove From Cart
export const useRemoveFromCart = (cart_Item_id: number | null) => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "delete",
    key: ["remove-from-cart"],
    isPrivate: true,
    endpoint: `/api/cart/item/remove/${cart_Item_id}`,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries("get-product-cart" as any);
      toast.success(data?.message);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Remove Cart
export const useRemoveCart = (cart_id: number | null) => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "delete",
    key: ["remove-cart"],
    isPrivate: true,
    endpoint: `/api/cart/remove/${cart_id}`,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries("get-product-cart" as any);
      toast.success(data?.message);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Clear Cart
export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "delete",
    key: ["clear-cart"],
    isPrivate: true,
    endpoint: "/api/cart/empty",
    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("get-product-cart" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Update Cart
export const useUpdateCart = (cart_id: number | null) => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    key: ["update-cart"],
    isPrivate: true,
    endpoint: `/api/cart/update/${cart_id}`,
    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("get-product-cart" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Update Shop Photo
export const useUpdateShopPhoto = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    key: ["update-shop-photo"],
    isPrivate: true,
    endpoint: "/api/shop/image-update",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("get-shop-details" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Update Shop Banner
export const useUpdateShopBanner = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    key: ["update-shop-banner"],
    isPrivate: true,
    endpoint: "/api/shop/banner-update",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onSuccess: (data: any) => {
      console.log(data);
      if (data?.success) {
        queryClient.invalidateQueries("get-shop-details" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Trade Shop Product
export const getTradeShopProducts = (id: number | null) => {
  return useClientApi({
    method: "get",
    key: ["get-trade-products", id],
    enabled: !!id,
    endpoint: `/api/trade-shop-product/${id}`,
    isPrivate: true,
    queryOptions: {
      retry: false,
    },
  });
};

// Trade Send Offer
export const useTradeSendOffer = () => {
  return useClientApi({
    method: "post",
    key: ["trade-send-offer"],
    isPrivate: true,
    endpoint: "/api/trade-offer/create",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Spotlight Application
export const useSpotlightApplication = () => {
  return useClientApi({
    method: "post",
    key: ["spotlight-application"],
    isPrivate: true,
    endpoint: "/api/spotlight-applications",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Membership Spotlight (Client)
export const getMembershipSpotlightClient = () => {
  return useClientApi({
    method: "get",
    key: ["get-membership-spotlight"],
    endpoint: "/api/spotlight-applications",
  });
};

// Category Details
export const getCategoryDetails = (
  id: number | null,
  lat: number,
  lng: number
) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-category-details", id, lat, lng],
    enabled: !!id,
    endpoint: `/api/category/${id}`,
    params: { lat, lng },
    queryOptions: {
      retry: false,
    },
  });
};

// All Shops (Client)
export const getAllShopsClient = (address: string) => {
  return useClientApi({
    method: "get",
    key: ["get-all-shop", address],
    endpoint: `/api/shops`,
    params: { address },
    queryOptions: {
      retry: false,
    },
  });
};

// Featured Products
export const getFeaturedProducts = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-featured-products"],
    endpoint: `/api/is-featured-product`,
    queryOptions: {
      retry: false,
    },
  });
};

// Nearby Products
export const getNearbyProducts = (lat: number, lng: number) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["nearby-products", lat, lng],
    endpoint: "/api/nearby-product",
    params: { lat, lng },
    queryOptions: {
      retry: false,
    },
  });
};

// Shop Reviews
export const getShopReviews = (id: number, page: string) => {
  return useClientApi({
    method: "get",
    key: ["shop-reviews", id, page],
    enabled: !!id,
    params: { page },
    endpoint: `/api/shop-review/${id}`,
    queryOptions: {
      retry: false,
    },
  });
};

// Product Reviews
export const getProductReviews = (id: number, page: string) => {
  return useClientApi({
    method: "get",
    key: ["product-reviews", id, page],
    enabled: !!id,
    params: { page },
    endpoint: `/api/product-review/${id}`,
    queryOptions: {
      retry: false,
    },
  });
};

// All Products
export const getAllProducts = (search: string, lat: number, lng: number) => {
  return useClientApi({
    method: "get",
    key: ["all-products", search, lat, lng],
    enabled: !!search,
    endpoint: "/api/all-products",
    params: { search, lat, lng },
    queryOptions: {
      retry: false,
    },
  });
};

// Checkout
export const useCheckout = (cart_id: number | null) => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    key: ["checkout", cart_id],
    isPrivate: true,
    endpoint: `/api/checkout/${cart_id}`,
    onSuccess: (data: any) => {
      if (data?.status || data?.success) {
        queryClient.invalidateQueries("get-product-cart" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};
