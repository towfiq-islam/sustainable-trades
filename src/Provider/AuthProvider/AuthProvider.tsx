"use client";
import { useGetUserData } from "@/Hooks/api/auth_api";
import { getItem, setItem, removeItem } from "@/lib/localStorage";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextValue {
  search: string;
  loading: boolean;
  user: any;
  setSearch: any;
  latitude: any;
  longitude: any;
  setAuthenticated: any;
  clearAuthorization: any;
  isAuthenticated: any;
  setLatitude: any;
  setLongitude: any;
}

export const AuthContextProvider = createContext<AuthContextValue | any>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState<string>("");

  const [isAuthenticated, setIsAuthenticated] = useState<string | undefined>(
    () => getItem("isAuthenticated"),
  );
  const [latitude, setLatitudeState] = useState<string | undefined>(() =>
    getItem("lat"),
  );
  const [longitude, setLongitudeState] = useState<string | undefined>(() =>
    getItem("lng"),
  );

  const setAuthenticated = (value: string) => {
    setItem("isAuthenticated", value);
    setIsAuthenticated(value);
  };

  const clearAuthorization = () => {
    removeItem("isAuthenticated");
    setIsAuthenticated(undefined);
  };

  const setLatitude = (value: string) => {
    setItem("lat", value);
    setLatitudeState(value);
  };

  const setLongitude = (value: string) => {
    setItem("lng", value);
    setLongitudeState(value);
  };

  const { data: userData, isLoading: loadingUserData } =
    useGetUserData(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
      setLoading(false);
      return;
    }

    if (loadingUserData) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    if (userData?.success) {
      setUser(userData?.data);
    } else {
      setUser(null);
    }
  }, [isAuthenticated, userData, loadingUserData]);

  // values to pass:
  const contextValue: AuthContextValue = {
    loading,
    user,
    search,
    latitude,
    setAuthenticated,
    clearAuthorization,
    isAuthenticated,
    longitude,
    setSearch,
    setLatitude,
    setLongitude,
  };

  return (
    <AuthContextProvider.Provider value={contextValue}>
      {children}
    </AuthContextProvider.Provider>
  );
}
