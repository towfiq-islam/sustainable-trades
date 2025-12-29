import toast from "react-hot-toast";
import useClientApi from "@/Hooks/useClientApi";
import { useMutation } from "@tanstack/react-query";
import { axiosSecure } from "../useAxiosSecure";

// Add Product
export const useAddProduct = () => {
  return useClientApi({
    method: "post",
    key: ["add-product"],
    isPrivate: true,
    endpoint: `/api/products-store`,
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

// update product
export const useupdateProduct = (id: string | number) => {
  return useClientApi({
    method: "post",
    key: ["update-product"],
    isPrivate: true,
    endpoint: `/api/product/update/${id}`,
    onSuccess: (data: any) => {
      if (data?.success) toast.success(data.message);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};
// delete product
export const useDeleteProduct = (id: string | number) => {
  return useClientApi({
    method: "delete",
    key: ["delete-product", id],
    isPrivate: true,
    endpoint: `/api/product/delete/${id}`,
    onSuccess: (data: any) => {
      if (data?.success) toast.success(data.message);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Get All Listings
export const getallListings = () => {
  return useClientApi({
    method: "get",
    key: ["get-all-listings"],
    isPrivate: true,
    endpoint: "api/products?short_by=a-z",
  });
};

// Fetch a single product/listing by ID
export const useGetSingleListing = (id: string | number) => {
  return useClientApi({
    method: "get",
    key: ["get-single-listing", id],
    isPrivate: true,
    endpoint: `/api/product/${id}`,
  });
};

// useRequestApproval
export const useRequestApproval = (id: string | number) => {
  return useClientApi({
    method: "get",
    key: ["request-approval"],
    isPrivate: true,
    endpoint: `/api/product/request-approval/${id}`,
    onSuccess: (data: any) => {
      if (data?.success)
        toast.success(data.message || "Approval requested successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to request approval");
    },
  });
};

// Get All Spotlight
export const getmemberShipspotlight = () => {
  return useClientApi({
    method: "get",
    key: ["get-membership-spotlight"],
    isPrivate: true,
    endpoint: "/api/spotlight-applications",
  });
};

// Get All FollowLists
export const getAllFollowList = () => {
  return useClientApi({
    method: "get",
    key: ["get-all-followlist"],
    isPrivate: true,
    endpoint: "/api/my-favorites",
  });
};
// Get All FollowLists
export const getAllShoplist = () => {
  return useClientApi({
    method: "get",
    key: ["get-all-shoplist"],
    isPrivate: true,
    endpoint: "/api/follow-shops",
  });
};

// Get All trades
export const useTradesdata = (sent?: string) => {
  const endpoint = sent
    ? `/api/trade-offers?sent=${sent}`
    : `/api/trade-offers`;

  return useClientApi({
    method: "get",
    key: ["get-trades", sent],
    isPrivate: true,
    endpoint,
  });
};

// Get All Count
export const useTradeCounts = () => {
  return useClientApi({
    method: "get",
    key: ["get-count"],
    isPrivate: true,
    endpoint: "/api/trade-count",
  });
};

// Cancel trades hooks
export const useCancelTrade = () => {
  return useClientApi({
    method: "get",
    key: ["cancel-trade"],
    isPrivate: true,
  });
};

// Approve trades hooks
export const useApproveTrade = () => {
  return useMutation({
    mutationFn: (id: any) =>
      axiosSecure.get(`/api/trade-offer-approve/${id}`).then(res => res.data),
  });
};

//  Cancel Hooks
export const useCancel = () => {
  return useMutation({
    mutationFn: (id: any) =>
      axiosSecure.get(`/api/trade-offer-cancel/${id}`).then(res => res.data),
  });
};

//  single trade

export const useSingleTradeOffer = (id: any) => {
  return useClientApi({
    method: "get",
    key: ["single-trade-offer", id],
    isPrivate: true,
    endpoint: `/api/trade-offer/${id}`,
  });
};

// trade shop product
export const useTradeShopProduct = (id: any) => {
  return useClientApi({
    method: "get",
    key: ["trade-shop-product", id],
    isPrivate: true,
    endpoint: `/api/trade-shop-product/${id}`,
  });
};

// trade send counter product
export const useTradeSendProduct = (id: any) => {
  return useClientApi({
    method: "post",
    key: ["send-trade-counter-offer", id],
    isPrivate: true,
    endpoint: `/api/send-trade-counter-offer/${id}`,
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

// Delete Account API
export const useDeleteAccount = () => {
  return useClientApi({
    method: "delete",
    key: ["delete-account"],
    isPrivate: true,
    endpoint: "/api/users/delete",
    onSuccess: (data: any) => {
      if (data?.success)
        toast.success(data.message || "Account deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete account");
    },
  });
};

// Create Discount
export const useCreateDiscount = () => {
  return useClientApi({
    method: "post",
    key: ["create-discount"],
    isPrivate: true,
    endpoint: "/api/discounts",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "Discount created successfully!");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create discount.");
    },
  });
};

// Create Taxes Hooks
export const useTaxes = () => {
  return useClientApi({
    method: "post",
    key: ["save-taxes"],
    isPrivate: true,
    endpoint: "/api/shop-taxes",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "Saving tax rate");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to Saving tax rate");
    },
  });
};

// Getdiscount Hooks
export const useDiscountget = () => {
  return useClientApi({
    method: "get",
    key: ["get-discount"],
    isPrivate: true,
    endpoint: "/api/discounts",
  });
};

// Create Flat Rate Hooks
export const useFlatRate = () => {
  return useClientApi({
    method: "post",
    key: ["flat-rate"],
    isPrivate: true,
    endpoint: "/api/flat-rates",
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create flat rate");
    },
  });
};
// Create Weight Rate Hooks
export const useWeightRate = () => {
  return useClientApi({
    method: "post",
    key: ["weight-rate"],
    isPrivate: true,
    endpoint: "/api/weight_ranges",
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to create Weight rate"
      );
    },
  });
};

// Create Weight Rate delete Hooks
export const useWeightRateDelete = () => {
  return useClientApi({
    method: "delete",
    key: ["weight-rate-delete"],
    isPrivate: true,
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "Weight rate deleted successfully");
      }
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to delete weight rate"
      );
    },
  });
};

// Get Weight rate Hooks
export const useWeightRateget = () => {
  return useClientApi({
    method: "get",
    key: ["get-weight"],
    isPrivate: true,
    endpoint: "/api/weight_ranges",
  });
};

export const useTradeCounterProduct = (id: any) => {
  return useClientApi({
    method: "get",
    key: ["trade-counter-product", id],
    isPrivate: true,
    endpoint: `/api/trade-shop-product/${id}`,
  });
};

// Get Notifications  Hooks
export const useNotification = () => {
  return useClientApi({
    method: "get",
    key: ["get-notifications"],
    isPrivate: true,
    endpoint: "/api/notifications",
  });
};

// Hook for getting single discount by ID
export const useDiscountGetById = (id?: string) => {
  return useClientApi({
    method: "get",
    key: ["discount-get-by-id", id],
    isPrivate: true,
    endpoint: `/api/discount/${id}`,
  });
};

// Hook for get membership
export const useMembershipget = () => {
  return useClientApi({
    method: "get",
    key: ["get-membership"],
    isPrivate: true,
    endpoint: "/api/subscriptions",
  });
};

// Hook for updating a discount
export const useDiscountUpdate = (id?: string) => {
  return useClientApi({
    method: "post",
    key: ["discount-update", id],
    isPrivate: true,
    endpoint: `/api/discount-update/${id}`,
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "Discount updated successfully");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update discount");
    },
  });
};

