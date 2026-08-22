export interface ApiDeliveryOrigin {
  id: number;
  user_id: number;
  address: string;
  latitude: string;
  longitude: string;
  unit: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface ApiDeliveryRange {
  id: number;
  min_distance: number | string;
  max_distance: number | string;
  delivery_fee: number | string;
}

export interface DeliveryOrigin {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface DeliveryRange {
  id: number;
  minMiles: number;
  maxMiles: number;
  fee: number;
}

export function mapApiOriginToOrigin(api: ApiDeliveryOrigin): DeliveryOrigin {
  return {
    street: api.address,
    apartment: api.unit ?? undefined,
    city: api.city,
    state: api.state,
    zip: api.zip_code,
    country: api.country === "US" ? "United States" : api.country,
  };
}

export function mapApiRangeToRange(api: ApiDeliveryRange): DeliveryRange {
  return {
    id: api.id,
    minMiles: Number(api.min_distance),
    maxMiles: Number(api.max_distance),
    fee: Number(api.delivery_fee),
  };
}

export function formatFee(fee: number): string {
  return fee === 0 ? "$0.00 (Free)" : `$${fee.toFixed(2)}`;
}
