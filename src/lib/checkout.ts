import { CartItem } from "@/redux/slices/cartSlice";
import { Fulfillment } from "@/lib/fulfillment";

// ---- Pricing helpers (used by ReviewStep / PaymentStep for on-screen totals) ----
// TODO: swap for real tax/shipping API once available
export const TAX_RATE = 0.08;
export const FLAT_SHIPPING_FEE = 5;

export const calcVendorSubtotal = (
  products: { price: number; quantity: number }[],
) => products.reduce((sum, p) => sum + p.price * p.quantity, 0);

export const calcVendorTax = (subtotal: number) => subtotal * TAX_RATE;

export const calcVendorShipping = (fulfillment?: string) =>
  fulfillment === "shipping" ? FLAT_SHIPPING_FEE : 0;

// ---- Checkout payload builder ----

// Matches the fields registered per-vendor in DeliveryDetails.tsx,
// under vendors.{vendor_id}.* in the shared FormProvider
export interface VendorFormFields {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  // delivery / shipping only
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  // pickup only
  pickup_id?: string;
}

export type VendorFormValues = Record<string, VendorFormFields>;

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
  products: CheckoutProductPayload[];
  address: CheckoutDeliveryAddressPayload | CheckoutPickupAddressPayload;
}

export interface CheckoutPayload {
  coupon_code: string | null;
  payment_method: "paypal";
  terms_and_condition: boolean;
  subscribe_website: boolean;
  vendor_orders: CheckoutVendorOrder[];
}

export const buildCheckoutPayload = (
  items: CartItem[],
  formValues: VendorFormValues,
  options: {
    coupon_code?: string | null;
    payment_method?: "paypal";
    terms_and_condition: boolean;
    subscribe_website?: boolean;
  },
): CheckoutPayload => {
  const vendor_orders: CheckoutVendorOrder[] = items.map(vendor => {
    const fields = formValues[vendor.vendor_id] || {};
    const fulfillment = vendor.selectedFulfillment as Fulfillment;
    const isPickup = fulfillment === "pickup";

    const address: CheckoutVendorOrder["address"] = isPickup
      ? {
          first_name: fields.first_name ?? "",
          last_name: fields.last_name ?? "",
          email: fields.email ?? "",
          phone: fields.phone ?? "",
          pickup_id: Number(fields.pickup_id ?? 0),
        }
      : {
          first_name: fields.first_name ?? "",
          last_name: fields.last_name ?? "",
          email: fields.email ?? "",
          phone: fields.phone ?? "",
          street_address: fields.street_address ?? "",
          city: fields.city ?? "",
          state: fields.state ?? "",
          postal_code: fields.postal_code ?? "",
          country: fields.country ?? "",
          latitude: fields.latitude ?? null,
          longitude: fields.longitude ?? null,
        };

    return {
      vendor_id: vendor.vendor_id,
      shop_id: vendor.shop_id,
      selectedFulfillment: fulfillment,
      products: vendor.products.map(product => ({
        id: product.id,
        quantity: product.quantity,
      })),
      address,
    };
  });

  return {
    coupon_code: options.coupon_code ?? null,
    payment_method: options.payment_method ?? "paypal",
    terms_and_condition: options.terms_and_condition,
    subscribe_website: options.subscribe_website ?? false,
    vendor_orders,
  };
};
