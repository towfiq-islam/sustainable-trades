import { Fulfillment } from "./fulfillment";

// ── Checkout Step ─────────────────────────────────────────────────────────────

export type CheckoutStep =
  | "delivery-options"
  | "delivery-details"
  | "review-order"
  | "payment";

// ── Vendor Form Fields ────────────────────────────────────────────────────────

export interface VendorFormFields {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  street_address?: string;
  apt?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  pickup_id?: string;
}

export type VendorFormValues = Record<string, VendorFormFields>;

// ── Checkout Payloads ─────────────────────────────────────────────────────────

export interface CheckoutProductPayload {
  id: number;
  quantity: number;
}

export interface CheckoutDeliveryAddressPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  apt: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

export interface CheckoutPickupAddressPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pickup_id: number;
}

export interface CheckoutVendorOrder {
  vendor_id: number;
  shop_id: number;
  selectedFulfillment: Fulfillment;
  coupon_code: string | null;
  subscribe_shop: 0 | 1;
  products: CheckoutProductPayload[];
  address: CheckoutDeliveryAddressPayload | CheckoutPickupAddressPayload;
}

export type VendorExtrasMap = Record<
  number,
  { coupon_code?: string | null; subscribe_shop?: boolean }
>;

export interface VendorOrdersPayload {
  vendor_orders: CheckoutVendorOrder[];
}

export interface CheckoutPayload {
  payment_method: "paypal";
  terms_and_condition: boolean;
  subscribe_website: boolean;
  vendor_orders: CheckoutVendorOrder[];
}

// ── Checkout Pricing ──────────────────────────────────────────────────────────

export interface PickupLocationSelection {
  id: number;
  location_name: string;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface VendorPricing {
  vendor_id: number;
  tax_amount: number;
  shipping_amount: number;
  delivery_amount: number;
  discount_amount: number;
  total_amount: number;
}

export interface MasterPricing {
  sub_total: number;
  tax_amount: number;
  shipping_amount: number;
  delivery_amount: number;
  discount_amount: number;
  total_amount: number;
}

export interface VendorExtras {
  coupon_code: string | null;
  subscribe_shop: boolean;
  discount_amount: number;
  discount_type?: "percentage" | "fixed" | null;
  discount_value?: number | null;
  pickup_location?: PickupLocationSelection | null;
}
