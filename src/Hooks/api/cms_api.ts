import toast from "react-hot-toast";
import useClientApi from "@/Hooks/useClientApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

// Download Invoice
export const useDownloadInvoice = () => {
  return useClientApi({
    method: "post",
    key: ["download-invoice"],

    axiosOptions: {
      responseType: "blob",
    },
  });
};

// Edit Shop
export const useEditShop = () => {
  return useClientApi({
    method: "post",
    key: ["edit-shop"],
    endpoint: "/api/shop/owner-data-update",

    headers: {
      "Content-Type": "multipart/form-data",
    },
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
