"use client";
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Circle,
  useJsApiLoader,
} from "@react-google-maps/api";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ShopAddress } from "@/Types";

const containerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "12px",
  position: "relative" as const,
};

interface ProductImage {
  id: number;
  product_id: number;
  image: string;
}

interface Shop {
  id: number;
  user_id: number;
  shop_name: string;
  address: ShopAddress;
}

interface Product {
  id: number;
  shop_info_id: number;
  product_name: string;
  product_price: number;
  reviews_avg_rating: number | null;
  images: ProductImage[];
  shop: Shop;
}

interface ProductMapProps {
  products: Product[];
  hoveredProduct?: Product | null;
  productLoading?: boolean;
}

// Spiderfy positions
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

const ProductMap: React.FC<ProductMapProps> = ({
  products,
  hoveredProduct,
  productLoading,
}) => {
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedMarkerPos, setSelectedMarkerPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const router = useRouter();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Prepare locations
  const locations = products
    .map(product => {
      const addr = product.shop?.address;
      if (!addr) return null;
      const lat = parseFloat(addr.latitude ?? "0");
      const lng = parseFloat(addr.longitude ?? "0");
      if (!lat || !lng) return null;
      return { id: product.id, lat, lng, product };
    })
    .filter(
      (
        item
      ): item is { id: number; lat: number; lng: number; product: Product } =>
        item !== null
    );

  const defaultCenter = locations[0]
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : { lat: 23.78, lng: 90.39 };

  useEffect(() => {
    if (!hoveredProduct?.shop?.address) {
      setSelected(null);
      setSelectedMarkerPos(null);
      return;
    }
    const addr = hoveredProduct.shop.address;
    const lat = parseFloat(addr.latitude ?? "0");
    const lng = parseFloat(addr.longitude ?? "0");
    if (lat && lng) {
      setSelected(hoveredProduct);
      setSelectedMarkerPos({ lat, lng });
    } else {
      setSelected(null);
      setSelectedMarkerPos(null);
    }
  }, [hoveredProduct]);

  if (!isLoaded)
    return <p className="text-center text-gray-500">Loading map...</p>;

  // Group products by same lat/lng
  const groupedLocations: {
    [key: string]: { id: number; lat: number; lng: number; product: Product }[];
  } = {};
  locations.forEach(loc => {
    const key = `${loc.lat}-${loc.lng}`;
    if (!groupedLocations[key]) groupedLocations[key] = [];
    groupedLocations[key].push(loc);
  });

  return (
    <div className="relative w-full h-[450px] xl:h-[550px]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={11}
      >
        {Object.values(groupedLocations).map(group => {
          const { lat, lng } = group[0];
          const positions = spiderfyPositions(lat, lng, group.length);

          return group.map((loc, idx) => {
            const addr = loc.product.shop.address;
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
                    radius={804}
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
                    setSelected(loc.product);
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
            options={{ pixelOffset: new window.google.maps.Size(0, -35) }}
          >
            <div
              onClick={() => router.push(`/product-details/${selected.id}`)}
              className="w-[220px] cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group flex gap-3"
            >
              {productLoading ? (
                <div className="w-full h-24 bg-gray-200 animate-pulse" />
              ) : (
                <>
                  <figure className="w-[70px] h-[70px] overflow-hidden shrink-0 rounded-lg">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/${selected.images?.[0]?.image}`}
                      alt={selected.product_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </figure>

                  <div>
                    <h3 className="text-sm font-semibold text-primary-green truncate group-hover:underline">
                      {selected.product_name}
                    </h3>
                    <div className="flex gap-0.5 items-center py-1">
                      {Array.from({
                        length: +(selected.reviews_avg_rating || 0),
                      }).map((_, idx) => (
                        <FaStar
                          key={idx}
                          className="text-primary-green text-xs"
                        />
                      ))}
                      {Array.from({
                        length: 5 - +(selected.reviews_avg_rating || 0),
                      }).map((_, idx) => (
                        <FaRegStar
                          key={idx}
                          className="text-primary-green text-xs"
                        />
                      ))}
                    </div>
                    <p className="text-secondary-gray font-semibold text-xs">
                      {selected.shop.address.display_my_address
                        ? selected.shop.address.address_line_1
                        : `${selected.shop.address.city || "N/A"}, ${
                            selected.shop.address.state || "N/A"
                          }`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default ProductMap;
