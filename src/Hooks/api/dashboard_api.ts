import toast from "react-hot-toast";
import useClientApi from "@/Hooks/useClientApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/Hooks/useAuth";
import { api } from "@/lib/api";

// Add Product
export const useAddProduct = () => {
  return useClientApi({
    method: "post",
    key: ["add-product"],
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
export const getallListings = (status?: string, short_by?: string) => {
  return useClientApi({
    method: "get",
    key: ["get-all-listings", status, short_by],
    params: { status, short_by },
    endpoint: "/api/products",
  });
};

// Fetch a single product/listing by ID
export const useGetSingleListing = (id: string | number) => {
  return useClientApi({
    method: "get",
    key: ["get-single-listing", id],
    endpoint: `/api/product/${id}`,
  });
};

// useRequestApproval
export const useRequestApproval = (id: string | number) => {
  return useClientApi({
    method: "get",
    key: ["request-approval"],
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
    endpoint: "/api/spotlight-applications",
  });
};

// Get All FollowLists
export const getAllFollowList = () => {
  return useClientApi({
    method: "get",
    key: ["get-all-followlist"],
    endpoint: "/api/my-favorites",
  });
};
// Get All FollowLists
export const getAllShoplist = () => {
  return useClientApi({
    method: "get",
    key: ["get-all-shoplist"],
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
    endpoint,
  });
};

// Get All Count
export const useTradeCounts = () => {
  return useClientApi({
    method: "get",
    key: ["get-count"],
    endpoint: "/api/trade-count",
  });
};

// Cancel trades hooks
export const useCancelTrade = () => {
  return useClientApi({
    method: "get",
    key: ["cancel-trade"],
  });
};

// Approve trades hooks
export const useApproveTrade = () => {
  return useMutation({
    mutationFn: (id: any) =>
      api.get(`/api/trade-offer-approve/${id}`).then(res => res.data),
  });
};

//  Cancel Hooks
export const useCancel = () => {
  return useMutation({
    mutationFn: (id: any) =>
      api.get(`/api/trade-offer-cancel/${id}`).then(res => res.data),
  });
};

//  single trade
export const useSingleTradeOffer = (id: any) => {
  return useClientApi({
    method: "get",
    key: ["single-trade-offer", id],
    endpoint: `/api/trade-offer/${id}`,
  });
};

// trade shop product
export const useTradeShopProduct = (id: any) => {
  return useClientApi({
    method: "get",
    key: ["trade-shop-product", id],
    endpoint: `/api/trade-shop-product/${id}`,
  });
};

// trade send counter product
export const useTradeSendProduct = (id: any) => {
  return useClientApi({
    method: "post",
    key: ["send-trade-counter-offer", id],
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

// Create Discount
export const useCreateDiscount = () => {
  return useClientApi({
    method: "post",
    key: ["create-discount"],
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
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["save-taxes"],
    endpoint: "/api/shop-taxes",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success("Tax rate saved successfully");
        queryClient.invalidateQueries("get-all-taxes" as any);
        queryClient.invalidateQueries("user" as any);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to Saving tax rate");
    },
  });
};

// Get Discount
export const getDiscount = (status: string) => {
  return useClientApi({
    method: "get",
    key: ["get-discount", status],
    params: { status },
    endpoint: "/api/discounts",
  });
};

// Create Flat Rate Hooks
export const useFlatRate = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["flat-rate"],
    endpoint: "/api/flat-rates",
    onSuccess: () => {
      queryClient.invalidateQueries("flat-rate" as any);
    },
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
    endpoint: "/api/weight_ranges",
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to create Weight rate",
      );
    },
  });
};

// Create Weight Rate delete Hooks
export const useWeightRateDelete = () => {
  return useClientApi({
    method: "delete",
    key: ["weight-rate-delete"],
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "Weight rate deleted successfully");
      }
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to delete weight rate",
      );
    },
  });
};

// Get Weight rate Hooks
export const useWeightRateget = () => {
  return useClientApi({
    method: "get",
    key: ["get-weight"],
    endpoint: "/api/weight_ranges",
  });
};

export const useTradeCounterProduct = (id: any) => {
  return useClientApi({
    method: "get",
    key: ["trade-counter-product", id],

    endpoint: `/api/trade-shop-product/${id}`,
  });
};

