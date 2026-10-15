import { useCallback } from "react";
import { useDispatch } from "react-redux";
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

  return {
    user: userData?.data ?? null,
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
  };
};

export default useAuth;
