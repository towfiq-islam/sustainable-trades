import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useRouter } from "next/navigation";
import useClientApi from "@/Hooks/useClientApi";

// Get User Data
export const useGetUserData = (token: any) => {
  return useClientApi({
    method: "get",
    key: ["user", token],
    enabled: !!token,
    endpoint: "/api/users/data",
    isPrivate: true,
    queryOptions: {
      refetchInterval: 1000 * 60 * 60,
    },
  });
};

// Create Shop
export const useCreateShop = () => {
  const { setToken } = useAuth();

  return useClientApi({
    method: "post",
    key: ["create-shop"],
    endpoint: "/api/shop/owners",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        setToken(data?.data?.token);
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
    isPrivate: true,
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

// Login
export const useLogin = () => {
  const router = useRouter();
  const { setToken } = useAuth();

  return useClientApi({
    method: "post",
    key: ["login"],
    endpoint: "/api/users/login",
    onSuccess: (data: any) => {
      if (
        data?.success &&
        (data?.data?.role === "customer" || data?.data?.membership)
      ) {
        setToken(data?.data?.token);
        toast.success(data?.message);
        router.push(
          `${
            data?.data?.role === "customer"
              ? "/dashboard/customer/orders"
              : data?.data?.role === "vendor" &&
                data?.data?.membership?.membership_type === "pro"
              ? "/dashboard/pro/home"
              : "/dashboard/basic/home"
          }`
        );
      } else {
        setToken(data?.data?.token);
        toast.error("Please choose a plan");
        router.push(`/auth/create-shop?step=${5}`);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Logout
export const useLogout = () => {
  const router = useRouter();
  const { clearToken } = useAuth();

  return useClientApi({
    method: "post",
    key: ["logout"],
    isPrivate: true,
    endpoint: "/api/users/logout",
    onSuccess: (data: any) => {
      if (data?.success) {
        clearToken();
        toast.success(data?.message);
        router.replace("/auth/login");
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