// Get Notifications  Hooks
export const useNotification = (page?: string) => {
  return useClientApi({
    method: "get",
    key: ["get-notifications", page],
    endpoint: "/api/notifications",
    params: { page },
  });
};

// Get Todays Notifications
export const useTodaysNotification = () => {
  return useClientApi({
    method: "get",
    key: ["get-todays-notifications"],
    endpoint: "/api/notifications/today",
  });
};

// Hook for getting single discount by ID
export const useDiscountGetById = (id?: string) => {
  return useClientApi({
    method: "get",
    key: ["discount-get-by-id", id],
    endpoint: `/api/discount/${id}`,
  });
};

// Hook for get membership
export const useMembershipget = () => {
  return useClientApi({
    method: "get",
    key: ["get-membership"],

    endpoint: "/api/subscriptions",
  });
};

// Hook for updating a discount
export const useDiscountUpdate = (id?: string) => {
  return useClientApi({
    method: "post",
    key: ["discount-update", id],
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

    endpoint: "/api/delete-discount-codes",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "Discount(s) deleted successfully");
      }
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to delete discount(s)",
      );
    },
  });
};

// Image Delete Discounts
export const useImageDelete = (id: any) => {
  return useClientApi({
    method: "delete",
    key: ["image-delete"],

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
export const getMyOrders = (status?: string) => {
  return useClientApi({
    method: "get",
    key: ["get-my-orders", status],

    endpoint: "/api/my-orders",
    params: { status },
  });
};

// Add Review
export const useAddReview = (order_id: number) => {
  return useClientApi({
    method: "post",
    key: ["add-review", order_id],

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

    key: ["get-customer-reviews", page],
    endpoint: "/api/my-reviews",
    params: { page },
  });
};

// Get Order Details
export const getMyOrderDetails = (order_id: number) => {
  return useClientApi({
    method: "get",

    key: ["get-order-details", order_id],
    endpoint: `/api/my-order/${order_id}`,
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

// Get Order History
export const getOrderHistory = (order_id: number | null) => {
  return useClientApi({
    method: "get",

    key: ["get-order-history", order_id],
    endpoint: `/api/my-order/${order_id}/history`,
  });
};

// Cancel Membership
export const useCancelMembership = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    key: ["cancel-membership"],

    endpoint: "/api/paypal/cancel-membership",
    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("get-pricing" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Get Orders
export const getOrders = ({
  status,
  search,
  page,
  filter,
  date_from,
  date_to,
  year,
}: {
  status?: string;
  search?: string;
  page?: string;
  filter?: string;
  date_from?: string;
  date_to?: string;
  year?: number;
}) => {
  return useClientApi({
    method: "get",
    key: ["get-orders", status, search, page, filter, date_from, date_to, year],

    endpoint: "/api/orders",
    params: {
      status,
      search,
      page,
      filter,
      date_from,
      date_to,
      year,
    },
  });
};

// Update Order Status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    key: ["update-order-status"],

    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("get-orders" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Get Single Order
export const getSingleOrder = (order_id: number | null) => {
  return useClientApi({
    method: "get",

    key: ["get-single-order", order_id],
    endpoint: `/api/order/${order_id}`,
  });
};

// Add Order Note
export const useOrderNote = (order_id: number) => {
  return useClientApi({
    method: "post",
    key: ["add-order-note", order_id],

    endpoint: `/api/order-note/${order_id}`,
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

// Account connect Onboarding
export const useOnboarding = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["onboarding"],

    endpoint: "/api/paypal/onboard",
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

// Account Disconnect
export const useDisconnectOnboarding = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["account-disconnect"],

    endpoint: "/api/paypal/disconnect",
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

// Account Reconnect
export const useReconnectOnboarding = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["account-reconnect"],

    endpoint: "/api/paypal/reconnect",
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

// Get Payments
export const getPayments = (status: string) => {
  return useClientApi({
    method: "get",
    key: ["get-payments", status],

    endpoint: "/api/payment-report",
    params: { status },
  });
};

// Dashboard Home Data
export const getDashboardHomeData = () => {
  return useClientApi({
    method: "get",
    key: ["dashboard-home-data"],

    endpoint: "/api/vendor/dashboard",
  });
};

// Visitor Data
export const getVisitorData = () => {
  return useClientApi({
    method: "get",
    key: ["visitor-data"],

    endpoint: "/api/vendor/dashboard/visits",
  });
};

// Order Data
export const getOrderData = () => {
  return useClientApi({
    method: "get",
    key: ["order-data"],

    endpoint: "/api/vendor/dashboard/order",
  });
};

// Listing Data
export const getListingData = () => {
  return useClientApi({
    method: "get",
    key: ["listing-data"],

    endpoint: "/api/vendor/dashboard/listings",
  });
};

// Trade Data
export const getTradesData = () => {
  return useClientApi({
    method: "get",
    key: ["trades-data"],

    endpoint: "/api/vendor/dashboard/trades",
  });
};

// Latest Products
export const getLatestProducts = () => {
  return useClientApi({
    method: "get",
    key: ["latest-products"],

    endpoint: "/api/latest-products",
  });
};

// Delete all notifications
export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "delete",
    key: ["delete-all-notifications"],

    endpoint: "/api/notifications/clear-all",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        queryClient.invalidateQueries("get-notifications" as any);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Get Accounting
export const getAccountingData = (params: any) => {
  return useClientApi({
    method: "get",
    key: ["get-accounting", params],

    endpoint: "/api/accounting/summary",
    params,
  });
};

// Get trade and barters
export const getTradeAndBarterData = (params: any) => {
  return useClientApi({
    method: "get",
    key: ["get-trade-and-barter", params],

    endpoint: "/api/barters-and-trades/summary",
    params,
  });
};

// Cancel Order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["cancel-order"],

    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("get-orders" as any);
        toast.success(data?.message);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Guest order
export const useGuestOrder = (id: number) => {
  return useClientApi({
    method: "post",
    key: ["guest-order", id],
    endpoint: `/api/guest-local-pickup/${id}`,
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

// Connect Shippo
export const useConnectShippo = () => {
  return useClientApi({
    method: "post",
    key: ["connect-shippo"],

    endpoint: "/api/shippo/connect",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        window.location.href = data?.data?.url;
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Disconnect Shippo
export const useDisconnectShippo = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["disconnect-shippo"],

    endpoint: "/api/shippo/disconnect",
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

// Add Sales Tax
export const useAddSalesTax = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["add-sales-tax"],

    endpoint: "/api/sales-tax",
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

// Get Sales Tax
export const getSalesTaxData = () => {
  return useClientApi({
    method: "get",
    key: ["get-sales-tax"],

    endpoint: "/api/sales-tax",
  });
};

// Sync Shippo
export const useSyncShippo = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["sync-shippo"],

    endpoint: `/api/shippo/sync-carriers-accounts/${user?.id}`,
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

// Pick Carrier
export const usePickCarrier = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["pick-carrier"],

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

// Change Label Type
export const useChangeLabelType = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["change-label-type"],

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

// Set shipping
export const useSetShipping = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["set-shipping"],

    endpoint: "/api/shipping-settings",
    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("user" as any);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Get flat rate
export const useGetFlatRate = () => {
  return useClientApi({
    method: "get",
    key: ["flat-rate"],

    endpoint: "/api/flat-rate",
  });
};

// Local pickup for pro
export const useLocalPickupPro = (id: number | null) => {
  return useClientApi({
    method: "post",
    key: ["pro-local-pickup", id],

    endpoint: `/api/local-pickup/orders/cart/${id}`,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Arrange Local pickup address
export const useArrangeLocalPickupAddress = (id: number) => {
  return useClientApi({
    method: "post",
    key: ["arrange-local-pickup-address", id],

    endpoint: `/api/order/${id}/local-pickup/arrange`,
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

// Local pickup payment
export const useLocalPickupPayment = (id: any) => {
  return useClientApi({
    method: "post",
    key: ["local-pickup-payment", id],

    endpoint: `/api/local-pickup/checkout/${id}`,
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

// Get All Taxes
export const getAllTaxes = () => {
  return useClientApi({
    method: "get",

    key: ["get-all-taxes"],
    endpoint: "/api/shop-taxes-list",
  });
};

// Apply Coupon
export const useApplyCoupon = () => {
  return useClientApi({
    method: "post",
    key: ["apply-coupon"],

    endpoint: `/api/apply-coupon`,
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

// Calculate Tax
export const useGetShippingTax = () => {
  return useClientApi({
    method: "post",
    key: ["shipping-data"],

    endpoint: "/api/cart/shipping/calculate",
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
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
