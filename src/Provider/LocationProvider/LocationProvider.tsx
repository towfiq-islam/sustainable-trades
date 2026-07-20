"use client";
import { useEffect } from "react";
import useAuth from "@/Hooks/useAuth";

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLatitude, setLongitude } = useAuth();

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);
      },
      error => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true },
    );
  }, [setLatitude, setLongitude]);

  return <>{children}</>;
}
