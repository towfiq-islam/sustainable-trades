import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useRouter } from "next/navigation";
import useClientApi from "@/Hooks/useClientApi";
import { useQueryClient } from "@tanstack/react-query";

// Create Shop
export const useCreateShop = () => {
  const { setAuthenticated } = useAuth();

  return useClientApi({
    method: "post",
    key: ["create-shop"],
    endpoint: "/api/shop/owners",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        setAuthenticated();
        toast.success(data?.message);
      }
    },
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

// Registration
export const useRegister = () => {
  const router = useRouter();
  return useClientApi({
    method: "post",
    key: ["register"],
    endpoint: "/api/users/register",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        router.push("/auth/login");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Reset Password
export const useResetPassword = () => {
  const router = useRouter();
  return useClientApi({
    method: "post",
    key: ["reset-password"],
    endpoint: "/api/users/login/reset-password",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        router.push("/auth/login");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Verify Email
export const useVerifyEmail = () => {
  const router = useRouter();
  return useClientApi({
    method: "post",
    key: ["verify-email"],
    endpoint: "/api/users/login/email-verify",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        router.push(`/auth/verify-otp/${data?.data?.email}`);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Verify OTP
export const useVerifyOTP = () => {
  const router = useRouter();
  return useClientApi({
    method: "post",
    key: ["verify-otp"],
    endpoint: "/api/users/login/otp-verify",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message);
        router.push(`/auth/reset-password/${data?.data?.email}`);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useClientApi({
    method: "post",
    key: ["update-user"],
    endpoint: "/api/users/data/update",

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