export const useDiscountStatusChange = (id: any) => {
  return useClientApi({
    method: "post",
    key: ["discount-status-change"],
    isPrivate: true,
    endpoint: `/api/status-discount-codes/${id}`,
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "Discount status updated successfully");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });
};

// Bulk Delete Discounts
export const useBulkDeleteDiscount = () => {
  return useClientApi({
    method: "delete",
    key: ["bulk-delete-discount"],
    isPrivate: true,
    endpoint: "/api/delete-discount-codes",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "Discount(s) deleted successfully");
      }
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to delete discount(s)"
      );
    },
  });
};

// Image Delete Discounts
export const useImageDelete = (id: any) => {
  return useClientApi({
    method: "delete",
    key: ["image-delete"],
    isPrivate: true,
    endpoint: `/image-delete/${id}`,
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "image deleted successfully");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete image");
    },
  });
};

// Get My Orders
export const getMyOrders = (status: string) => {
  return useClientApi({
    method: "get",
    key: ["get-my-orders", status],
    isPrivate: true,
    endpoint: "/api/my-orders",
    params: { status },
    queryOptions: {
      retry: false,
    },
  });
};

// Add Review
export const useAddReview = (order_id: number) => {
  return useClientApi({
    method: "post",
    key: ["add-review", order_id],
    isPrivate: true,
    endpoint: `/api/add-review/${order_id}`,
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

// Get Customer Reviews
export const getCustomerReviews = (page?: string) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-customer-reviews", page],
    endpoint: "/api/my-reviews",
    params: { page },
    queryOptions: {
      retry: false,
    },
  });
};
