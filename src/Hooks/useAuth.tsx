import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGetUserDataQuery } from "@/redux/api/authApi";
import {
  removeUser,
  setUser,
  setLatitude,
  setLongitude,
  setSearch,
} from "@/redux/slices/authSlice";
import { useAppSelector } from "@/redux/store";

const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, latitude, longitude, search } = useAppSelector(
    state => state.auth,
  );

  const { data: userData, isLoading: loadingUserData } = useGetUserDataQuery(
    undefined,
    { skip: !isAuthenticated },
  );

  const handleSetAuthenticated = useCallback(
    () => dispatch(setUser()),
    [dispatch],
  );

  const handleClearAuthorization = useCallback(
    () => dispatch(removeUser()),
    [dispatch],
  );

  const handleSetLatitude = useCallback(
    (value: number) => dispatch(setLatitude(value)),
    [dispatch],
  );

  const handleSetLongitude = useCallback(
    (value: number) => dispatch(setLongitude(value)),
    [dispatch],
  );

  const handleSetSearch = useCallback(
    (value: string) => dispatch(setSearch(value)),
    [dispatch],
  );

  const requireAuth = useCallback(
    (action?: () => void) => {
      if (!userData?.data) {
        toast.error("Please login first to proceed");
        const currentUrl =
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}`
            : pathname;
        router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
        return false;
      }
      action?.();
      return true;
    },
    [userData?.data, pathname, router],
  );

  return {
    user: isAuthenticated ? (userData?.data ?? null) : null,
    isAuthenticated,
    latitude,
    longitude,
    search,
    loading: loadingUserData,
    setAuthenticated: handleSetAuthenticated,
    clearAuthorization: handleClearAuthorization,
    setLatitude: handleSetLatitude,
    setLongitude: handleSetLongitude,
    setSearch: handleSetSearch,
    requireAuth,
  };
};

export default useAuth;
