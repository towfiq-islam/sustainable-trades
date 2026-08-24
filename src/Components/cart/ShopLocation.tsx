"use client";
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
};

interface ShopLocationProps {
  cartData: any;
}

const ShopsMap: React.FC<ShopLocationProps> = ({ cartData }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded) return <p>Loading map...</p>;

  const locations =
    cartData?.cart
      ?.map((shopItem: any) => {
        const lat = parseFloat(shopItem?.shop?.address?.latitude ?? "0");
        const lng = parseFloat(shopItem?.shop?.address?.longitude ?? "0");
        const name = shopItem?.shop?.shop_name;
        return lat && lng ? { lat, lng, name } : null;
      })
      ?.filter(Boolean) || [];

  const center = locations[0] || { lat: 23.78, lng: 90.39, name: "Default" };

  return (
    <section className="mb-10">
      <h3 className="section_sub_title">🗺️ All Shops on Map</h3>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {locations.map((loc: any, index: number) => (
          <Marker
            key={index}
            position={{ lat: loc.lat, lng: loc.lng }}
            title={loc.name}
          />
        ))}
      </GoogleMap>
    </section>
  );
};

export default ShopsMap;
