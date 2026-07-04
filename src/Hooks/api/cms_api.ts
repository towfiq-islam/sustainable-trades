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

// Blogs
export async function getBlogs() {
  return useServerApi({
    endpoint: "/api/blogs",
    revalidate: 3600,
  });
}

// Single Blog
export async function getSingleBlog(id: number) {
  return useServerApi({
    endpoint: `/api/blog/${id}`,
    revalidate: 3600,
  });
}

// Get FAQ
export const getFAQ = () => {
  return useServerApi({
    endpoint: "/api/faq/all",
    revalidate: 3600,
  });
};

// =======================================================
//  CSR (Client Side Rendering)
// =======================================================

// Get Product Cart
export const getProductCart = () => {
  return useClientApi({
    method: "get",
    key: ["get-product-cart"],
    endpoint: "/api/cart",
  });
};

// Add To Cart
export const useAddToCart = (product_id: any) => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    key: ["add-to-cart"],
    endpoint: `/api/add-to-cart/${product_id}`,
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries("user" as any);
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