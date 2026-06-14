"use client";
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Circle,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useRouter } from "next/navigation";

interface Address {
  id: number;
  shop_info_id: number;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  display_my_address: boolean;
  address_10_mile: boolean;
  do_not_display: boolean;
}

interface ShopInfo {
  id: number;
  user_id: number;
  shop_name: string;
  shop_image: string;
  shop_banner?: string;
  address: Address;
}

interface Shop {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string | null;
  shop_info: ShopInfo;
}

interface ShopsMapProps {
  shops: Shop[];
  hoveredShop?: Shop | null;
  shopLoading?: boolean;
  height?: string;
}

// Spiderfy positions for overlapping markers
const spiderfyPositions = (lat: number, lng: number, count: number) => {
  const positions: { lat: number; lng: number }[] = [];
  if (count <= 8) {
    const radius = 0.00008 * count;
    const angleStep = (2 * Math.PI) / count;
    for (let i = 0; i < count; i++) {
      positions.push({
        lat: lat + radius * Math.cos(angleStep * i),
        lng: lng + radius * Math.sin(angleStep * i),
      });
    }
  } else {
    const maxPerCircle = 8;
    let placed = 0;
    const circles = Math.ceil(count / maxPerCircle);
    for (let c = 0; c < circles; c++) {
      const itemsInCircle = Math.min(maxPerCircle, count - placed);
      const radius = 0.00008 * itemsInCircle;
      const angleStep = (2 * Math.PI) / itemsInCircle;
      for (let i = 0; i < itemsInCircle; i++) {
        positions.push({
          lat: lat + radius * Math.cos(angleStep * i),
          lng: lng + radius * Math.sin(angleStep * i),
        });
        placed++;
      }
    }
  }
  return positions;
};

const ShopsMap: React.FC<ShopsMapProps> = ({
  shops,
  hoveredShop,
  shopLoading,
  height,
}) => {
  const containerStyle = {
    width: "100%",
    height: height ? height : "550px",
    borderRadius: "12px",
    position: "relative" as const,
  };

  const [selected, setSelected] = useState<Shop | null>(null);
  const [selectedMarkerPos, setSelectedMarkerPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const locations = shops
    .map(shop => {
      const addr = shop.shop_info?.address;
      if (!addr) return null;
      const lat = parseFloat(addr.latitude ?? "0");
      const lng = parseFloat(addr.longitude ?? "0");
      if (!lat || !lng) return null;
      return { id: shop.id, lat, lng, shop };
    })
    .filter(
      (item): item is { id: number; lat: number; lng: number; shop: Shop } =>
        item !== null,
    );

  const defaultCenter = locations[0]
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : { lat: 23.78, lng: 90.39 };

  useEffect(() => {
    if (!hoveredShop?.shop_info?.address) {
      setSelected(null);
      setSelectedMarkerPos(null);
      return;
    }
    const addr = hoveredShop.shop_info.address;
    const lat = parseFloat(addr.latitude ?? "0");
    const lng = parseFloat(addr.longitude ?? "0");
    if (lat && lng) {
      setSelected(hoveredShop);
      setSelectedMarkerPos({ lat, lng });
    } else {
      setSelected(null);
      setSelectedMarkerPos(null);
    }
  }, [hoveredShop]);

  if (!isLoaded)
    return <p className="text-center text-gray-500">Loading map...</p>;

  // Group shops by same lat/lng
  const groupedLocations: {
    [key: string]: { id: number; lat: number; lng: number; shop: Shop }[];
  } = {};
  locations.forEach(loc => {
    const key = `${loc.lat}-${loc.lng}`;
    if (!groupedLocations[key]) groupedLocations[key] = [];
    groupedLocations[key].push(loc);
  });

  return (
    <div className="relative w-full h-[550px]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
      >
        {Object.values(groupedLocations).map(group => {
          const { lat, lng } = group[0];
          const positions = spiderfyPositions(lat, lng, group.length);

          return group.map((loc, idx) => {
            const addr = loc.shop.shop_info.address;
            const { display_my_address, address_10_mile, do_not_display } =
              addr;
            if (!display_my_address && !address_10_mile && !do_not_display)
              return null;

            const markerPos = positions[idx];

            return (
              <React.Fragment key={loc.id}>
                {(address_10_mile || do_not_display) && idx === 0 && (
                  <Circle
                    center={{ lat, lng }}
                    radius={804} // 0.5 miles
                    options={{
                      strokeColor: "#4CAF50",
                      strokeOpacity: 0.7,
                      strokeWeight: 2,
                      fillColor: "#4CAF50",
                      fillOpacity: 0.25,
                    }}
                  />
                )}
                <Marker
                  position={markerPos}
                  onClick={() => {
                    setSelected(loc.shop);
                    setSelectedMarkerPos(markerPos);
                  }}
                  animation={window.google.maps.Animation.DROP}
                />
              </React.Fragment>
            );
          });
        })}

        {/* InfoWindow */}
        {selected && selectedMarkerPos && (
          <InfoWindow
            position={selectedMarkerPos}
            onCloseClick={() => {
              setSelected(null);
              setSelectedMarkerPos(null);
            }}
            options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
          >
            <div
              onClick={() =>
                router.push(
                  `/shop-details?view=customer&id=${selected.shop_info.user_id}&listing_id=${selected.shop_info.id}`,
                )
              }
              className="flex items-center gap-2 cursor-pointer group"
            >
              {shopLoading ? (
                <div className="w-24 h-12 bg-gray-200 animate-pulse rounded-md" />
              ) : (
                <>
                  {selected.shop_info.shop_image && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/${selected.shop_info.shop_image}`}
                      alt={selected.shop_info.shop_name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}
                  <span className="text-sm font-semibold group-hover:underline text-primary-green">
                    {selected.shop_info.shop_name}
                  </span>
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default ShopsMap;
