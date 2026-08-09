import { CartItem } from "@/redux/slices/cartSlice";
import { Fulfillment } from "@/lib/fulfillment";

// ---- Checkout payload builder ----

export interface VendorFormFields {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
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
  coupon_code: string | null;
  subscribe_shop: 0 | 1;
  products: CheckoutProductPayload[];
  address: CheckoutDeliveryAddressPayload | CheckoutPickupAddressPayload;
}

// Per-vendor extras that live outside the RHF delivery-details form
// (set later, on ReviewStep) - coupon code + shop newsletter opt-in.
export type VendorExtrasMap = Record<
  number,
  { coupon_code?: string | null; subscribe_shop?: boolean }
>;

const buildVendorOrders = (
  items: CartItem[],
  formValues: VendorFormValues,
  vendorExtras: VendorExtrasMap = {},
): CheckoutVendorOrder[] => {
  return items.map(vendor => {
    const fields = formValues[vendor.vendor_id] || {};
    const extras = vendorExtras[vendor.vendor_id] || {};
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
      coupon_code: extras.coupon_code ?? null,
      subscribe_shop: extras.subscribe_shop ? 1 : 0,
      products: vendor.products.map(product => ({
        id: product.id,
        quantity: product.quantity,
      })),
      address,
    };
  });
};

// { vendor_orders: [...] } — used in DeliveryDetails.tsx for the initial
// tax/shipping calculation, before coupon/newsletter extras exist yet.
export interface VendorOrdersPayload {
  vendor_orders: CheckoutVendorOrder[];
}

export const buildVendorOrdersPayload = (
  items: CartItem[],
  formValues: VendorFormValues,
  vendorExtras: VendorExtrasMap = {},
): VendorOrdersPayload => {
  return { vendor_orders: buildVendorOrders(items, formValues, vendorExtras) };
};

export interface CheckoutPayload {
  payment_method: "paypal";
  terms_and_condition: boolean;
  subscribe_website: boolean;
  vendor_orders: CheckoutVendorOrder[];
}

export const buildCheckoutPayload = (
  items: CartItem[],
  formValues: VendorFormValues,
  vendorExtras: VendorExtrasMap,
  options: {
    payment_method?: "paypal";
    terms_and_condition: boolean;
    subscribe_website: boolean;
  },
): CheckoutPayload => {
  return {
    payment_method: options.payment_method ?? "paypal",
    terms_and_condition: options.terms_and_condition,
    subscribe_website: options.subscribe_website,
    vendor_orders: buildVendorOrders(items, formValues, vendorExtras),
  };
};
