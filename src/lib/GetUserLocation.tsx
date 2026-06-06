"use client";
import useAuth from "@/Hooks/useAuth";
import { useEffect } from "react";

export default function GetUserLocation() {
  const { setLatitude, setLongitude } = useAuth();

  useEffect(() => {
    if ("geolocation" in navigator) {
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
        { enableHighAccuracy: true }
      );
    } else {
      
    }
  }, []);

  return null;
}
