import { CartItem } from "@/redux/slices/cartSlice";
import { Fulfillment } from "@/lib/fulfillment";

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

const buildVendorOrders = (
  items: CartItem[],
  formValues: VendorFormValues,
): CheckoutVendorOrder[] => {
  return items.map(vendor => {
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
};

// { vendor_orders: [...] } — used in DeliveryDetails.tsx to send addresses
// and product selections for tax/shipping calculation before payment.
export interface VendorOrdersPayload {
  vendor_orders: CheckoutVendorOrder[];
}

export const buildVendorOrdersPayload = (
  items: CartItem[],
  formValues: VendorFormValues,
): VendorOrdersPayload => {
  return { vendor_orders: buildVendorOrders(items, formValues) };
};

// Full /checkout request body — used in PaymentStep.tsx right before hitting
// the API. Wraps buildVendorOrders with the payment-level fields.
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
  return {
    coupon_code: options.coupon_code ?? null,
    payment_method: options.payment_method ?? "paypal",
    terms_and_condition: options.terms_and_condition,
    subscribe_website: options.subscribe_website ?? false,
    vendor_orders: buildVendorOrders(items, formValues),
  };
};
