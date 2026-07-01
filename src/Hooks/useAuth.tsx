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

  return {
    user: userData?.data ?? null,
    isAuthenticated,
    latitude,
    longitude,
    search,
    loading: loadingUserData,
    setAuthenticated: () => dispatch(setUser()),
    clearAuthorization: () => dispatch(removeUser()),
    setLatitude: (value: number) => dispatch(setLatitude(value)),
    setLongitude: (value: number) => dispatch(setLongitude(value)),
    setSearch: (value: string) => dispatch(setSearch(value)),
  };
};

export default useAuth;
