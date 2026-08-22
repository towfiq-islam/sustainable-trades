import {
  CartItem,
  Fulfillment,
  VendorFormFields,
  VendorFormValues,
  CheckoutProductPayload,
  CheckoutDeliveryAddressPayload,
  CheckoutPickupAddressPayload,
  CheckoutVendorOrder,
  VendorExtrasMap,
  VendorOrdersPayload,
  CheckoutPayload,
} from "@/Types";

export type {
  VendorFormFields,
  VendorFormValues,
  CheckoutProductPayload,
  CheckoutDeliveryAddressPayload,
  CheckoutPickupAddressPayload,
  CheckoutVendorOrder,
  VendorExtrasMap,
  VendorOrdersPayload,
  CheckoutPayload,
};

export const formatDiscountLabel = (
  type?: "percentage" | "fixed" | null,
  value?: number | null,
) => {
  if (!type || value == null) return "Discount";
  return type === "percentage"
    ? `Discount (${value}%)`
    : `Discount ($${value})`;
};

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
          apt: fields.apt ?? null,
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
export const buildVendorOrdersPayload = (
  items: CartItem[],
  formValues: VendorFormValues,
  vendorExtras: VendorExtrasMap = {},
): VendorOrdersPayload => {
  return { vendor_orders: buildVendorOrders(items, formValues, vendorExtras) };
};

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
