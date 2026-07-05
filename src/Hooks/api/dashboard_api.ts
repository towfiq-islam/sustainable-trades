import toast from "react-hot-toast";
import useClientApi from "@/Hooks/useClientApi";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "@/Hooks/useAuth";
import { useAppDispatch } from "@/redux/store";
import { authApi } from "@/redux/api/authApi";

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

// Get Accounting
export const getAccountingData = (params: any) => {
  return useClientApi({
    method: "get",
    key: ["get-accounting", params],

    endpoint: "/api/accounting/summary",
    params,
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
  const dispatch = useAppDispatch();

  return useClientApi({
    method: "post",
    key: ["disconnect-shippo"],

    endpoint: "/api/shippo/disconnect",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        dispatch(authApi.util.invalidateTags(["user"]));
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Sync Shippo
export const useSyncShippo = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  return useClientApi({
    method: "post",
    key: ["sync-shippo"],

    endpoint: `/api/shippo/sync-carriers-accounts/${user?.id}`,
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        dispatch(authApi.util.invalidateTags(["user"]));
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Pick Carrier
export const usePickCarrier = () => {
  const dispatch = useAppDispatch();

  return useClientApi({
    method: "post",
    key: ["pick-carrier"],

    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        dispatch(authApi.util.invalidateTags(["user"]));
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Change Label Type
export const useChangeLabelType = () => {
  const dispatch = useAppDispatch();

  return useClientApi({
    method: "post",
    key: ["change-label-type"],

    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        dispatch(authApi.util.invalidateTags(["user"]));
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Set shipping
export const useSetShipping = () => {
  const dispatch = useAppDispatch();

  return useClientApi({
    method: "post",
    key: ["set-shipping"],

    endpoint: "/api/shipping-settings",
    onSuccess: (data: any) => {
      if (data?.success) {
        dispatch(authApi.util.invalidateTags(["user"]));
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
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