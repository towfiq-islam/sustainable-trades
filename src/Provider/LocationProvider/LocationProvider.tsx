"use client";
import { useEffect, useRef } from "react";
import useAuth from "@/Hooks/useAuth";

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { latitude, longitude, setLatitude, setLongitude } = useAuth();
  const hasRequested = useRef(false);

  useEffect(() => {
    // If coordinates are already known or request was already initiated, skip
    if (hasRequested.current) return;
    if (latitude !== null && longitude !== null) return;

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    const requestPosition = () => {
      hasRequested.current = true;
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setLatitude(lat);
          setLongitude(lng);
        },
        error => {
          if (error.code !== error.PERMISSION_DENIED) {
            console.warn("Could not retrieve geolocation:", error.message);
          }
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
      );
    };

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then(permissionStatus => {
          if (permissionStatus.state === "granted" || permissionStatus.state === "prompt") {
            requestPosition();
          }
        })
        .catch(() => {
          requestPosition();
        });
    } else {
      requestPosition();
    }
  }, [latitude, longitude, setLatitude, setLongitude]);

  return <>{children}</>;
}
